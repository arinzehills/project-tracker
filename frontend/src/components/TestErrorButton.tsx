'use client';

import { useState } from 'react';

export default function TestErrorButton() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('🎯 This is a test error from TestErrorButton! ErrorBoundary should catch this.');
  }

  return (
    <button
      onClick={() => setShouldThrow(true)}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
    >
      🧪 Test Error Boundary
    </button>
  );
}
