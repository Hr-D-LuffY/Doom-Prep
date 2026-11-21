interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div
    role="alert"
    className="rounded-md border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-200"
  >
    <p>{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 font-medium text-red-300 underline hover:text-red-100"
      >
        Try again
      </button>
    )}
  </div>
);
