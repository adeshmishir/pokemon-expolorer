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
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold uppercase tracking-wider text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
              Something went wrong
            </h2>
            <p className="mt-2 max-w-md text-xs text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]">
              An unexpected error occurred. Please try refreshing the page.
            </p>
          </div>
          <button
            onClick={this.handleRetry}
            className="mt-2 rounded-xl bg-[var(--color-pokeball-red)] px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-[var(--color-pokeball-red)]/50 focus-visible:ring-offset-2 active:scale-95 dark:bg-red-600 dark:hover:bg-red-500"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
