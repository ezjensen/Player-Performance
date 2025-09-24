import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';
import { AppSettings } from '../types';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  isDarkMode: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({ theme: 'system' });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      updateTheme(colorScheme);
    });

    return () => subscription?.remove();
  }, [settings.theme]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('player-performance-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        updateTheme(Appearance.getColorScheme());
      } else {
        updateTheme(Appearance.getColorScheme());
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      updateTheme(Appearance.getColorScheme());
    }
  };

  const updateTheme = (systemColorScheme: ColorSchemeName) => {
    let shouldBeDark = false;
    
    if (settings.theme === 'dark') {
      shouldBeDark = true;
    } else if (settings.theme === 'light') {
      shouldBeDark = false;
    } else {
      // system theme
      shouldBeDark = systemColorScheme === 'dark';
    }
    
    setIsDarkMode(shouldBeDark);
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await AsyncStorage.setItem('player-performance-settings', JSON.stringify(updatedSettings));
      
      // Update theme if theme setting changed
      if (newSettings.theme) {
        updateTheme(Appearance.getColorScheme());
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const value = {
    settings,
    updateSettings,
    isDarkMode,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};