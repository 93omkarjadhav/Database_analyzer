import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import FullscreenModal from "./components/FullscreenModal";
import { uploadFile, sendChatMessage } from "./utils/apiUtils";
import { exportCSV, exportExcel, exportJSON, exportText } from "./utils/exportUtils";

function App() {
  // State management
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [fullscreenData, setFullscreenData] = useState(null);
  const [exportMenu, setExportMenu] = useState(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [editedPrompt, setEditedPrompt] = useState("");

  // Load sessions from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("retail-ai-sessions");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSessions(parsed);
      if (parsed.length) setActiveId(parsed[0].id);
    } else {
      const firstId = Date.now().toString();
      setSessions([
        {
          id: firstId,
          title: "New Session",
          messages: [],
          source: "MySQL Database",
          filePath: null,
          fileName: null,
        },
      ]);
      setActiveId(firstId);
    }
  }, []);

  // Persist sessions to localStorage
  useEffect(() => {
    if (sessions.length) {
      localStorage.setItem("retail-ai-sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  // Memoized active chat
  const activeChat = useMemo(
    () => sessions.find((s) => s.id === activeId),
    [sessions, activeId]
  );

  // Session management functions
  const createNewChat = () => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: "New Session",
      messages: [],
      source: "MySQL Database",
      filePath: null,
      fileName: null,
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(newId);
  };

  const deleteSession = (id) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (!filtered.length) return [];
      if (id === activeId) {
        setActiveId(filtered[0].id);
      }
      return filtered;
    });
  };

  const renameSession = (id) => {
    if (!editingTitle.trim()) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: editingTitle.trim() } : s))
    );
    setEditingId(null);
    setEditingTitle("");
  };

  const updateSource = (src) => {
    if (!activeChat) return;
    if (activeChat.source === src) return;
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: "New Session",
      messages: [],
      source: src,
      filePath: null,
      fileName: null,
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveId(newId);
  };

  // File upload handler
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !activeChat) return;
    try {
      setUploading(true);
      const data = await uploadFile(file);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                filePath: data.filePath,
                fileName: data.fileName,
                source: "Upload File",
              }
            : s
        )
      );
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  // Send message handler
  const handleSend = async () => {
    if (!input || loading || !activeChat) return;
    setLoading(true);
    const userMsg = { role: "user", content: input };
    const updatedMessages = [...activeChat.messages, userMsg];
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeId
          ? {
              ...s,
              messages: updatedMessages,
              title:
                s.title === "New Session"
                  ? `${input.slice(0, 25)}...`
                  : s.title,
            }
          : s
      )
    );
    setInput("");

    try {
      const data = await sendChatMessage(
        input,
        activeChat.source,
        activeChat.filePath
      );
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? { ...s, messages: [...updatedMessages, data] }
            : s
        )
      );
    } catch (err) {
      console.error("Chat Error:", err);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
                ...s,
                messages: [
                  ...updatedMessages,
                  { role: "assistant", content: "Error processing request." },
                ],
              }
            : s
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit prompt handler
  const saveEditedPrompt = async (index) => {
    if (!editedPrompt.trim()) return;
    const updatedMessages = activeChat.messages
      .slice(0, index + 1)
      .map((msg, i) => (i === index ? { ...msg, content: editedPrompt } : msg));

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeId ? { ...s, messages: updatedMessages } : s
      )
    );
    setEditingMessageIndex(null);

    try {
      setLoading(true);
      const data = await sendChatMessage(
        editedPrompt,
        activeChat.source,
        activeChat.filePath
      );
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? { ...s, messages: [...updatedMessages, data] }
            : s
        )
      );
    } catch (err) {
      console.error("Edit query error:", err);
    } finally {
      setLoading(false);
      setEditedPrompt("");
    }
  };

  // Fullscreen handler
  const openFullscreen = (data) => {
    setFullscreenData(data);
  };

  // No active chat - show create session button
  if (!activeChat) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
        <button
          onClick={createNewChat}
          className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-800"
        >
          Create first session
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50">
      <Sidebar
        sessions={sessions}
        activeId={activeId}
        setActiveId={setActiveId}
        editingId={editingId}
        setEditingId={setEditingId}
        editingTitle={editingTitle}
        setEditingTitle={setEditingTitle}
        renameSession={renameSession}
        deleteSession={deleteSession}
        createNewChat={createNewChat}
        activeChat={activeChat}
        updateSource={updateSource}
        uploading={uploading}
        handleFileUpload={handleFileUpload}
      />

      <div className="relative flex flex-1 flex-col bg-slate-950">
        <Header activeChat={activeChat} />

        <MessageList
          messages={activeChat.messages}
          editingMessageIndex={editingMessageIndex}
          setEditingMessageIndex={setEditingMessageIndex}
          editedPrompt={editedPrompt}
          setEditedPrompt={setEditedPrompt}
          saveEditedPrompt={saveEditedPrompt}
          exportMenu={exportMenu}
          setExportMenu={setExportMenu}
          openFullscreen={openFullscreen}
          exportCSV={exportCSV}
          exportExcel={exportExcel}
          exportJSON={exportJSON}
          exportText={exportText}
          loading={loading}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          loading={loading}
          activeChat={activeChat}
        />
      </div>

      <FullscreenModal
        fullscreenData={fullscreenData}
        setFullscreenData={setFullscreenData}
      />
    </div>
  );
}

export default App;
