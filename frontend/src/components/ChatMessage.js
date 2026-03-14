import React from "react";
import { Pencil } from "lucide-react";
import ExportMenu from "./ExportMenu";

function ChatMessage({
  message,
  index,
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
}) {
  const m = message;

  return (
    <div
      className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div className={`relative max-w-[85%] border border-slate-700 bg-slate-800 p-5 shadow-sm transition-all hover:shadow-md ${m.role === "user" ? "rounded-[32px] rounded-br-[8px]" : "rounded-[32px] rounded-bl-[8px]"
        }`}>
        {m.role === "assistant" && (
          <ExportMenu
            index={index}
            message={m}
            exportMenu={exportMenu}
            setExportMenu={setExportMenu}
            openFullscreen={openFullscreen}
            exportCSV={exportCSV}
            exportExcel={exportExcel}
            exportJSON={exportJSON}
            exportText={exportText}
          />
        )}
        <div className="space-y-3 text-sm leading-relaxed">
          {m.role === "user" && (
            <div className="flex items-start gap-2">
              {editingMessageIndex === index ? (
                <textarea
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  onBlur={() => saveEditedPrompt(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      saveEditedPrompt(index);
                    }
                  }}
                  className="flex-1 rounded bg-slate-900 p-2 text-sm outline-none"
                />
              ) : (
                <>
                  <p className="flex-1">{m.content}</p>
                  <button
                    onClick={() => {
                      setEditingMessageIndex(index);
                      setEditedPrompt(m.content);
                    }}
                    className="text-slate-400 hover:text-blue-400"
                    aria-label="Edit prompt"
                  >
                    <Pencil size={14} />
                  </button>
                </>
              )}
            </div>
          )}

          {m.summary && (
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Summary
              </div>
              <p>{m.summary}</p>
            </div>
          )}

          {m.role === "assistant" && m.query && (
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                SQL Query
              </div>
              <pre className="mt-1 overflow-x-auto rounded-md border border-emerald-500/20 bg-black/40 p-3 text-xs text-emerald-400">
                {m.query}
              </pre>
            </div>
          )}
        </div>

        {m.dataframe && Array.isArray(m.dataframe) && m.dataframe.length > 0 && (
          <div className="mt-3 overflow-x-auto rounded-md border border-slate-700 bg-slate-900/80">
            <table className="min-w-full text-left text-[11px] text-slate-100">
              <thead className="bg-slate-900 uppercase tracking-tighter text-slate-400">
                <tr>
                  {Object.keys(m.dataframe[0] || {}).map((k) => (
                    <th
                      key={k}
                      className="border-b border-slate-800 px-3 py-2 font-bold"
                    >
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {m.dataframe.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-slate-800/80 hover:bg-slate-800/60 last:border-0"
                  >
                    {Object.values(row).map((v, ci) => (
                      <td
                        key={ci}
                        className="max-w-[180px] truncate px-3 py-2 align-top"
                      >
                        {typeof v === "object" ? JSON.stringify(v) : String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {m.insights && (
          <div className="mt-4 rounded-md border-l-2 border-rose-500 bg-rose-500/5 p-3">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-400">
              Agent Insight
            </div>
            <p className="text-sm italic text-slate-300">{m.insights}</p>
          </div>
        )}
      </div>
    </div >
  );
}

export default ChatMessage;
