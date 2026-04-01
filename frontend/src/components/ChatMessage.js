import React, { useMemo, useState } from "react";
import { Pencil, Wand2 } from "lucide-react";
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
  onAutofix,
}) {
  const m = message;
  const [fixing, setFixing] = useState(false);

  const showAutofix = useMemo(() => {
    if (m.role !== "assistant") return false;
    if (!m.query) return false;
    if (!m.summary || m.summary !== "Error") return false;
    // Only show for MySQL errors
    return typeof m.content === "string" && m.content.startsWith("MySQL error:");
  }, [m]);

  return (
    <div
      className={`flex w-full ${m.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div className={`relative max-w-[85%] border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-5 shadow-sm transition-all hover:shadow-md ${m.role === "user" ? "rounded-[32px] rounded-br-[8px]" : "rounded-[32px] rounded-bl-[8px]"
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
                  className="flex-1 rounded bg-slate-50 dark:bg-slate-900 p-2 text-sm outline-none"
                />
              ) : (
                <div className="flex-1 space-y-3">
                  {m.images && m.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {m.images.map((img, idx) => (
                        <div key={idx} className="relative group cursor-pointer overflow-hidden rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm transition hover:ring-rose-500" onClick={() => openFullscreen({ type: 'image', url: img })}>
                          <img
                            src={img}
                            alt={`user-upload-${idx}`}
                            className="h-40 w-40 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    {m.content && <p className="flex-1">{m.content}</p>}
                    <button
                      onClick={() => {
                        setEditingMessageIndex(index);
                        setEditedPrompt(m.content);
                      }}
                      className="text-slate-500 dark:text-slate-400 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Edit prompt"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {m.summary && (
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                Summary
              </div>
              <p>{m.summary}</p>
            </div>
          )}

          {m.role === "assistant" && m.query && (
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                SQL Query
              </div>
              <pre className="mt-1 overflow-x-auto rounded-md border border-emerald-500/20 bg-black/40 p-3 text-xs text-emerald-400">
                {m.query}
              </pre>
              {showAutofix && (
                <div className="mt-2 flex items-center gap-2">
                  <button
                    disabled={fixing}
                    onClick={async () => {
                      if (!onAutofix) return;
                      try {
                        setFixing(true);
                        await onAutofix(m);
                      } finally {
                        setFixing(false);
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-600 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Wand2 size={14} />
                    {fixing ? "Fixing..." : "Autofix"}
                  </button>
                  <span className="text-[11px] text-slate-400">
                    Fix the SQL and rerun automatically
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {m.dataframe && Array.isArray(m.dataframe) && m.dataframe.length > 0 && (
          <div className="mt-3 overflow-x-auto rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80">
            <table className="min-w-full text-left text-[11px] text-slate-800 dark:text-slate-100">
              <thead className="bg-slate-50 dark:bg-slate-900 uppercase tracking-tighter text-slate-500 dark:text-slate-400">
                <tr>
                  {Object.keys(m.dataframe[0] || {}).map((k) => (
                    <th
                      key={k}
                      className="border-b border-slate-200 dark:border-slate-800 px-3 py-2 font-bold"
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
                    className="border-b border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 last:border-0"
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
            <p className="text-sm italic text-slate-600 dark:text-slate-300">{m.insights}</p>
          </div>
        )}
      </div>
    </div >
  );
}

export default ChatMessage;
