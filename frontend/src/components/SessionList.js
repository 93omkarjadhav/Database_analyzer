import React from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

function SessionList({
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
}) {
  return (
    <>
      <button
        onClick={createNewChat}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" /> New Chat
      </button>

      <div className="mb-4 flex-1 space-y-1 overflow-y-auto pr-1">
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`group flex items-center gap-2 rounded-md px-2 py-2 text-xs ${
              activeId === s.id
                ? "bg-slate-800 text-slate-50"
                : "cursor-pointer text-slate-300 hover:bg-slate-800/70"
            }`}
          >
            {editingId === s.id ? (
              <input
                autoFocus
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={() => renameSession(s.id)}
                onKeyDown={(e) => e.key === "Enter" && renameSession(s.id)}
                className="flex-1 rounded bg-slate-700 px-2 py-1 text-xs outline-none"
              />
            ) : (
              <button
                onClick={() => setActiveId(s.id)}
                className="flex-1 truncate text-left"
              >
                {s.title}
              </button>
            )}
            <button
              onClick={() => {
                setEditingId(s.id);
                setEditingTitle(s.title);
              }}
              className="opacity-0 transition group-hover:opacity-100"
            >
              <Pencil className="h-3 w-3 text-blue-400 hover:text-blue-300" />
            </button>
            <button
              onClick={() => deleteSession(s.id)}
              className="opacity-0 transition group-hover:opacity-100"
            >
              <Trash2 className="h-3 w-3 text-rose-400 hover:text-rose-300" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default SessionList;
