import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import FullscreenModal from "./components/FullscreenModal";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { uploadFile, sendChatMessage, autofixMySql } from "./utils/apiUtils";
import { exportCSV, exportExcel, exportJSON, exportText } from "./utils/exportUtils";

function App() {
  const getCurrentPath = () => window.location.pathname || "/";
  const [currentPath, setCurrentPath] = useState(getCurrentPath);
  const hasAuthToken = Boolean(localStorage.getItem("token"));

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [fullscreenData, setFullscreenData] = useState(null);
  const [exportMenu, setExportMenu] = useState(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const [editedPrompt, setEditedPrompt] = useState("");

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "light" ? false : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Navigation handlers
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    window.history.pushState({}, "", "/app");
    setCurrentPath("/app");
  };

  const handleSignup = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    window.history.pushState({}, "", "/app");
    setCurrentPath("/app");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    window.history.pushState({}, "", "/");
    setCurrentPath("/");
  };

  const navigateTo = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getCurrentPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (currentPath === "/login" && hasAuthToken) {
      window.history.replaceState({}, "", "/app");
      setCurrentPath("/app");
      return;
    }

    if (currentPath === "/signup" && hasAuthToken) {
      window.history.replaceState({}, "", "/app");
      setCurrentPath("/app");
      return;
    }

    if (currentPath === "/app" && !hasAuthToken) {
      window.history.replaceState({}, "", "/login");
      setCurrentPath("/login");
      return;
    }

    if (!["/", "/login", "/signup", "/app"].includes(currentPath)) {
      window.history.replaceState({}, "", "/");
      setCurrentPath("/");
    }
  }, [currentPath, hasAuthToken]);

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
    const currentSource = activeChat ? activeChat.source : "MySQL Database";
    const newSession = {
      id: newId,
      title: "New Session",
      messages: [],
      source: currentSource,
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

    const existingSession = sessions.find((s) => s.source === src);

    if (existingSession) {
      if (activeChat.messages.length === 0 && activeChat.title === "New Session" && sessions.length > 1) {
        setSessions((prev) => prev.filter((s) => s.id !== activeId));
      }
      setActiveId(existingSession.id);
    } else {
      if (activeChat.messages.length === 0 && activeChat.title === "New Session") {
        setSessions((prev) =>
          prev.map((s) => (s.id === activeId ? { ...s, source: src } : s))
        );
      } else {
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
      }
    }
  };

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

  const handleSend = async () => {
    if ((!input && selectedImages.length === 0) || loading || !activeChat) return;
    setLoading(true);

    const imageUrls = selectedImages.map(file => URL.createObjectURL(file));
    const userMsg = {
      role: "user",
      content: input,
      images: imageUrls
    };

    const updatedMessages = [...activeChat.messages, userMsg];
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeId
          ? {
            ...s,
            messages: updatedMessages,
            title:
              s.title === "New Session"
                ? `${input.slice(0, 25) || "Image Message"}...`
                : s.title,
          }
          : s
      )
    );
    setInput("");
    setSelectedImages([]);

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

  const handleAutofix = async (assistantMsg) => {
    if (!activeChat) return;
    if (activeChat.source !== "MySQL Database") return;
    if (!assistantMsg?.query) return;

    const brokenSql = assistantMsg.query;
    const errMsg = assistantMsg.error || assistantMsg.content || "";

    setLoading(true);
    try {
      const fixRes = await autofixMySql(brokenSql, errMsg);
      if (fixRes.blocked) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeId
              ? {
                ...s,
                messages: [
                  ...s.messages,
                  {
                    role: "assistant",
                    summary: "Command Blocked",
                    content: fixRes.reason,
                  },
                ],
              }
              : s
          )
        );
        return;
      }

      if (fixRes.fixedSql) setInput(fixRes.fixedSql);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? { ...s, messages: [...s.messages, fixRes] }
            : s
        )
      );
    } catch (e) {
      console.error("Autofix error:", e);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId
            ? {
              ...s,
              messages: [
                ...s.messages,
                { role: "assistant", content: "Autofix failed. Please try again." },
              ],
            }
            : s
        )
      );
    } finally {
      setLoading(false);
    }
  };

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

  const openFullscreen = (data) => {
    setFullscreenData(data);
  };

  const chatPage = !activeChat ? (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <button
        onClick={createNewChat}
        className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        Create first session
      </button>
    </div>
  ) : (
    <div className="flex h-[100dvh] w-full max-w-full overflow-x-hidden flex-col md:flex-row bg-slate-950 text-slate-50">
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

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden bg-white dark:bg-slate-950">
        <Header
          activeChat={activeChat}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onLogout={handleLogout}
          user={user}
        />

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
          onAutofix={handleAutofix}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          loading={loading}
          activeChat={activeChat}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      </div>

      <FullscreenModal
        fullscreenData={fullscreenData}
        setFullscreenData={setFullscreenData}
      />
    </div>
  );

  if (currentPath === "/") {
    return (
      <DashboardPage
        onGetStarted={() => navigateTo("/signup")}
        onSignIn={() => navigateTo("/login")}
      />
    );
  }

  if (currentPath === "/login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateToSignup={() => navigateTo("/signup")}
      />
    );
  }

  if (currentPath === "/signup") {
    return (
      <SignupPage
        onSignup={handleSignup}
        onNavigateToLogin={() => navigateTo("/login")}
      />
    );
  }

  if (currentPath === "/app") {
    return chatPage;
  }

  return null;
}

export default App;