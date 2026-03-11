import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_BASE}/api/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const sendChatMessage = async (message, source, filePath) => {
  const response = await axios.post(`${API_BASE}/api/chat`, {
    message,
    source,
    filePath,
  });
  return response.data;
};
