const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    dataframe: { type: Object, default: null }, // To store table data
    timestamp: { type: Date, default: Date.now }
});

const ChatSessionSchema = new mongoose.Schema({
    title: { type: String, default: 'New Session' },
    source: { type: String, required: true },
    messages: [MessageSchema],
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);