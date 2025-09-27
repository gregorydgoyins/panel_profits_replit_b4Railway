import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    });

    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="bg-slate-800/90 backdrop-blur-md rounded-xl p-6 shadow-xl max-w-md w-full">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-red-900/30 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-white text-center mb-4">
              Something went wrong
            </h2>
            
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600/50 mb-6 max-h-32 overflow-auto">
              <p className="text-sm text-red-300 font-mono">
                {this.state.error?.toString() || 'Unknown error'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </button>
              
              <Link
                to="/"
                className="flex-1 flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                onClick={this.handleReset}
              >
                <Home className="h-4 w-4" />
                <span>Go Home</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}