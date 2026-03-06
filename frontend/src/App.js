// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import {
//   Send,
//   Plus,
//   Trash2,
//   Layout,
//   Database,
//   FileUp,
//   Pencil,
//   Download,
//   Maximize2,
// } from "lucide-react";

// const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// const DATA_SOURCES = [
//   "MySQL Database",
//   "PostgreSQL",
//   "Oracle",
//   "MongoDB",
//   "SQLite",
//   "BigQuery",
//   "Upload File",
// ];

// function App() {
//   const [sessions, setSessions] = useState([]);
//   const [activeId, setActiveId] = useState(null);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [editingTitle, setEditingTitle] = useState("");
//   const [fullscreenData, setFullscreenData] = useState(null);
//   const [exportMenu, setExportMenu] = useState(null);

//   // Load from localStorage on first render
//   useEffect(() => {
//     const stored = localStorage.getItem("retail-ai-sessions");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setSessions(parsed);
//       if (parsed.length) setActiveId(parsed[0].id);
//     } else {
//       const firstId = Date.now().toString();
//       setSessions([
//         {
//           id: firstId,
//           title: "New Session",
//           messages: [],
//           source: "MySQL Database",
//           filePath: null,
//           fileName: null,
//         },
//       ]);
//       setActiveId(firstId);
//     }
//   }, []);

//   const openFullscreen = (data) => {
//     setFullscreenData(data);
//   };

//   // Persist to localStorage whenever sessions change
//   useEffect(() => {
//     if (sessions.length) {
//       localStorage.setItem("retail-ai-sessions", JSON.stringify(sessions));
//     }
//   }, [sessions]);

//   const activeChat = useMemo(
//     () => sessions.find((s) => s.id === activeId),
//     [sessions, activeId],
//   );

//   const createNewChat = () => {
//     const newId = Date.now().toString();
//     const newSession = {
//       id: newId,
//       title: "New Session",
//       messages: [],
//       source: "MySQL Database",
//       filePath: null,
//       fileName: null,
//     };
//     setSessions((prev) => [newSession, ...prev]);
//     setActiveId(newId);
//   };

//   const deleteSession = (id) => {
//     setSessions((prev) => {
//       const filtered = prev.filter((s) => s.id !== id);
//       if (!filtered.length) return [];
//       if (id === activeId) {
//         setActiveId(filtered[0].id);
//       }
//       return filtered;
//     });
//   };

//   // CSV export
//   const exportCSV = (data) => {
//     if (!data || !Array.isArray(data)) return;

//     const headers = Object.keys(data[0]).join(",");
//     const rows = data.map((r) => Object.values(r).join(","));
//     const csv = [headers, ...rows].join("\n");

//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "ai-result.csv";
//     a.click();
//   };

//   // Excel export
//   const exportExcel = (data) => {
//     if (!data || !Array.isArray(data)) return;

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

//     XLSX.writeFile(workbook, "ai-result.xlsx");
//   };

//   // JSON export
//   const exportJSON = (data) => {
//     if (!data) return;

//     const blob = new Blob([JSON.stringify(data, null, 2)], {
//       type: "application/json",
//     });

//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "ai-result.json";
//     a.click();
//   };

//   // TEXT export
//   const exportText = (text) => {
//     const blob = new Blob([text], { type: "text/plain" });

//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "ai-response.txt";
//     a.click();
//   };
//   const renameSession = (id) => {
//     if (!editingTitle.trim()) return;

//     setSessions((prev) =>
//       prev.map((s) => (s.id === id ? { ...s, title: editingTitle.trim() } : s)),
//     );

//     setEditingId(null);
//     setEditingTitle("");
//   };

//   const updateSource = (src) => {
//     if (!activeChat) return;

//     if (activeChat.source === src) return;

//     const newId = Date.now().toString();

//     const newSession = {
//       id: newId,
//       title: "New Session",
//       messages: [],
//       source: src,
//       filePath: null,
//       fileName: null,
//     };

//     setSessions((prev) => [newSession, ...prev]);
//     setActiveId(newId);
//   };

