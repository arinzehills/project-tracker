/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ReactNode } from "react";
import { Icon } from "@iconify/react";
import Lottie from "lottie-react";
import Button from "@components/Button";
import SideToast from "@components/Toastify/SideToast";

declare const process: { env: { NODE_ENV: string } };

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  reportSent: boolean;
  errorAnimation: any;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      reportSent: false,
      errorAnimation: null,
    };
    this.loadErrorAnimation();
  }

  loadErrorAnimation = async () => {
    try {
      const response = await fetch("/lottie/error.json");
      const animationData = await response.json();
      this.setState({ errorAnimation: animationData });
    } catch (error) {
      console.error("Failed to load error animation:", error);
    }
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, reportSent: false, errorAnimation: null };
  }

  handleReportToSupport = async () => {
    this.setState({ reportSent: true });

    try {
      // Report error notification
      SideToast.FireSuccess({
        title: "Report Sent",
        message:
          "Error report sent successfully! Our team will investigate this issue.",
      });
    } catch (error) {
      console.error("Failed to send error report:", error);
      this.setState({ reportSent: false });

      // Show error toast
      SideToast.FireError({
        title: "Report Failed",
        message: "Failed to send error report. Please try again later.",
      });
    }
  };

  handleRefreshPage = () => {
    window.location.reload();
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  // Component sections for better organization
  renderLogo = () => (
    <div className="flex items-center gap-2 mb-8">
      <img
        src="/img/logo-purple.png"
        alt="App Logo"
        className="w-20 h-20 mx-auto mb-4"
      />
      <h2 className="text-2xl font-semibold text-gray-700">Qsion AI</h2>
    </div>
  );

  renderErrorAnimation = () => (
    <div className="mb-8">
      <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center">
        {this.state.errorAnimation && (
          <Lottie
            animationData={this.state.errorAnimation}
            loop={true}
            style={{ width: 200, height: 200 }}
          />
        )}
      </div>
    </div>
  );

  renderErrorMessage = () => (
    <div className="max-w-md mb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Oops! Something went wrong
      </h1>
      <p className="text-gray-600 text-lg leading-relaxed">
        We&apos;ve encountered an unexpected error. Our team has been notified
        and we&apos;re working to fix it.
      </p>
    </div>
  );

  renderActionButtons = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <Button
        onClick={this.handleRefreshPage}
        buttonColor="bg-purple-gradient hover:bg-blue-700"
        textColor="text-white"
        height={12}
        width={48}
        prefixIcon={<Icon icon="solar:refresh-bold" width={20} height={20} />}
      >
        Refresh Page
      </Button>

      <Button
        onClick={this.handleReportToSupport}
        buttonColor="bg-gray-600 hover:bg-gray-700"
        textColor="text-white"
        height={12}
        width={48}
        disabled={this.state.reportSent}
        suffixIcon={
          this.state.reportSent ? (
            <Icon
              icon="solar:check-circle-bold"
              width={20}
              height={20}
              className="text-green-400"
            />
          ) : (
            <Icon icon="mdi:report-line-variant" width={20} height={20} />
          )
        }
      >
        {this.state.reportSent ? "Report Sent" : "Report Issue"}
      </Button>
    </div>
  );

  renderErrorDetails = () => {
    if (process.env.NODE_ENV !== "development" || !this.state.error) {
      return null;
    }

    return (
      <details className="max-w-2xl w-full">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-800 mb-4 font-medium">
          View Error Details (Development Mode)
        </summary>
        <div className="bg-gray-900 text-green-400 p-6 rounded-lg text-left overflow-auto">
          <div className="mb-4">
            <h4 className="text-red-400 font-bold mb-2">Error Message:</h4>
            <p className="mb-4">{this.state.error.message}</p>
          </div>
          {this.state.error.stack && (
            <div>
              <h4 className="text-red-400 font-bold mb-2">Stack Trace:</h4>
              <pre className="text-xs whitespace-pre-wrap">
                {this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      </details>
    );
  };

  renderSuccessMessage = () => {
    // Success message now handled by SideToast, so we can remove this or keep it minimal
    return null;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex bg-gradient-to-br from-purple-50 via-purple-50 to-purple-300 flex-col items-center justify-center min-h-screen px-4 text-center">
          {this.renderLogo()}
          {this.renderErrorAnimation()}
          {this.renderErrorMessage()}
          {this.renderActionButtons()}
          {this.renderErrorDetails()}
          {this.renderSuccessMessage()}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
