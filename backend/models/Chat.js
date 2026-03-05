const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },

  // original text response
  content: { type: String, required: true },

  // NEW fields for AI structured response
  summary: { type: String, default: null },
  query: { type: String, default: null },
  insights: { type: String, default: null },

  // table result
  dataframe: { type: Object, default: null },

  timestamp: { type: Date, default: Date.now },
});

const ChatSessionSchema = new mongoose.Schema({
  title: { type: String, default: "New Session" },
  source: { type: String, required: true },
  messages: [MessageSchema],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatSession", ChatSessionSchema);
