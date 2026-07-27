interface UploadButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function UploadButton({
  onClick,
  disabled = false,
}: UploadButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        w-full rounded-xl
        bg-violet-600
        px-4 py-3
        font-medium text-white
        transition-all duration-200
        hover:bg-violet-500
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      Choose Files
    </button>
  );
}