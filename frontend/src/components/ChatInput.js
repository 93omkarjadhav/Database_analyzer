import React, { useRef } from "react";
import { Send, Plus, X } from "lucide-react";

function ChatInput({
  input,
  setInput,
  handleSend,
  loading,
  activeChat,
  selectedImages,
  setSelectedImages,
}) {
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="sticky inset-x-0 bottom-0 z-20 bg-gradient-to-t from-white via-white/95 to-transparent pb-3 pt-4 dark:from-slate-950 dark:via-slate-950/95 md:pb-6 md:pt-8">
      <div className="relative mx-auto w-full max-w-4xl px-2 sm:px-3 md:px-4">
        <div className="relative flex w-full flex-col">
          {selectedImages && selectedImages.length > 0 && (
            <div className="mb-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-2xl border border-slate-200/50 bg-slate-100/50 p-2 shadow-inner backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-800/50">
              {selectedImages.map((file, idx) => (
                <div key={idx} className="relative group transition-all duration-200">
                  <div className="h-16 w-16 overflow-hidden rounded-xl ring-1 ring-slate-200 shadow-sm transition hover:ring-rose-500 dark:ring-slate-700">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -right-1.5 -top-1.5 rounded-full bg-rose-500 p-0.5 text-white shadow-md transition hover:bg-rose-600 active:scale-95"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative flex w-full items-end">
            <div className="relative flex flex-1 items-end">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 left-2 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-200 text-slate-600 shadow-sm transition-all hover:bg-slate-300 hover:text-rose-500 active:scale-95 dark:border-slate-700/50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 md:bottom-1.5 md:h-9 md:w-9"
                title="Add images"
              >
                <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
              </button>

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
                className="flex min-h-[52px] max-h-48 w-full resize-none rounded-[24px] border border-slate-300 bg-slate-50/90 py-3 pl-12 pr-14 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-50 dark:placeholder:text-slate-500 md:rounded-[32px] md:pl-14 md:pr-[110px]"
                placeholder={
                  activeChat.source === "BigQuery"
                    ? "Run analytics on BigQuery Warehouse..."
                    : "Analyze your data source..."
                }
              />

              <button
                onClick={handleSend}
                disabled={loading || (!input.trim() && selectedImages.length === 0)}
                className="absolute bottom-2 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-500/60 bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all hover:bg-rose-400 active:scale-95 disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:border-slate-700 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 md:bottom-1.5 md:h-9 md:w-auto md:px-5"
              >
                <Send className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
