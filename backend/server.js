const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const mongoose = require("mongoose");
const { connectDatabases } = require('./config/db');
const { getAiResponse, autofixMySqlSql } = require('./services/aiAgent');
const multer = require('multer');
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
app.use("/api/auth", authRoutes);


// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'temp_data');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

// Initialize DBs (MySQL, Postgres, Mongo)
connectDatabases();

// Chat endpoint - main AI interaction
app.post('/api/chat', async (req, res) => {
    const { message, source, filePath } = req.body;
    try {
        const aiRes = await getAiResponse(message, source, filePath);
        res.json(aiRes);
    } catch (err) {
        console.error('Chat route error:', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
});

// Autofix endpoint (MySQL only): fix SQL and execute it
app.post('/api/mysql/autofix', async (req, res) => {
    const { sql, errorMessage } = req.body || {};
    try {
        const llm = new (require("@langchain/openai").ChatOpenAI)({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: "gpt-4o-mini",
            temperature: 0,
        });
        const { getMysqlConn } = require('./config/db');
        const mysqlConn = getMysqlConn();
        if (!mysqlConn) {
            return res.status(400).json({ error: 'MySQL connection not initialized.' });
        }

        const fix = await autofixMySqlSql({ llm, mysqlConn, sql, errorMessage });
        if (fix.blocked) {
            return res.json({ blocked: true, reason: fix.reason });
        }

        const fixedSql = fix.fixedSql;
        const isSelect = /^\s*SELECT\s/i.test(fixedSql);
        if (isSelect) {
            const [data] = await mysqlConn.query(fixedSql);
            return res.json({
                blocked: false,
                fixedSql,
                role: "assistant",
                summary: `Autofixed and executed successfully. ${data.length} record(s) retrieved.`,
                query: fixedSql,
                dataframe: data,
                insights: data.length ? `Total ${data.length} row(s) in the result.` : "No matching records.",
            });
        }

        await mysqlConn.query(fixedSql);
        return res.json({
            blocked: false,
            fixedSql,
            role: "assistant",
            summary: "Autofixed and executed successfully in MySQL Workbench.",
            query: fixedSql,
            dataframe: [],
            insights: "Done.",
        });
    } catch (err) {
        console.error('Autofix route error:', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.json({ filePath: req.file.path, fileName: req.file.originalname });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));