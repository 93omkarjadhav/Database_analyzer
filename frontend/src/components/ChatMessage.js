import React, { useMemo, useState } from "react";
import { Pencil, Wand2 } from "lucide-react";
import ExportMenu from "./ExportMenu";
import DataChart from "./DataChart";

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
  const [chartType, setChartType] = useState("");

  const renderSummaryWithBold = (text) => {
    const s = String(text ?? "");
    if (!s.includes("**")) return s;
    const parts = s.split("**");
    return parts.map((part, idx) =>
      idx % 2 === 1 ? (
        <strong key={idx} className="font-semibold">
          {part}
        </strong>
      ) : (
        <React.Fragment key={idx}>{part}</React.Fragment>
      )
    );
  };

  const showAutofix = useMemo(() => {
    if (m.role !== "assistant") return false;
    if (!m.query) return false;
    const summary = String(m.summary || "").toLowerCase();
    const content = String(m.content || "").toLowerCase();
    const errorText = String(m.error || "").toLowerCase();

    const hasErrorSignal =
      summary.includes("error") ||
      content.includes("mysql error") ||
      content.includes("sql syntax") ||
      content.includes("you have an error in your sql syntax") ||
      errorText.length > 0;

    const isAutofixSuccess =
      summary.includes("autofixed and executed successfully") ||
      summary.includes("autofix resolved") ||
      summary.includes("autofix succeeded") ||
      summary.includes("autofix completed") ||
      content.includes("autofixed and executed successfully") ||
      content.includes("autofix resolved") ||
      content.includes("autofix succeeded") ||
      content.includes("autofix completed");

    return hasErrorSignal && !isAutofixSuccess;
  }, [m]);

  const normalizedContent = String(m.content || "").trim();
  const normalizedSummary = String(m.summary || "").trim();
  const shouldShowAssistantContent =
    m.role === "assistant" &&
    normalizedContent &&
    normalizedContent !== normalizedSummary;

  return (
    <div className={`flex w-full min-w-0 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`group relative w-full min-w-0 border border-slate-300 bg-slate-100 p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 md:max-w-[85%] md:p-5 ${
          m.role === "user"
            ? "rounded-[24px] rounded-br-[8px] md:rounded-[32px]"
            : "rounded-[24px] rounded-bl-[8px] md:rounded-[32px]"
        }`}
      >
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

        <div className="space-y-3 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
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
                  className="flex-1 rounded bg-slate-50 p-2 text-sm outline-none dark:bg-slate-900"
                />
              ) : (
                <div className="flex-1 space-y-3">
                  {m.images && m.images.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {m.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group cursor-pointer overflow-hidden rounded-xl ring-1 ring-slate-200 shadow-sm transition hover:ring-rose-500 dark:ring-slate-700"
                          onClick={() => openFullscreen({ type: "image", url: img })}
                        >
                          <img
                            src={img}
                            alt={`user-upload-${idx}`}
                            className="h-24 w-24 object-cover sm:h-32 sm:w-32 md:h-40 md:w-40"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    {m.content && <p className="flex-1 break-words">{m.content}</p>}
                    <button
                      onClick={() => {
                        setEditingMessageIndex(index);
                        setEditedPrompt(m.content);
                      }}
                      className="text-slate-500 transition-opacity hover:text-blue-400 dark:text-slate-400 md:opacity-0 md:group-hover:opacity-100"
                      aria-label="Edit prompt"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {shouldShowAssistantContent && (
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                Response
              </div>
              <p className="break-words whitespace-pre-wrap">{m.content}</p>
            </div>
          )}

          {m.summary && (
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                Summary
              </div>
              <p className="break-words">{renderSummaryWithBold(m.summary)}</p>
            </div>
          )}

          {m.role === "assistant" && m.query && (
            <div>
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                SQL Query
              </div>
              <pre className="mt-1 overflow-x-auto rounded-md border border-emerald-500/20 bg-slate-950 p-3 text-xs text-emerald-400">
                {m.query}
              </pre>
              {showAutofix && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
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
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Fix the SQL and rerun automatically
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {Array.isArray(m.dataframe) && m.dataframe.length > 0 && (
          <div className="mt-3 w-full max-w-full overflow-auto rounded-md border border-slate-300 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/80">
            <table className="min-w-[560px] w-full text-left text-[11px] text-slate-800 dark:text-slate-100">
              <thead className="bg-slate-100 uppercase tracking-tighter text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <tr>
                  {Object.keys(m.dataframe[0] || {}).map((k) => (
                    <th key={k} className="border-b border-slate-200 px-3 py-2 font-bold dark:border-slate-800">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {m.dataframe.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-slate-200/80 hover:bg-slate-100/60 dark:border-slate-800/80 dark:hover:bg-slate-800/60 last:border-0"
                  >
                    {Object.values(row).map((v, ci) => (
                      <td key={ci} className="max-w-[140px] truncate px-3 py-2 sm:max-w-[180px]">
                        {typeof v === "object" ? JSON.stringify(v) : String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {m.visualize && Array.isArray(m.dataframe) && m.dataframe.length > 0 && (
          <div className="mt-4 w-full max-w-[900px]">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <label className="text-xs text-slate-500 dark:text-slate-400">Chart Type:</label>

              <select
                value={chartType || m.chart || "bar"}
                onChange={(e) => setChartType(e.target.value)}
                className="rounded border border-slate-300 bg-white px-3 py-1 text-xs text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </div>

            <div className="h-[280px] w-full rounded-xl border border-slate-300 bg-gradient-to-br from-slate-100 to-white p-3 shadow-lg dark:border-slate-700 dark:from-slate-900 dark:to-slate-800 sm:h-[360px] md:h-[420px] md:p-4">
              <DataChart data={m.dataframe} type={chartType || m.chart || "bar"} />
            </div>
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
    </div>
  );
}

export default ChatMessage;
