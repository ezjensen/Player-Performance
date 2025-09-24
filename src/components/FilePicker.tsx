import React, { useState } from 'react';
import { FileSpreadsheet, Upload } from 'lucide-react';

interface FilePickerProps {
  onFileSelected: (fileId: string, fileName: string) => void;
  isLoading?: boolean;
}

export const FilePicker: React.FC<FilePickerProps> = ({ 
  onFileSelected, 
  isLoading = false 
}) => {
  const [isPickerLoading, setIsPickerLoading] = useState(false);

  const openPicker = () => {
    if (!window.google || !window.gapi) {
      alert('Google APIs not loaded. Please refresh the page and try again.');
      return;
    }

    setIsPickerLoading(true);

    const picker = new window.google.picker.PickerBuilder()
      .addView(
        new window.google.picker.DocsView(window.google.picker.ViewId.SPREADSHEETS)
          .setIncludeFolders(true)
          .setSelectFolderEnabled(false)
      )
      .setOAuthToken(window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token)
      .setDeveloperKey(import.meta.env.VITE_GOOGLE_API_KEY || '')
      .setCallback((data: any) => {
        setIsPickerLoading(false);
        if (data.action === window.google.picker.Action.PICKED) {
          const file = data.docs[0];
          onFileSelected(file.id, file.name);
        }
      })
      .build();

    picker.setVisible(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Select Google Sheet
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Choose a Google Sheet containing athlete profiles and dashboard
          </p>
        </div>
        
        <button
          onClick={openPicker}
          disabled={isLoading || isPickerLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPickerLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Opening Picker...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </>
          )}
        </button>
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          Required sheets: "Profiles" and "Dashboard"
        </div>
      </div>
    </div>
  );
};