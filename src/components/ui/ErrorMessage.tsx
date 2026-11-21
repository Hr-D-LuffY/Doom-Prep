interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div
    role="alert"
    className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
  >
    <p>{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 font-semibold underline underline-offset-2"
      >
        Try again
      </button>
    )}
  </div>
);
