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
  onAutofix,
}) {
  return (
    <div className="min-h-0 min-w-0 flex-1 space-y-4 overflow-auto overflow-x-hidden px-3 py-4 pb-32 sm:space-y-6 md:px-6 md:pb-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
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
          onAutofix={onAutofix}
        />
      ))}
      {loading && (
        <div className="animate-pulse text-xs font-medium text-rose-400">
          Agent is analyzing the data...
        </div>
      )}
    </div>
  );
}

export default MessageList;
