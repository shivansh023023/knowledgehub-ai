"use client";

interface SearchInputProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export default function SearchInput({
  value,
  loading,
  onChange,
  onSearch,
}: SearchInputProps) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Search your documents..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
        className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-500"
      />

      <button
        onClick={onSearch}
        disabled={loading}
        className="rounded-lg bg-violet-600 px-5 text-white transition hover:bg-violet-500 disabled:opacity-50"
      >
        {loading ? "..." : "Search"}
      </button>
    </div>
  );
}