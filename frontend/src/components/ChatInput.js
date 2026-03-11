import React from "react";
import { Send } from "lucide-react";

function ChatInput({ input, setInput, handleSend, loading, activeChat }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent pb-6 pt-10">
      <div className="mx-auto flex max-w-4xl items-end gap-2 px-4">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="max-h-32 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          placeholder={
            activeChat.source === "BigQuery"
              ? "Run analytics on BigQuery Warehouse..."
              : "Analyze your data source..."
          }
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="mb-1 inline-flex h-11 items-center justify-center rounded-xl border border-rose-500/60 bg-rose-500 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-400 disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
        >
          <Send className="mr-2 h-4 w-4" /> Send
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
