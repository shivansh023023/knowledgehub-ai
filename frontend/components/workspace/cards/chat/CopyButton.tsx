"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({
  text,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy response"
      title="Copy response"
      className="
        rounded-lg
        p-2

        text-zinc-500
        transition-all
        duration-200

        hover:bg-zinc-800
        hover:text-white

        active:scale-95
      "
    >
      {copied ? (
        <Check
          size={16}
          className="text-emerald-400"
        />
      ) : (
        <Copy size={16} />
      )}
    </button>
  );
}