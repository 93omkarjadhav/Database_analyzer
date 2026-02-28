const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { connectDatabases } = require('./config/db');
const { getAiResponse } = require('./services/aiAgent');
const multer = require('multer');

dotenv.config();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'temp_data');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

const app = express();
app.use(cors());
app.use(express.json());

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

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.json({ filePath: req.file.path, fileName: req.file.originalname });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));