export default function LoadingSpinner({
  className = "w-5 h-5",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`animate-spin text-primary ${className}`}
      viewBox="0 0 50 50"
    >
      <circle
        className="opacity-25"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
      />
      <circle
        className="opacity-75"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
        strokeDasharray="100"
        strokeDashoffset="75"
      />
    </svg>
  );
}
