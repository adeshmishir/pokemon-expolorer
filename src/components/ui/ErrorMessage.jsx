import { AlertTriangle } from "lucide-react";
import Button from "../common/Button";

export default function ErrorMessage({
  title = "Something went wrong",
  message,
  description,
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="animate-fade-in flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950"
    >
      <AlertTriangle className="h-8 w-8 text-red-400 dark:text-red-500" aria-hidden="true" />
      <p className="text-base font-semibold text-red-800 dark:text-red-300">{title}</p>
      {message && <p className="text-sm text-red-600 dark:text-red-400">{message}</p>}
      {description && <p className="text-xs text-red-500 dark:text-red-400">{description}</p>}
      {onRetry && (
        <Button onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
