import React from "react";
import { Send } from "lucide-react";

function ChatInput({ input, setInput, handleSend, loading, activeChat }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 dark:from-slate-950 dark:via-slate-950/95 to-transparent pb-6 pt-10">
      <div className="relative mx-auto w-full max-w-4xl px-4">
        <div className="relative flex w-full items-end">
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
            className="flex max-h-32 w-full resize-none rounded-[32px] border border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/90 py-3 pl-6 pr-[110px] text-sm text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            placeholder={
              activeChat.source === "BigQuery"
                ? "Run analytics on BigQuery Warehouse..."
                : "Analyze your data source..."
            }
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute bottom-1.5 right-2 inline-flex h-9 items-center justify-center rounded-full border border-rose-500/60 bg-rose-500 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-400 disabled:border-slate-300 dark:disabled:border-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500"
          >
            <Send className="mr-2 h-4 w-4" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
