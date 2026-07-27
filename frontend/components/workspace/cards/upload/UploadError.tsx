interface UploadErrorProps {
  message: string;
  onRetry: () => void;
}

export default function UploadError({
  message,
  onRetry,
}: UploadErrorProps) {
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <h3 className="text-lg font-semibold text-red-400">
        Upload Failed
      </h3>

      <p className="text-sm text-zinc-400">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="
          rounded-xl
          bg-red-500
          py-3
          font-medium
          text-white
          hover:bg-red-400
        "
      >
        Try Again
      </button>
    </div>
  );
}