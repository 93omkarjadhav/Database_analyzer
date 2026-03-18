import React from "react";
import { Layout } from "lucide-react";
import SessionList from "./SessionList";
import DataSourceSelector from "./DataSourceSelector";
import FileUpload from "./FileUpload";

function Sidebar({
  sessions,
  activeId,
  setActiveId,
  editingId,
  setEditingId,
  editingTitle,
  setEditingTitle,
  renameSession,
  deleteSession,
  createNewChat,
  activeChat,
  updateSource,
  uploading,
  handleFileUpload,
}) {
  return (
    <div className="flex w-[320px] flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 p-4 backdrop-blur">
      <h2 className="mb-4 flex items-center text-lg font-semibold tracking-tight">
        <Layout className="mr-2 h-5 w-5 text-rose-400" />
        Chat Sessions
      </h2>

      <SessionList
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
      />

      <div className="mt-auto space-y-3 border-t border-slate-200 dark:border-slate-800 pt-4">
        <DataSourceSelector activeChat={activeChat} updateSource={updateSource} />
        <FileUpload
          activeChat={activeChat}
          uploading={uploading}
          handleFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
}

export default Sidebar;
