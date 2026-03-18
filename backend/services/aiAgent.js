const { ChatOpenAI } = require("@langchain/openai");
const fs = require("fs");
const csv = require("csv-parser");
const { MongoClient } = require("mongodb");
const { getMysqlConn, getPgPool, getSqliteDb, getBigQuery } = require("../config/db");

async function getMySqlSchemaString(mysqlConn) {
  const [schemaRows] = await mysqlConn.query(`
    SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE()
    ORDER BY TABLE_NAME, ORDINAL_POSITION
  `);
  const schemaByTable = {};
  for (const r of schemaRows) {
    const t = r.TABLE_NAME;
    if (!schemaByTable[t]) schemaByTable[t] = [];
    schemaByTable[t].push(`${r.COLUMN_NAME} (${r.DATA_TYPE})`);
  }
  return Object.entries(schemaByTable)
    .map(([t, cols]) => `${t}(${cols.join(", ")})`)
    .join("; ");
}

async function autofixMySqlSql({ llm, mysqlConn, sql, errorMessage }) {
  const FORBIDDEN = /DROP\s|DELETE\s|TRUNCATE\s/i;
  if (sql.includes("FORBIDDEN_ACTION") || FORBIDDEN.test(sql)) {
    return {
      blocked: true,
      reason: "⚠️ Restricted: You do not have permission to DROP or DELETE data.",
    };
  }

  const schemaStr = await getMySqlSchemaString(mysqlConn);
  const fixPrompt = `You are a MySQL expert.
Goal: Fix the SQL query so it runs successfully.

Rules:
- Return ONLY SQL, no markdown, no explanations.
- Use ONLY the columns listed in the schema.
- Do NOT use DROP, DELETE, or TRUNCATE.
- Prefer the minimal correction (keep intent the same).

Schema: ${schemaStr}
Broken SQL: ${sql}
MySQL Error: ${errorMessage}
`;

  const fixRes = await llm.invoke(fixPrompt);
  const fixedSql = fixRes.content.replace(/```sql|```/g, "").trim();

  if (fixedSql.includes("FORBIDDEN_ACTION") || FORBIDDEN.test(fixedSql)) {
    return {
      blocked: true,
      reason: "⚠️ Restricted: You do not have permission to DROP or DELETE data.",
    };
  }

  return { blocked: false, fixedSql };
}

