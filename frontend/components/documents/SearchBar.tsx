"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search documents..."
        className="
          h-12
          w-full
          rounded-xl
          border
          border-zinc-800
          bg-zinc-900
          pl-11
          pr-4
          text-white
          outline-none
          transition
          placeholder:text-zinc-500
          focus:border-violet-500
        "
      />
    </div>
  );
}