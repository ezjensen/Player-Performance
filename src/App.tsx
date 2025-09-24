import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, LogOut, FileText, Users, AlertCircle } from 'lucide-react';
import { FilePicker } from './components/FilePicker';
import { ProgressBar } from './components/ProgressBar';
import { Settings } from './components/Settings';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { 
  initializeGoogleAPI, 
  signIn, 
  signOut, 
  isSignedIn 
} from './utils/googleApi';
import { 
  extractPlayersFromSheet, 
  updateDashboard, 
  exportToPDF, 
  logToSheet 
} from './utils/sheetsApi';
import { Player, LogEntry, ProcessingProgress } from './types';

const AppContent: React.FC = () => {
  const { settings } = useSettings();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<{ id: string; name: string } | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [progress, setProgress] = useState<ProcessingProgress>({
    current: 0,
    total: 0,
    isComplete: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initializeGoogleAPI();
      setIsAuthenticated(isSignedIn());
    } catch (error) {
      console.error('Failed to initialize Google API:', error);
      setError('Failed to initialize Google APIs. Please check your configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn();
      setIsAuthenticated(true);
      setError(null);
    } catch (error) {
      console.error('Sign-in failed:', error);
      setError('Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setSelectedFile(null);
      setPlayers([]);
      setProgress({ current: 0, total: 0, isComplete: false });
      setLogs([]);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  const handleFileSelected = async (fileId: string, fileName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedFile({ id: fileId, name: fileName });
      
      const extractedPlayers = await extractPlayersFromSheet(fileId);
      setPlayers(extractedPlayers);
      setProgress({ current: 0, total: extractedPlayers.length, isComplete: false });
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to process the selected file. Please ensure it has "Profiles" and "Dashboard" sheets.');
      setSelectedFile(null);
      setPlayers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const processPDFGeneration = async () => {
    if (!selectedFile || players.length === 0) return;

    setIsProcessing(true);
    setError(null);
    const processedLogs: LogEntry[] = [];

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const timestamp = new Date().toISOString();

      setProgress({
        current: i + 1,
        total: players.length,
        currentPlayer: player.name,
        isComplete: false,
      });

      try {
        // Update dashboard with player data
        await updateDashboard(selectedFile.id, player.name, player.team);
        
        // Wait a moment for the sheet to update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate PDF
        const fileName = `${player.team}_${player.name}.pdf`;
        await exportToPDF(selectedFile.id, fileName);
        
        const logEntry: LogEntry = {
          timestamp,
          playerName: player.name,
          team: player.team,
          status: 'success',
          message: 'PDF generated successfully',
          pdfLink: fileName,
        };

        processedLogs.push(logEntry);
        await logToSheet(selectedFile.id, logEntry);
        
        // Rate limiting delay
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error processing ${player.name}:`, error);
        
        const logEntry: LogEntry = {
          timestamp,
          playerName: player.name,
          team: player.team,
          status: 'error',
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        };

        processedLogs.push(logEntry);
        await logToSheet(selectedFile.id, logEntry);
      }
    }

    setLogs(processedLogs);
    setProgress(prev => ({ ...prev, isComplete: true, currentPlayer: undefined }));
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
          <span className="text-gray-700 dark:text-gray-300">Initializing...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            {settings.companyLogo && (
              <div className="mb-6">
                <img
                  src={settings.companyLogo}
                  alt="Company Logo"
                  className="mx-auto max-h-16 max-w-48 object-contain"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {settings.companyName || 'Player Performance PDF Generator'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Generate individual PDF performance reports for athletes from Google Sheets data
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
              </div>
            )}
            
            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {settings.companyLogo && (
                <img
                  src={settings.companyLogo}
                  alt="Company Logo"
                  className="h-8 w-auto mr-4"
                />
              )}
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {settings.companyName || 'Player Performance PDF Generator'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <SettingsIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {!selectedFile ? (
          <div className="text-center">
            <FilePicker onFileSelected={handleFileSelected} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {selectedFile.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
                    <Users className="h-4 w-4 mr-1" />
                    {players.length} players found
                  </p>
                </div>
                {!isProcessing && !progress.isComplete && (
                  <button
                    onClick={processPDFGeneration}
                    disabled={players.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Generate PDFs
                  </button>
                )}
              </div>
              
              {players.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {players.slice(0, 6).map((player, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded border"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {player.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {player.team}
                      </div>
                    </div>
                  ))}
                  {players.length > 6 && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300">
                        +{players.length - 6} more
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {(isProcessing || progress.isComplete) && (
              <ProgressBar
                current={progress.current}
                total={progress.total}
                currentPlayer={progress.currentPlayer}
                isComplete={progress.isComplete}
              />
            )}

            {progress.isComplete && logs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Processing Results
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded border ${
                        log.status === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {log.playerName} ({log.team})
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {log.message}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            log.status === 'success'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;