const getAiResponse = async (prompt, source, filePath) => {
  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-mini",
    temperature: 0,
  });

  const mysqlConn = getMysqlConn();
  const pgPool = getPgPool();
  const sqliteDb = getSqliteDb();
  const bigqueryClient = getBigQuery();
  // --- 1. MySQL Logic: realtime CREATE/INSERT/UPDATE/SELECT, block DROP/DELETE ---
  if (source === "MySQL Database" && mysqlConn) {
    const FORBIDDEN = /DROP\s|DELETE\s|TRUNCATE\s/i;

    const isLikelyRawSql = (text) => {
      const t = text.trim().toUpperCase();
      return (
        t.startsWith("CREATE ") ||
        t.startsWith("INSERT ") ||
        t.startsWith("UPDATE ") ||
        t.startsWith("SELECT ") ||
        t.startsWith("ALTER ")
      );
    };

    let sql;
    if (isLikelyRawSql(prompt)) {
      sql = prompt.replace(/```sql|```/g, "").trim();
    } else {
      const [schemaRows] = await mysqlConn.query(`
        SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE()
        ORDER BY TABLE_NAME, ORDINAL_POSITION
      `);
      const schemaByTable = {};
      for (const r of schemaRows) {
        const t = r.TABLE_NAME;
        if (!schemaByTable[t]) schemaByTable[t] = [];
        schemaByTable[t].push(`${r.COLUMN_NAME} (${r.DATA_TYPE})`);
      }
      const schemaStr = Object.entries(schemaByTable)
        .map(([t, cols]) => `${t}(${cols.join(", ")})`)
        .join("; ");
      const sqlRes = await llm.invoke(
        `You are a MySQL expert. Use ONLY the columns listed. Schema: ${schemaStr}. User question: ${prompt}. Return ONLY valid MySQL SQL, no markdown. Do NOT use DROP, DELETE, or TRUNCATE.`,
      );
      sql = sqlRes.content.replace(/```sql|```/g, "").trim();
    }

    if (sql.includes("FORBIDDEN_ACTION") || FORBIDDEN.test(sql)) {
      return {
        role: "assistant",
        content: "⚠️ Restricted: You do not have permission to DROP or DELETE data.",
        summary: "Command Blocked",
        query: null,
        dataframe: null,
        insights: null,
      };
    }

    try {
      const isSelect = /^\s*SELECT\s/i.test(sql);
      if (isSelect) {
        const [data] = await mysqlConn.query(sql);
        const summary = `Executed query on MySQL. ${data.length} record(s) retrieved.`;
        const insights =
          data.length > 0
            ? `Total ${data.length} row(s) in the result.`
            : "No matching records.";
        return {
          role: "assistant",
          content: summary,
          summary,
          query: sql,
          dataframe: data,
          insights,
        };
      }
      await mysqlConn.query(sql);
      const summary = "Command executed successfully in MySQL Workbench.";
      const insights =
        /INSERT/i.test(sql) ? "Rows inserted." :
        /UPDATE/i.test(sql) ? "Rows updated." :
        /CREATE/i.test(sql) ? "Table created." :
        "Done.";
      return {
        role: "assistant",
        content: summary,
        summary,
        query: sql,
        dataframe: [],
        insights,
      };
    } catch (err) {
      return {
        role: "assistant",
        content: `MySQL error: ${err.message}`,
        summary: "Error",
        query: sql,
        error: err.message,
        dataframe: null,
        insights: null,
      };
    }
  }

  // --- 2. PostgreSQL Logic (with schema + auto-fix) ---
