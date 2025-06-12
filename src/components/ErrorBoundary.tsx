import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card className="text-center p-8 backdrop-blur-md bg-black/30 border border-white/10">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
              <p className="text-gray-300 mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button onClick={this.handleReset}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}