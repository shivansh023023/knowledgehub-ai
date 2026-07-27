interface UploadSuccessProps {
  filename: string;
  onUploadAnother: () => void;
}

export default function UploadSuccess({
  filename,
  onUploadAnother,
}: UploadSuccessProps) {
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
          <span className="text-2xl">✓</span>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-green-400">
            Upload Complete
          </h3>

          <p className="text-sm text-zinc-500">
            Ready for AI Chat
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          Uploaded File
        </p>

        <p className="mt-2 truncate text-white">
          📄 {filename}
        </p>
      </div>

      <button
        onClick={onUploadAnother}
        className="
          rounded-xl
          border
          border-zinc-700
          py-3
          text-white
          transition
          hover:border-violet-500
          hover:bg-violet-500/10
        "
      >
        Upload Another
      </button>
    </div>
  );
}