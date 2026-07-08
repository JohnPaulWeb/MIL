'use client';

import React, { useState } from 'react';
import { useOverlayStore } from '@/lib/store';

export function Overlay() {
  const {
    isOpen,
    selectedText,
    verificationResult,
    isLoading,
    setIsOpen,
    setVerificationResult,
  } = useOverlayStore();

  const [hovering, setHovering] = useState(false);

  if (!isOpen || !selectedText) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[999999]">
      {/* Floating Widget */}
      <div
        className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-96 max-h-96 overflow-y-auto"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-sm">Fact Check</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Selected Text */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
          <p className="text-xs text-gray-600 mb-1">Selected text:</p>
          <p className="text-sm text-gray-900 font-medium italic">{selectedText.substring(0, 100)}...</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Result */}
        {verificationResult && !isLoading && (
          <div className="space-y-3">
            {/* Prediction Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">Prediction:</span>
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${
                  verificationResult.prediction === 'true'
                    ? 'bg-green-100 text-green-800'
                    : verificationResult.prediction === 'false'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {verificationResult.prediction.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Confidence Score */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-gray-600">Confidence:</span>
                <span className="text-xs font-bold text-gray-900">
                  {Math.round(verificationResult.confidence_score * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    verificationResult.confidence_score > 0.7
                      ? 'bg-green-500'
                      : verificationResult.confidence_score > 0.4
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${verificationResult.confidence_score * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Reasoning */}
            {verificationResult.reasoning && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Analysis:</p>
                <p className="text-xs text-gray-700 line-clamp-3">{verificationResult.reasoning}</p>
              </div>
            )}

            {/* Sources */}
            {verificationResult.sources && verificationResult.sources.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Sources:</p>
                <ul className="text-xs space-y-1">
                  {verificationResult.sources.slice(0, 2).map((source, index) => (
                    <li key={index} className="text-blue-600 truncate">
                      • {source}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Voting Section */}
            <div className="border-t pt-3 mt-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">Was this helpful?</p>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 transition">
                  👍 Helpful
                </button>
                <button className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 transition">
                  👎 Misleading
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Result */}
        {!verificationResult && !isLoading && (
          <div className="text-center py-4">
            <p className="text-xs text-gray-500">Click analyze to check this text</p>
            <button className="mt-3 w-full bg-blue-600 text-white text-xs font-semibold py-2 rounded hover:bg-blue-700 transition">
              Analyze
            </button>
          </div>
        )}

        {/* Branding */}
        <div className="text-center mt-4 pt-3 border-t">
          <p className="text-xs text-gray-500">
            Powered by <span className="font-semibold">Detector</span>
          </p>
        </div>
      </div>

      {/* Floating Button (when collapsed) */}
      {hovering && (
        <div className="absolute bottom-full right-0 mb-2">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition transform hover:scale-110"
            title="Fact Check"
          >
            🔍
          </button>
        </div>
      )}
    </div>
  );
}
