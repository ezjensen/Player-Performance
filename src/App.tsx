import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import components (will need to be converted)
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

const Drawer = createDrawerNavigator();

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

  // Home Screen Component
  const HomeScreen = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        {isLoading ? (
          <View style={styles.centeredContainer}>
            <Text style={styles.loadingText}>Initializing...</Text>
          </View>
        ) : !isAuthenticated ? (
          <View style={styles.authContainer}>
            {settings.companyLogo && (
              <View style={styles.logoContainer}>
                {/* Logo would be displayed here */}
                <Text style={styles.logoPlaceholder}>Company Logo</Text>
              </View>
            )}
            
            <Text style={styles.title}>
              {settings.companyName || 'Player Performance PDF Generator'}
            </Text>
            
            <Text style={styles.subtitle}>
              Generate individual PDF performance reports for athletes from Google Sheets data
            </Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Icon name="error" size={20} color="#dc2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSignIn}
              disabled={isLoading}>
              <Text style={styles.buttonText}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.mainContent}>
            <View style={styles.header}>
              {settings.companyLogo && (
                <Text style={styles.headerLogo}>Logo</Text>
              )}
              <Text style={styles.headerTitle}>
                {settings.companyName || 'Player Performance PDF Generator'}
              </Text>
              <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                <Icon name="logout" size={20} color="#6b7280" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Icon name="error" size={20} color="#dc2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <FilePicker onFileSelected={handleFileSelected} isLoading={isLoading} />

            {selectedFile && (
              <View style={styles.fileInfo}>
                <View style={styles.fileInfoHeader}>
                  <Icon name="description" size={24} color="#3b82f6" />
                  <Text style={styles.fileInfoTitle}>{selectedFile.name}</Text>
                </View>
                <Text style={styles.fileInfoSubtitle}>
                  <Icon name="group" size={16} color="#6b7280" />
                  {` ${players.length} players found`}
                </Text>
                
                {!isProcessing && !progress.isComplete && players.length > 0 && (
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={processPDFGeneration}>
                    <Text style={styles.buttonText}>Generate PDFs</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {(isProcessing || progress.isComplete) && (
              <ProgressBar
                current={progress.current}
                total={progress.total}
                currentPlayer={progress.currentPlayer}
                isComplete={progress.isComplete}
              />
            )}

            {progress.isComplete && logs.length > 0 && (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>Processing Results</Text>
                <ScrollView style={styles.logsList}>
                  {logs.map((log, index) => (
                    <View
                      key={index}
                      style={[
                        styles.logEntry,
                        log.status === 'success' ? styles.successLog : styles.errorLog
                      ]}>
                      <Text style={styles.logPlayerName}>
                        {log.playerName} ({log.team})
                      </Text>
                      <Text style={styles.logMessage}>{log.message}</Text>
                      <View style={styles.logStatus}>
                        <Text style={[
                          styles.statusBadge,
                          log.status === 'success' ? styles.successBadge : styles.errorBadge
                        ]}>
                          {log.status}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );

  // File Selection Screen
  const FileSelectionScreen = () => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>File Selection</Text>
      <FilePicker onFileSelected={handleFileSelected} isLoading={isLoading} />
    </SafeAreaView>
  );

  // Processing Screen
  const ProcessingScreen = () => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Processing</Text>
      {(isProcessing || progress.isComplete) && (
        <ProgressBar
          current={progress.current}
          total={progress.total}
          currentPlayer={progress.currentPlayer}
          isComplete={progress.isComplete}
        />
      )}
    </SafeAreaView>
  );

  // Settings Screen
  const SettingsScreen = () => (
    <SafeAreaView style={styles.container}>
      <Settings />
    </SafeAreaView>
  );

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerStyle: { backgroundColor: Platform.OS === 'ios' ? '#f9fafb' : '#ffffff' },
          drawerActiveTintColor: '#3b82f6',
          drawerInactiveTintColor: '#6b7280',
        }}>
        <Drawer.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen 
          name="File Selection" 
          component={FileSelectionScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="description" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Processing" 
          component={ProcessingScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="play-arrow" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="settings" color={color} size={size} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#ffffff"
      />
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authContainer: {
    padding: 32,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoPlaceholder: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    marginLeft: 8,
    flex: 1,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  headerLogo: {
    fontSize: 14,
    color: '#6b7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginLeft: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  signOutText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  fileInfo: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  fileInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  fileInfoSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  resultsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  logsList: {
    maxHeight: 300,
  },
  logEntry: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
  },
  successLog: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  errorLog: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  logPlayerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  logMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  logStatus: {
    alignSelf: 'flex-start',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  successBadge: {
    color: '#065f46',
    backgroundColor: '#d1fae5',
  },
  errorBadge: {
    color: '#991b1b',
    backgroundColor: '#fee2e2',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    padding: 16,
    textAlign: 'center',
  },
});

export default App;