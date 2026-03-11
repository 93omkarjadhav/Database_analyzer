import React from "react";
import ChatMessage from "./ChatMessage";

function MessageList({
  messages,
  editingMessageIndex,
  setEditingMessageIndex,
  editedPrompt,
  setEditedPrompt,
  saveEditedPrompt,
  exportMenu,
  setExportMenu,
  openFullscreen,
  exportCSV,
  exportExcel,
  exportJSON,
  exportText,
  loading,
}) {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 pb-32">
      {messages.map((m, i) => (
        <ChatMessage
          key={i}
          message={m}
          index={i}
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
        />
      ))}
      {loading && (
        <div className="animate-pulse text-xs font-medium text-rose-400">
          Agent is querying the warehouse...
        </div>
      )}
    </div>
  );
}

export default MessageList;
