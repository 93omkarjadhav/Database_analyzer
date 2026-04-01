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
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
          <Layout size={18} />
        </div>
        <h2 className="text-sm font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 font-['Outfit']">
          Chat History
        </h2>
      </div>

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
