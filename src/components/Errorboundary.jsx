import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
          <p className="text-red-600">Failed to load image</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