if (source === "PostgreSQL" || source === "PostgreSQL (Local Agent)") {

  if (!pgPool) {
    return { role: "assistant", content: "PostgreSQL pool not initialized." };
  }

  // -----------------------------
  // GET DATABASE SCHEMA
  // -----------------------------
  const schemaRes = await pgPool.query(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `);

  const schemaByTable = {};

  for (const r of schemaRes.rows) {
    const t = r.table_name;
    if (!schemaByTable[t]) schemaByTable[t] = [];
    schemaByTable[t].push(`${r.column_name} (${r.data_type})`);
  }

  const schemaStr = Object.entries(schemaByTable)
    .map(([t, cols]) => `${t}(${cols.join(", ")})`)
    .join("; ");

  // -----------------------------
  // AI SQL GENERATION
  // -----------------------------
  const sqlRes = await llm.invoke(`
You are a PostgreSQL database expert.

DATABASE SCHEMA:
${schemaStr}

USER QUESTION:
"${prompt}"

INSTRUCTIONS:
- Generate a valid PostgreSQL SQL query.
- Use ONLY the tables and columns provided in the schema.
- Always include ORDER BY when selecting rows.
- If the user asks for "last records", use ORDER BY id DESC.
- If the user asks for "first records", use ORDER BY id ASC.
- If the user asks for counts, use COUNT().
- If the user asks for grouping or aggregations, use GROUP BY.
- Always include LIMIT 50 for safety unless the user specifies a limit.
- Return ONLY the SQL query.
- Do NOT include explanation.

Example:
User: give me last 5 records
SQL:
SELECT * FROM users ORDER BY id DESC LIMIT 5;
`);

  let sql = sqlRes.content.replace(/```sql|```/g, "").trim();

  // -----------------------------
  // EXECUTE SQL
  // -----------------------------
  const res = await pgPool.query(sql);

  // -----------------------------
  // GENERATE SUMMARY
  // -----------------------------
  const summaryRes = await llm.invoke(`
User question: "${prompt}"

SQL Query executed:
${sql}

Number of rows returned:
${res.rows.length}

Write a short 1-2 line summary explaining the result.
`);

  const summary = summaryRes.content;

  // -----------------------------
  // INSIGHTS
  // -----------------------------
  const insights =
    res.rows.length > 0
      ? `There are ${res.rows.length} records returned from the database.`
      : "No matching records were found in the database.";

  return {
    role: "assistant",
    summary: summary,
    query: sql,
    dataframe: res.rows,
    insights: insights,
  };
}

  // --- 3. MongoDB Logic (Theory + JSON + table) ---
  if (source === "MongoDB") {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db(process.env.MONGO_DB_NAME || "sql_agent");

    const mongoPrompt = `You are a MongoDB expert working over a collection named "products".
User question: "${prompt}".

1. Design a MongoDB aggregation pipeline that answers the question.
2. Do NOT include any explanation text outside the JSON.
3. Return ONLY a single JSON object with EXACTLY these keys:
   - "summary": a natural-language explanation of the result.
   - "data": the aggregation pipeline array to run (e.g. [{"$match": {...}}, {"$project": {...}}]).

Valid example:
{
  "summary": "Found all products in the Food category.",
  "data": [
    { "$match": { "category": "Food" } }
  ]
}`;

    const res = await llm.invoke(mongoPrompt);

    let parsed;
    try {
      // Extract the first {...} block in case the model still adds extra text
      const raw = res.content.replace(/```/g, "").trim();
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error("No JSON object found in model output");
      }
      parsed = JSON.parse(match[0]);
    } catch (e) {
      await client.close();
      return {
        role: "assistant",
        content: `Failed to parse MongoDB JSON description from the model. Raw output was:\n\n${res.content}`,
      };
    }

    const pipeline = Array.isArray(parsed.data) ? parsed.data : [];
    const result = await db
      .collection("products")
      .aggregate(pipeline)
      .toArray();
    await client.close();

    // content  = explanation
    // dataframe = table in UI
    // jsonData  = raw JSON docs
    return {
      role: "assistant",
      content: parsed.summary || "Query executed on MongoDB.",
      dataframe: result,
      jsonData: result,
    };
  }

  // --- 4. File Upload Logic (CSV Analysis) ---