//   const handleFileUpload = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file || !activeChat) return;

//     try {
//       setUploading(true);
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await axios.post(`${API_BASE}/api/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setSessions((prev) =>
//         prev.map((s) =>
//           s.id === activeId
//             ? {
//                 ...s,
//                 filePath: res.data.filePath,
//                 fileName: res.data.fileName,
//                 source: "Upload File",
//               }
//             : s,
//         ),
//       );
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("Failed to upload file. Please try again.");
//     } finally {
//       setUploading(false);
//       // Reset input so same file can be re-selected
//       event.target.value = "";
//     }
//   };

//   const handleSend = async () => {
//     if (!input || loading || !activeChat) return;
//     setLoading(true);

//     const userMsg = { role: "user", content: input };
//     const updatedMessages = [...activeChat.messages, userMsg];

//     // Optimistic UI update
//     setSessions((prev) =>
//       prev.map((s) =>
//         s.id === activeId
//           ? {
//               ...s,
//               messages: updatedMessages,
//               title:
//                 s.title === "New Session"
//                   ? `${input.slice(0, 25)}...`
//                   : s.title,
//             }
//           : s,
//       ),
//     );
//     setInput("");

//     try {
//       const res = await axios.post(`${API_BASE}/api/chat`, {
//         message: input,
//         source: activeChat.source,
//         filePath: activeChat.filePath,
//       });

//       setSessions((prev) =>
//         prev.map((s) =>
//           s.id === activeId
//             ? {
//                 ...s,
//                 messages: [...updatedMessages, res.data],
//               }
//             : s,
//         ),
//       );
//     } catch (err) {
//       console.error("Chat Error:", err);
//       alert("Something went wrong while contacting the AI agent.");
//       setSessions((prev) =>
//         prev.map((s) =>
//           s.id === activeId
//             ? {
//                 ...s,
//                 messages: [
//                   ...updatedMessages,
//                   {
//                     role: "assistant",
//                     content:
//                       "There was an error while processing your request. Please try again.",
//                   },
//                 ],
//               }
//             : s,
//         ),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!activeChat) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
//         <button
//           onClick={createNewChat}
//           className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-800"
//         >
//           Create first session
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50">
//       {/* Sidebar */}
//       <div className="flex w-[320px] flex-col border-r border-slate-800 bg-slate-900/80 p-4 backdrop-blur">
//         <h2 className="mb-4 flex items-center text-lg font-semibold tracking-tight">
//           <Layout className="mr-2 h-5 w-5 text-rose-400" />
//           Chat Sessions
//         </h2>

//         <button
//           onClick={createNewChat}
//           className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium hover:bg-slate-800"
//         >
//           <Plus className="h-4 w-4" />
//           New Chat
//         </button>

//         <div className="mb-4 flex-1 space-y-1 overflow-y-auto pr-1">
//           {sessions.map((s) => (
//             <div
//               key={s.id}
//               className={`group flex items-center gap-2 rounded-md px-2 py-2 text-xs ${
//                 activeId === s.id
//                   ? "bg-slate-800 text-slate-50"
//                   : "cursor-pointer text-slate-300 hover:bg-slate-800/70"
//               }`}
//             >
//               {editingId === s.id ? (
//                 <input
//                   autoFocus
//                   value={editingTitle}
//                   onChange={(e) => setEditingTitle(e.target.value)}
//                   onBlur={() => renameSession(s.id)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") renameSession(s.id);
//                   }}
//                   className="flex-1 rounded bg-slate-700 px-2 py-1 text-xs outline-none"
//                 />
//               ) : (
//                 <button
//                   onClick={() => setActiveId(s.id)}
//                   className="flex-1 truncate text-left"
//                 >
//                   {s.title}
//                 </button>
//               )}

//               {/* Rename Icon */}
//               <button
//                 onClick={() => {
//                   setEditingId(s.id);
//                   setEditingTitle(s.title);
//                 }}
//                 className="opacity-0 transition group-hover:opacity-100"
//               >
//                 <Pencil className="h-3 w-3 text-blue-400 hover:text-blue-300" />
//               </button>

//               {/* Delete Icon */}
//               <button
//                 onClick={() => deleteSession(s.id)}
//                 className="opacity-0 transition group-hover:opacity-100"
//               >
//                 <Trash2 className="h-3 w-3 text-rose-400 hover:text-rose-300" />
//               </button>
//             </div>
//           ))}
//         </div>

//         <div className="mt-auto space-y-3 border-t border-slate-800 pt-4">
//           <div>
//             <div className="mb-2 flex items-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
//               <Database className="mr-1 h-3 w-3" />
//               Data Source
//             </div>
//             <div className="space-y-1">
//               {DATA_SOURCES.map((src) => (
//                 <label
//                   key={src}
//                   className="flex cursor-pointer items-center rounded-md px-2 py-1.5 text-xs hover:bg-slate-800/80"
//                 >
//                   <input
//                     type="radio"
//                     checked={activeChat.source === src}
//                     onChange={() => updateSource(src)}
//                     className="mr-2 h-3 w-3 accent-rose-500"
//                   />
//                   <span>{src}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="rounded-md border border-dashed border-slate-700 bg-slate-900/60 p-3">
//             <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-200">
//               <div className="flex items-center gap-1.5">
//                 <FileUp className="h-4 w-4 text-rose-400" />
//                 Upload File
//               </div>
//               {uploading && (
//                 <span className="text-[10px] text-rose-300">Uploading...</span>
//               )}
//             </div>
//             <p className="mb-2 text-[11px] text-slate-400">
//               Attach a CSV data file to chat with it. The file is kept per
//               session.
//             </p>
//             <label className="flex cursor-pointer items-center justify-center rounded-md bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:bg-slate-700">
//               <input
//                 type="file"
//                 accept=".csv"
//                 className="hidden"
//                 onChange={handleFileUpload}
//               />
//               Choose CSV file
//             </label>
//             {activeChat.fileName && (
//               <p className="mt-2 truncate text-[11px] text-emerald-300">
//                 Talking with: {activeChat.fileName}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="relative flex flex-1 flex-col bg-slate-950">
//         <div className="border-b border-slate-800 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-semibold tracking-tight">
//                 🤖 Retail AI: Multi-DB & Files
//               </h1>
//               <p className="mt-1 text-xs text-slate-400">
//                 Ask natural language questions over MySQL, PostgreSQL, MongoDB,
//                 or uploaded CSV files.
//               </p>
//             </div>
//           </div>

//           {activeChat.source === "Upload File" && activeChat.fileName && (
//             <div className="mt-3 inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200">
//               <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
//               Talking with file:{" "}
//               <span className="ml-1 font-medium">{activeChat.fileName}</span>
//             </div>
//           )}
//         </div>

//         <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 pb-32">
//           {activeChat.messages.map((m, i) => (
//             <div
//               key={i}
//               className={`flex ${
//                 m.role === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`relative max-w-[85%] rounded-lg border ${
//                   m.role === "assistant"
//                     ? "bg-slate-800 border-slate-700"
//                     : "bg-slate-800 border-slate-700"
//                 }`}
//               >
//                 {m.role === "assistant" && (
//                   <div className="absolute right-2 top-2 flex gap-2">
//                     {/* Export Button */}
//                     <div className="relative">
//                       <button
//                         onClick={() =>
//                           setExportMenu(exportMenu === i ? null : i)
//                         }
//                         className="rounded bg-slate-800 p-1 hover:bg-slate-700"
//                       >
//                         <Download className="h-3 w-3 text-slate-300" />
//                       </button>

//                       {exportMenu === i && (
//                         <div className="absolute right-0 mt-1 w-32 rounded-md border border-slate-700 bg-slate-900 text-xs">
//                           <button
//                             onClick={() => exportCSV(m.dataframe)}
//                             className="block w-full px-3 py-2 text-left hover:bg-slate-800"
//                           >
//                             CSV
//                           </button>
//                           <button
//                             onClick={() => exportExcel(m.dataframe)}
//                             className="block w-full px-3 py-2 text-left hover:bg-slate-800"
//                           >
//                             EXCEL
//                           </button>

//                           <button
//                             onClick={() =>
//                               exportJSON(m.dataframe || m.jsonData)
//                             }
//                             className="block w-full px-3 py-2 text-left hover:bg-slate-800"
//                           >
//                             JSON
//                           </button>

//                           <button
//                             onClick={() => exportText(m.content)}
//                             className="block w-full px-3 py-2 text-left hover:bg-slate-800"
//                           >
//                             TEXT
//                           </button>
//                         </div>
//                       )}
//                     </div>

//                     {/* Fullscreen Button */}
//                     {m.dataframe && (
//                       <button
//                         onClick={() => openFullscreen(m.dataframe)}
//                         className="rounded bg-slate-800 p-1 hover:bg-slate-700"
//                       >
//                         <Maximize2 className="h-3 w-3 text-slate-300" />
//                       </button>
//                     )}
//                   </div>
//                 )}
//                 <div className="mb-1 text-[11px] font-mono uppercase tracking-[0.18em] text-slate-400">
//                   {m.role}
//                 </div>
//                <div className="space-y-3 text-sm">

//   {/* USER MESSAGE */}
//   {m.role === "user" && (
//     <p>{m.content}</p>
//   )}

//   {/* ASSISTANT SUMMARY */}
//   {m.summary && (
//   <div>
//     <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//       Summary
//     </div>
//     <p>{m.summary}</p>
//   </div>
// )}

//   {/* SQL QUERY */}
//   {m.role === "assistant" && m.query && (
//     <div>
//       <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//         SQL Query
//       </div>
//       <pre className="mt-1 overflow-x-auto rounded-md bg-slate-800 p-2 text-xs text-emerald-300">
//         {m.query}
//       </pre>
//     </div>
//   )}

// </div>
//                 {m.dataframe &&
//                   Array.isArray(m.dataframe) &&
//                   m.dataframe.length > 0 && (
//                     <div className="mt-3 overflow-x-auto rounded-md border border-slate-700 bg-slate-900/80">
//                       <table className="min-w-full text-left text-[11px] text-slate-100">
//                         <thead className="bg-slate-900/80 text-slate-300">
//                           <tr>
//                             {Object.keys(m.dataframe[0] || {}).map((k) => (
//                               <th
//                                 key={k}
//                                 className="border-b border-slate-800 px-2 py-1 font-medium"
//                               >
//                                 {k}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {m.dataframe.map((row, ri) => (
//                             <tr
//                               key={ri}
//                               className="border-b border-slate-800/80 last:border-0 hover:bg-slate-800/60"
//                             >
//                               {Object.values(row).map((v, ci) => (
//                                 <td
//                                   key={ci}
//                                   className="max-w-[180px] truncate px-2 py-1 align-top"
//                                 >
//                                   {typeof v === "object"
//                                     ? JSON.stringify(v)
//                                     : String(v)}
//                                 </td>
//                               ))}
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                       {m.insights && (
//                         <div className="mt-3 rounded-md border border-slate-700 bg-slate-900/80 p-3">
//                           <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
//                             Insights
//                           </div>
//                           <p className="text-sm">{m.insights}</p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 {m.jsonData &&
//                   Array.isArray(m.jsonData) &&
//                   m.jsonData.length > 0 && (
//                     <div className="mt-3 rounded-md border border-slate-700 bg-slate-900/80">
//                       <div className="border-b border-slate-800 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
//                         Raw JSON
//                       </div>
//                       <pre className="max-h-64 overflow-auto px-3 py-2 text-[11px] leading-snug text-slate-100">
//                         {JSON.stringify(m.jsonData, null, 2)}
//                       </pre>
//                     </div>
//                   )}
//               </div>
//             </div>
//           ))}

//           {loading && (
//             <div className="text-xs text-rose-300">
//               Agent is analyzing your data...
//             </div>
//           )}
//         </div>

//         {/* Input */}
//         <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pb-4 pt-6">
//           <div className="pointer-events-auto mx-auto flex max-w-4xl items-end gap-2 px-4">
//             <textarea
//               rows={1}
//               className="max-h-32 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
//               placeholder={
//                 activeChat.source === "Upload File"
//                   ? "Ask anything about your uploaded CSV..."
//                   : "Ask a question about your retail data..."
//               }
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSend();
//                 }
//               }}
//             />
//             <button
//               onClick={handleSend}
//               disabled={loading || !input.trim()}
//               className="mb-1 inline-flex h-11 items-center justify-center rounded-xl border border-rose-500/60 bg-rose-500/90 px-4 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:border-slate-600 disabled:bg-slate-700"
//             >
//               <Send className="mr-1.5 h-4 w-4" />
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//       {fullscreenData && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
//           <div className="max-h-[90vh] w-[90vw] overflow-auto rounded-lg bg-slate-900 p-6">
//             <div className="mb-4 flex justify-between">
//               <h2 className="text-sm font-semibold text-white">
//                 Fullscreen Result
//               </h2>

//               <button
//                 onClick={() => setFullscreenData(null)}
//                 className="text-xs text-rose-400"
//               >
//                 Close
//               </button>
//             </div>

//             <table className="min-w-full text-left text-sm text-slate-100">
//               <thead>
//                 <tr>
//                   {Object.keys(fullscreenData[0] || {}).map((k) => (
//                     <th key={k} className="border-b border-slate-700 px-3 py-2">
//                       {k}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {fullscreenData.map((row, i) => (
//                   <tr key={i}>
//                     {Object.values(row).map((v, j) => (
//                       <td key={j} className="px-3 py-2">
//                         {String(v)}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Send,
  Plus,
  Trash2,
  Layout,
  Database,
  FileUp,
  Pencil,
  Download,
  Maximize2,
} from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

// UPDATED: Added BigQuery to the global source list
const DATA_SOURCES = [
  "MySQL Database",
  "PostgreSQL",
  "Oracle",
  "MongoDB",
  "SQLite",
  "BigQuery",
  "Upload File",
];

function App() {
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
const [editedPrompt, setEditedPrompt] = useState('');

  // Load from localStorage on first render
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

  const openFullscreen = (data) => {
    setFullscreenData(data);
  };

const saveEditedPrompt = async (index) => {
  if (!editedPrompt.trim()) return;

  const updatedMessages = activeChat.messages
    .slice(0, index + 1)
    .map((msg, i) =>
      i === index ? { ...msg, content: editedPrompt } : msg
    );

  // Update messages in state
  setSessions((prev) =>
    prev.map((s) =>
      s.id === activeId
        ? {
            ...s,
            messages: updatedMessages,
          }
        : s
    )
  );

  setEditingMessageIndex(null);

  try {
    setLoading(true);

    const res = await axios.post(`${API_BASE}/api/chat`, {
      message: editedPrompt,
      source: activeChat.source,
      filePath: activeChat.filePath,
    });

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeId
          ? {
              ...s,
              messages: [...updatedMessages, res.data],
            }
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
  // Persist to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length) {
      localStorage.setItem("retail-ai-sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  const activeChat = useMemo(
    () => sessions.find((s) => s.id === activeId),
    [sessions, activeId],
  );

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

  // Export handlers
  const exportCSV = (data) => {
    if (!data || !Array.isArray(data)) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((r) => Object.values(r).join(","));
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-result.csv";
    a.click();
  };

  const exportExcel = (data) => {
    if (!data || !Array.isArray(data)) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "ai-result.xlsx");
  };

  const exportJSON = (data) => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-result.json";
    a.click();
  };

  const exportText = (text) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-response.txt";
    a.click();
  };

  const renameSession = (id) => {
    if (!editingTitle.trim()) return;
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title: editingTitle.trim() } : s)));
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

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !activeChat) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeId ? { ...s, filePath: res.data.filePath, fileName: res.data.fileName, source: "Upload File" } : s
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
    if (!input || loading || !activeChat) return;
    setLoading(true);
    const userMsg = { role: "user", content: input };
    const updatedMessages = [...activeChat.messages, userMsg];
    setSessions((prev) =>
      prev.map((s) => s.id === activeId ? { ...s, messages: updatedMessages, title: s.title === "New Session" ? `${input.slice(0, 25)}...` : s.title } : s)
    );
    setInput("");

    try {
      // Logic now correctly sends "BigQuery" source to backend
      const res = await axios.post(`${API_BASE}/api/chat`, {
        message: input,
        source: activeChat.source,
        filePath: activeChat.filePath,
      });
      setSessions((prev) => prev.map((s) => s.id === activeId ? { ...s, messages: [...updatedMessages, res.data] } : s));
    } catch (err) {
      console.error("Chat Error:", err);
      setSessions((prev) => prev.map((s) => s.id === activeId ? { 
        ...s, 
        messages: [...updatedMessages, { role: "assistant", content: "Error processing request." }] 
      } : s));
    } finally {
      setLoading(false);
    }
  };

  if (!activeChat) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-100">
        <button onClick={createNewChat} className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium hover:bg-slate-800">
          Create first session
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <div className="flex w-[320px] flex-col border-r border-slate-800 bg-slate-900/80 p-4 backdrop-blur">
        <h2 className="mb-4 flex items-center text-lg font-semibold tracking-tight">
          <Layout className="mr-2 h-5 w-5 text-rose-400" />
          Chat Sessions
        </h2>

        <button onClick={createNewChat} className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium hover:bg-slate-800">
          <Plus className="h-4 w-4" /> New Chat
        </button>

        <div className="mb-4 flex-1 space-y-1 overflow-y-auto pr-1">
          {sessions.map((s) => (
            <div key={s.id} className={`group flex items-center gap-2 rounded-md px-2 py-2 text-xs ${activeId === s.id ? "bg-slate-800 text-slate-50" : "cursor-pointer text-slate-300 hover:bg-slate-800/70"}`}>
              {editingId === s.id ? (
                <input autoFocus value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} onBlur={() => renameSession(s.id)} onKeyDown={(e) => e.key === "Enter" && renameSession(s.id)} className="flex-1 rounded bg-slate-700 px-2 py-1 text-xs outline-none" />
              ) : (
                <button onClick={() => setActiveId(s.id)} className="flex-1 truncate text-left">{s.title}</button>
              )}
              <button onClick={() => { setEditingId(s.id); setEditingTitle(s.title); }} className="opacity-0 transition group-hover:opacity-100"><Pencil className="h-3 w-3 text-blue-400 hover:text-blue-300" /></button>
              <button onClick={() => deleteSession(s.id)} className="opacity-0 transition group-hover:opacity-100"><Trash2 className="h-3 w-3 text-rose-400 hover:text-rose-300" /></button>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-3 border-t border-slate-800 pt-4">
          <div>
            <div className="mb-2 flex items-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              <Database className="mr-1 h-3 w-3" /> Data Source
            </div>
            <div className="space-y-1">
              {DATA_SOURCES.map((src) => (
                <label key={src} className="flex cursor-pointer items-center rounded-md px-2 py-1.5 text-xs hover:bg-slate-800/80">
                  <input type="radio" checked={activeChat.source === src} onChange={() => updateSource(src)} className="mr-2 h-3 w-3 accent-rose-500" />
                  <span>{src}</span>
                </label>
              ))}
            </div>
          </div>
          {/* File Upload Section */}
          <div className="rounded-md border border-dashed border-slate-700 bg-slate-900/60 p-3">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-200">
              <div className="flex items-center gap-1.5"><FileUp className="h-4 w-4 text-rose-400" /> Upload File</div>
              {uploading && <span className="text-[10px] text-rose-300">Uploading...</span>}
            </div>
            <label className="flex cursor-pointer items-center justify-center rounded-md bg-slate-800 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:bg-slate-700">
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} /> Choose CSV file
            </label>
            {activeChat.fileName && <p className="mt-2 truncate text-[11px] text-emerald-300 font-medium">Talking with: {activeChat.fileName}</p>}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col bg-slate-950">
        <div className="border-b border-slate-800 px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">🤖 Retail AI: Multi-DB & Files</h1>
          {activeChat.source === "BigQuery" && (
            <div className="mt-3 inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-200">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Analytical Mode: <span className="ml-1 font-medium italic">Google BigQuery Warehouse</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 pb-32">
          {activeChat.messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="relative max-w-[85%] rounded-lg border bg-slate-800 border-slate-700 p-4 shadow-sm">
                {m.role === "assistant" && (
                  <div className="absolute right-2 top-2 flex gap-2">
                    <button onClick={() => setExportMenu(exportMenu === i ? null : i)} className="rounded bg-slate-800 p-1 hover:bg-slate-700"><Download className="h-3 w-3 text-slate-300" /></button>
                    {exportMenu === i && (
                      <div className="absolute right-0 mt-1 w-32 rounded-md border border-slate-700 bg-slate-900 text-xs z-10 overflow-hidden">
                        <button onClick={() => exportCSV(m.dataframe)} className="block w-full px-3 py-2 text-left hover:bg-slate-800 border-b border-slate-800">CSV</button>
                        <button onClick={() => exportExcel(m.dataframe)} className="block w-full px-3 py-2 text-left hover:bg-slate-800 border-b border-slate-800">EXCEL</button>
                        <button onClick={() => exportJSON(m.dataframe || m.jsonData)} className="block w-full px-3 py-2 text-left hover:bg-slate-800 border-b border-slate-800">JSON</button>
                        <button onClick={() => exportText(m.content || m.summary)} className="block w-full px-3 py-2 text-left hover:bg-slate-800">TEXT</button>
                      </div>
                    )}
                    {m.dataframe && <button onClick={() => openFullscreen(m.dataframe)} className="rounded bg-slate-800 p-1 hover:bg-slate-700"><Maximize2 className="h-3 w-3 text-slate-300" /></button>}
                  </div>
                )}
<<<<<<< Updated upstream
                <div className="mb-2 text-[11px] font-mono uppercase tracking-[0.18em] text-slate-400">{m.role}</div>
                <div className="space-y-4 text-sm leading-relaxed">
                  {m.role === "user" ? <p>{m.content}</p> : (
                    <>
                      {m.summary && (<div><div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1">Summary</div><p>{m.summary}</p></div>)}
                      {m.query && (<div><div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-1">SQL Query</div><pre className="mt-1 overflow-x-auto rounded-md bg-black/40 p-3 text-xs text-emerald-400 border border-emerald-500/20">{m.query}</pre></div>)}
                      {m.dataframe && Array.isArray(m.dataframe) && m.dataframe.length > 0 && (
                        <div className="mt-3 overflow-x-auto rounded-md border border-slate-700 bg-slate-900/80">
                          <table className="min-w-full text-left text-[11px] text-slate-100">
                            <thead className="bg-slate-900 text-slate-400 uppercase tracking-tighter">
                              <tr>{Object.keys(m.dataframe[0] || {}).map((k) => (<th key={k} className="border-b border-slate-800 px-3 py-2 font-bold">{k}</th>))}</tr>
                            </thead>
                            <tbody>
                              {m.dataframe.map((row, ri) => (
                                <tr key={ri} className="border-b border-slate-800/80 last:border-0 hover:bg-slate-800/60">
                                  {Object.values(row).map((v, ci) => (<td key={ci} className="max-w-[180px] truncate px-3 py-2 align-top">{typeof v === "object" ? JSON.stringify(v) : String(v)}</td>))}
                                </tr>
=======
                <div className="mb-1 text-[11px] font-mono uppercase tracking-[0.18em] text-slate-400">
                  {m.role}
                </div>
               <div className="space-y-3 text-sm">

  {/* USER MESSAGE */}
  {m.role === "user" && (
  <div className="flex items-start gap-2">
    
    {editingMessageIndex === i ? (
      <textarea
        value={editedPrompt}
        onChange={(e) => setEditedPrompt(e.target.value)}
        onBlur={() => saveEditedPrompt(i)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            saveEditedPrompt(i);
          }
        }}
        className="flex-1 rounded bg-slate-800 p-2 text-sm outline-none"
      />
    ) : (
      <>
        <p className="flex-1">{m.content}</p>

        <button
          onClick={() => {
            setEditingMessageIndex(i);
            setEditedPrompt(m.content);
          }}
          className="text-slate-400 hover:text-blue-400"
        >
          <Pencil size={14} />
        </button>
      </>
    )}

  </div>
)}

  {/* ASSISTANT SUMMARY */}
  {m.summary && (
  <div>
    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
      Summary
    </div>
    <p>{m.summary}</p>
  </div>
)}

  {/* SQL QUERY */}
  {m.role === "assistant" && m.query && (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        SQL Query
      </div>
      <pre className="mt-1 overflow-x-auto rounded-md bg-slate-800 p-2 text-xs text-emerald-300">
        {m.query}
      </pre>
    </div>
  )}

</div>
                {m.dataframe &&
                  Array.isArray(m.dataframe) &&
                  m.dataframe.length > 0 && (
                    <div className="mt-3 overflow-x-auto rounded-md border border-slate-700 bg-slate-900/80">
                      <table className="min-w-full text-left text-[11px] text-slate-100">
                        <thead className="bg-slate-900/80 text-slate-300">
                          <tr>
                            {Object.keys(m.dataframe[0] || {}).map((k) => (
                              <th
                                key={k}
                                className="border-b border-slate-800 px-2 py-1 font-medium"
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
                              className="border-b border-slate-800/80 last:border-0 hover:bg-slate-800/60"
                            >
                              {Object.values(row).map((v, ci) => (
                                <td
                                  key={ci}
                                  className="max-w-[180px] truncate px-2 py-1 align-top"
                                >
                                  {typeof v === "object"
                                    ? JSON.stringify(v)
                                    : String(v)}
                                </td>
>>>>>>> Stashed changes
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {m.insights && (
                        <div className="mt-4 rounded-md border-l-2 border-rose-500 bg-rose-500/5 p-3">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-400 mb-1">Agent Insight</div>
                          <p className="text-sm italic text-slate-300">{m.insights}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-rose-400 font-medium animate-pulse">Agent is querying the warehouse...</div>}
        </div>

        {/* Input Area */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pb-6 pt-10">
          <div className="mx-auto flex max-w-4xl items-end gap-2 px-4">
            <textarea rows={1} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              className="max-h-32 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              placeholder={activeChat.source === "BigQuery" ? "Run analytics on BigQuery Warehouse..." : "Analyze your data source..."} />
            <button onClick={handleSend} disabled={loading || !input.trim()}
              className="mb-1 inline-flex h-11 items-center justify-center rounded-xl border border-rose-500/60 bg-rose-500 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-400 disabled:bg-slate-800 disabled:border-slate-700 disabled:text-slate-500">
              <Send className="mr-2 h-4 w-4" /> Send
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Table Modal */}
      {fullscreenData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-10 backdrop-blur-sm">
          <div className="max-h-full w-full overflow-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-6">
            <div className="mb-6 flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2"><Maximize2 className="h-5 w-5 text-rose-400" /> Complete Dataset</h2>
              <button onClick={() => setFullscreenData(null)} className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition">CLOSE [ESC]</button>
            </div>
            <table className="min-w-full text-left text-sm text-slate-100 border-collapse">
              <thead className="sticky top-0 bg-slate-900">
                <tr className="bg-slate-800">{Object.keys(fullscreenData[0] || {}).map((k) => (<th key={k} className="border-b border-slate-700 px-4 py-3 font-bold uppercase text-xs tracking-widest text-slate-400">{k}</th>))}</tr>
              </thead>
              <tbody>{fullscreenData.map((row, i) => (<tr key={i} className="hover:bg-white/5 border-b border-slate-800/50">{Object.values(row).map((v, j) => (<td key={j} className="px-4 py-3 border-r border-slate-800/30 font-mono text-xs">{String(v)}</td>))}</tr>))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;