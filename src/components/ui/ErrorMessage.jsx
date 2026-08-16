import Button from "../common/Button";

export default function ErrorMessage({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <p className="text-base font-semibold text-red-800">{title}</p>
      {message && <p className="text-sm text-red-600">{message}</p>}
      {onRetry && (
        <Button onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
