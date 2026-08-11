"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  loading: boolean;
  onSend: (message: string) => void;
}

export default function ChatInput({
  loading,
  onSend,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim() || loading) return;

    onSend(input.trim());
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
        placeholder="Ask anything about your documents..."
        className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-violet-500 disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        Send
      </button>
    </form>
  );
}