if (source === "Upload File" && filePath) {

  const results = [];

  return new Promise((resolve, reject) => {

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))

      .on("end", async () => {

        const columns = results.length ? Object.keys(results[0]) : [];
        const totalRows = results.length;
        const lowerPrompt = prompt.toLowerCase();

        let filteredRows = results;
        let limit = 5;

        // -------- Extract number dynamically --------
        const parsedNumber = extractNumberFromText(lowerPrompt);
        if (parsedNumber) limit = parsedNumber;

        // -------- FIRST / LAST / TOP --------
        if (lowerPrompt.includes("last")) {

          filteredRows = results.slice(-limit);

        } 
        else if (lowerPrompt.includes("first") || lowerPrompt.includes("top")) {

          filteredRows = results.slice(0, limit);

        } 
        else {

          // -------- AI FILTER GENERATION --------
          const queryRes = await llm.invoke(`
You are analyzing CSV data.

Columns:
${columns.join(", ")}

User question:
"${prompt}"

Return a JavaScript filter condition using row.column.

Examples:

User: show records of Rohit
Output:
row.name.toLowerCase().includes("rohit")

User: users from Pune
Output:
row.city.toLowerCase() === "pune"

If no filtering needed return:
true

Return ONLY the condition.
`);

          let filterCode = queryRes.content
            .replace(/```/g, "")
            .trim();

          try {

            const filterFunction = new Function("row", `return ${filterCode}`);

            filteredRows = results.filter(filterFunction);

          } catch {

            filteredRows = results.slice(0, limit);

          }
        }

        if (filteredRows.length === 0) {
          filteredRows = results.slice(0, limit);
        }

        // -------- AI SUMMARY --------
        const summaryRes = await llm.invoke(`
User asked:
"${prompt}"

Rows returned:
${filteredRows.length}

Write a short explanation.
`);

        const summary = summaryRes.content;

        const insights =
          filteredRows.length > 0
            ? `Found ${filteredRows.length} matching rows in the uploaded CSV dataset.`
            : "No matching rows found.";

        resolve({
          role: "assistant",
          summary: summary,
          query: "CSV Data Analysis",
          dataframe: filteredRows,
          insights: insights
        });

      })

      .on("error", (err) => reject(err));

  });

}
  if (source === "Oracle") {
    return {
      role: "assistant",
      content:
        "Oracle support is not wired yet in this Node backend. Please use MySQL, PostgreSQL, MongoDB, or Upload File for now.",
    };
  }
  if (source === "SQLite") {
    if (!sqliteDb)
      return { role: "assistant", content: "SQLite database not connected." };

    return new Promise((resolve, reject) => {
      // 1. Correctly fetch real table names from sqlite_master
      sqliteDb.all(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
        async (err, rows) => {
          if (err)
            return resolve({
              role: "assistant",
              content: `Schema Error: ${err.message}`,
            });

          const tableNames = rows.map((r) => r.name).join(", ");

          if (!tableNames) {
            return resolve({
              role: "assistant",
              content:
                "The SQLite database is empty. Please run the seed script.",
            });
          }

          // 2. Generate the SQL using the actual discovered tables
          const sqlPrompt = `You are a SQLite expert. 
                Existing Tables: [${tableNames}]. 
                User Question: "${prompt}". 
                Return ONLY the SQLite SQL string. No markdown.`;

          const sqlRes = await llm.invoke(sqlPrompt);
          const sql = sqlRes.content.replace(/```sql|```/g, "").trim();

          // 3. Execute the generated query
          sqliteDb.all(sql, [], (err, data) => {
            if (err) {
              return resolve({
                role: "assistant",
                content: `Query Error: ${err.message}. SQL tried: \`${sql}\``,
              });
            }
            const summary = `The query was executed on the SQLite database and returned ${data.length} records.`;

            const insights =
              data.length > 0
                ? `There are total ${data.length} items found in the result.`
                : "No matching records were found.";

            resolve({
              role: "assistant",
              summary: summary,
              query: sql,
              dataframe: data,
              insights: insights,
            });
          });
        },
      );
    });
  }

  // Add/Update this block in your getAiResponse function
if (source === "BigQuery") {
    if (!bigqueryClient) return { role: "assistant", content: "BigQuery not connected." };

    const datasetId = 'sales_data';
    const [tables] = await bigqueryClient.dataset(datasetId).getTables();
    const tableNames = tables.map(t => t.id).join(", ");

    // STRICT PROMPT: Enforces Sandbox-friendly SELECT queries
    const sqlPrompt = `You are a BigQuery Data Warehouse expert for a project in SANDBOX MODE. 
    Dataset: 'retail-analytics-489405.${datasetId}', Tables: [${tableNames}].
    
    RULES:
    1. You can ONLY use 'SELECT' statements. DML (INSERT/UPDATE/DELETE) is strictly forbidden.
    2. Always use fully qualified names: \`retail-analytics-489405.${datasetId}.tableName\`.
    3. If the user asks to add data, explain that Sandbox mode only supports reading.
    
    User Question: "${prompt}". 
    Return ONLY the SQL string. No markdown.`;

    const sqlRes = await llm.invoke(sqlPrompt);
    const sql = sqlRes.content.replace(/```sql|```/g, "").trim();

    try {
        const [rows] = await bigqueryClient.query({ query: sql });
        return { 
            role: "assistant", 
            content: `Analytical Query Executed: \`${sql}\``, 
            dataframe: rows 
        };
    } catch (err) {
        // Handle common Sandbox errors gracefully
        return { role: "assistant", content: `Warehouse Analytics Error: ${err.message}` };
    }
}
  return {
    role: "assistant",
    content: "Source not recognized or data missing.",
  };
};

module.exports = { getAiResponse, autofixMySqlSql };
