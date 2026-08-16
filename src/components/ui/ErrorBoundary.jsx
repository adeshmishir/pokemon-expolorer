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
          <AlertTriangle className="h-10 w-10 text-red-400" aria-hidden="true" />
          <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--color-pokedex-text)] dark:text-[var(--color-pokedex-dark-text)]">
            Something went wrong
          </h2>
          <p className="max-w-md text-xs text-[var(--color-pokedex-muted)] dark:text-[var(--color-pokedex-dark-muted)]">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-2 rounded-lg bg-[var(--color-pokedex-text)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-[var(--color-pokedex-panel)] transition-all hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--color-pokeball-red)]/50 focus-visible:ring-offset-2 dark:bg-[var(--color-pokedex-dark-text)] dark:text-[var(--color-pokedex-dark-bg)]"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
