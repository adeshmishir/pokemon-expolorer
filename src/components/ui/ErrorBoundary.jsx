import { Component } from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-400" aria-hidden="true" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Something went wrong
          </h2>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-2 rounded-lg bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
