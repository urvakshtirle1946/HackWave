import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error; info?: React.ErrorInfo };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You can log the error to an external service here
    // console.error('Captured error in ErrorBoundary:', error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black p-6">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-4">An unexpected error occurred while loading the app.</p>
            {this.state.error && (
              <details className="whitespace-pre-wrap bg-gray-100 p-4 rounded border">
                <summary className="font-mono text-sm text-gray-800">Error details (click to expand)</summary>
                <pre className="text-xs mt-2 text-gray-800">{String(this.state.error.stack || this.state.error.message)}</pre>
                {this.state.info && (
                  <pre className="text-xs mt-2 text-gray-800">{String(this.state.info.componentStack)}</pre>
                )}
              </details>
            )}
            <div className="mt-4">
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">Reload</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
