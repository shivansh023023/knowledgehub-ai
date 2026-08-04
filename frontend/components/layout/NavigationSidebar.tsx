"use client";

import Link from "next/link";

export default function NavigationSidebar() {
  return (
    <aside className="flex w-64 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 p-6">
        <h2 className="text-xl font-bold text-white">
          KnowledgeHub
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          AI Workspace
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href="/app"
          className="rounded-lg px-4 py-3 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
        >
          Workspace
        </Link>

        <Link
          href="/app/documents"
          className="rounded-lg px-4 py-3 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
        >
          Documents
        </Link>

        <Link
          href="/app/graphrag"
          className="rounded-lg px-4 py-3 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
        >
          GraphRAG
        </Link>

        <Link
          href="/app/settings"
          className="rounded-lg px-4 py-3 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
}