export default function ChatCard() {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <p className="text-sm text-zinc-400">AI</p>

        <h2 className="mt-2 text-3xl font-semibold text-white">
          AI Chat
        </h2>
      </div>

      <p className="text-zinc-500">
        Ask questions across all uploaded documents.
      </p>
    </div>
  );
}