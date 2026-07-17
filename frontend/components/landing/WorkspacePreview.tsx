import {
  MessageSquare,
  BookOpen,
  Bot,
  Brain,
} from "lucide-react";

export default function WorkspacePreview() {
  return (
    <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md shadow-2xl">

      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
        <div>
          <h3 className="font-semibold text-white">
            KnowledgeHub AI
          </h3>

          <p className="text-xs text-zinc-500">
            AI Workspace
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
            AI
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex h-80">

        {/* Sidebar */}
        <div className="w-1/4 border-r border-zinc-800 p-4">
          <div className="space-y-3">

            <div className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2">
              <MessageSquare size={16} />
              <span className="text-sm">Chats</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-400">
              <BookOpen size={16} />
              <span className="text-sm">Knowledge</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-400">
              <Bot size={16} />
              <span className="text-sm">Agents</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-400">
              <Brain size={16} />
              <span className="text-sm">Memory</span>
            </div>

          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col p-4">

          {/* AI Message */}
          <div className="mb-4 max-w-xs rounded-2xl bg-blue-500 px-4 py-3 text-sm text-white">
            Hello 👋
            <br />
            What would you like to understand today?
          </div>

          {/* User Message */}
          <div className="ml-auto max-w-xs rounded-2xl bg-zinc-800 px-4 py-3 text-sm text-white">
            Explain GraphRAG in simple terms.
          </div>

          {/* Typing Indicator */}
          <div className="mt-auto flex items-center gap-2 text-sm text-zinc-500">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
            Thinking...
          </div>

        </div>

      </div>
    </div>
  );
}