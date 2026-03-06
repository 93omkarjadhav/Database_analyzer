const { ChatOpenAI } = require("@langchain/openai");
const fs = require("fs");
const csv = require("csv-parser");
const { MongoClient } = require("mongodb");
const { getMysqlConn, getPgPool, getSqliteDb,getBigQuery } = require("../config/db");

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
  // --- 1. MySQL Logic (with schema + auto-fix) ---
  if (source === "MySQL Database" && mysqlConn) {
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

    let sqlRes = await llm.invoke(
      `You are a MySQL expert. Use ONLY the columns listed. Schema: ${schemaStr}. User question: ${prompt}. Return ONLY valid MySQL SQL, no markdown.`,
    );
    let sql = sqlRes.content.replace(/```sql|```/g, "").trim();

    const [data] = await mysqlConn.query(sql);

    const summary = `The system executed a query on the MySQL database to answer your question. ${data.length} records were retrieved.`;

    const insights =
      data.length > 0
        ? `There are total ${data.length} items found in the result.`
        : "No matching records were found.";

    return {
      role: "assistant",
      summary: summary,
      query: sql,
      dataframe: data,
      insights: insights,
    };
  }

  // --- 2. PostgreSQL Logic (with schema + auto-fix) ---
  if (source === "PostgreSQL" || source === "PostgreSQL (Local Agent)") {
    if (!pgPool) {
      return { role: "assistant", content: "PostgreSQL pool not initialized." };
    }

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

    let sqlRes = await llm.invoke(
      `You are a PostgreSQL expert. Use ONLY the columns listed. Schema: ${schemaStr}. User question: ${prompt}. Return ONLY valid SQL, no markdown.`,
    );
    let sql = sqlRes.content.replace(/```sql|```/g, "").trim();

    const res = await pgPool.query(sql);
    const summary = `The system executed a query on the PostgreSQL database and retrieved ${res.rows.length} records.`;

    const insights =
      res.rows.length > 0
        ? `There are total ${res.rows.length} items found in the result.`
        : "No matching records were found.";

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
          const sample = JSON.stringify(results.slice(0, 15));

          const analysisPrompt = `You are a data analyst. User asked: "${prompt}"

CSV has ${totalRows} rows and columns: ${columns.join(", ")}.
Sample (first 15 rows): ${sample}

Return a JSON object with:
1. "summary": A clear, concise analysis answering the user's question. If they asked for "top N rows" or "first N rows", acknowledge that and describe the data.
2. "rowLimit": How many rows to show (number). For "top 5 rows" or "first 5" use 5. For "top 10" use 10. For general analysis use up to 20. Never exceed ${totalRows}.

Output ONLY valid JSON, e.g. {"summary":"...","rowLimit":5}`;

          const analysisRes = await llm.invoke(analysisPrompt);
          let summary = "";
          let rowLimit = 10;

          try {
            const jsonMatch = analysisRes.content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              summary = parsed.summary || analysisRes.content;
              rowLimit = Math.min(
                Math.max(1, parseInt(parsed.rowLimit, 10) || 10),
                totalRows,
              );
            } else {
              summary = analysisRes.content;
            }
          } catch {
            summary = analysisRes.content;
          }

          const rowsToShow = results.slice(0, rowLimit);
          const insights =
            rowsToShow.length > 0
              ? `Showing ${rowsToShow.length} rows from the uploaded dataset.`
              : "No data found in the file.";

          resolve({
            role: "assistant",
            summary: summary,
            query: "CSV Data Analysis",
            dataframe: rowsToShow,
            insights: insights,
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

module.exports = { getAiResponse };
