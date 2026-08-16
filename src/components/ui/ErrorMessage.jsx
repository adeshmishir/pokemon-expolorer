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
      className="animate-fade-in flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-red-200/60 bg-red-50/50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/30"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
        <AlertTriangle className="h-6 w-6 text-red-500 dark:text-red-400" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-extrabold uppercase tracking-wider text-red-700 dark:text-red-300">{title}</p>
        {message && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{message}</p>}
        {description && <p className="mt-0.5 text-[10px] text-red-500 dark:text-red-400">{description}</p>}
      </div>
      {onRetry && (
        <Button onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
