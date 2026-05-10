'use client';

import React, { Component, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary — catches runtime / API / network failures
 * in any child tree and shows a calm, parent-friendly UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          aria-live="polite"
          className="flex flex-col items-center justify-center gap-5 py-16 px-6 text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-error-container">
            <AlertCircle className="w-8 h-8 text-on-error-container" aria-hidden="true" />
          </div>

          <h2 className="text-xl font-bold text-on-surface">
            Sedang ada gangguan koneksi
          </h2>

          <p className="text-sm text-on-surface-variant leading-relaxed">
            Kami akan mencoba menyimpan data secara lokal. Silakan muat ulang.
          </p>

          <Button
            variant="primary"
            size="lg"
            onClick={this.handleRetry}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Coba Lagi
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
