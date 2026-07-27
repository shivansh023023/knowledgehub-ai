interface UploadProgressProps {
  progress: number;
}

export default function UploadProgress({
  progress,
}: UploadProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-zinc-400">
        <span>Uploading...</span>

        <span>{progress}%</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-violet-500 transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}