import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  total: number;
  currentPlayer?: string;
  isComplete: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  currentPlayer,
  isComplete,
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isComplete ? 'Processing Complete' : 'Generating PDFs'}
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {current} / {total}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {currentPlayer && !isComplete && (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
          <Clock className="h-4 w-4 mr-2 animate-spin" />
          Processing: {currentPlayer}
        </div>
      )}

      {isComplete && (
        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
          <CheckCircle className="h-4 w-4 mr-2" />
          All PDFs generated successfully
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Progress: {percentage.toFixed(1)}%
      </div>
    </div>
  );
};