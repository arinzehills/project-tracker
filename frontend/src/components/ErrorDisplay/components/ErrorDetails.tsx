// components/ErrorDetails.tsx - Collapsible error details component
import React, { useState } from 'react';

interface ErrorDetailsProps {
  details: string;
  showDetails: boolean;
}

const ErrorDetails: React.FC<ErrorDetailsProps> = ({ details, showDetails }) => {
  const [showDetailSection, setShowDetailSection] = useState(false);

  if (!showDetails || !details) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setShowDetailSection(!showDetailSection)}
        className="text-sm text-gray-500 hover:text-gray-700 underline"
      >
        {showDetailSection ? "Hide" : "Show"} Details
      </button>

      {showDetailSection && (
        <div className="mt-2 p-3 bg-gray-100 rounded text-left text-xs font-mono text-gray-700 max-h-32 overflow-y-auto">
          {details}
        </div>
      )}
    </div>
  );
};

export default ErrorDetails;
