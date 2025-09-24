import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from 'react-native-document-picker';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen = true, onClose }) => {
  const { settings, updateSettings } = useSettings();
  const [companyName, setCompanyName] = useState(settings.companyName || '');
  const [selectedTheme, setSelectedTheme] = useState(settings.theme || 'system');

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSelectedTheme(theme);
    updateSettings({ theme });
  };

  const handleLogoUpload = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        copyTo: 'cachesDirectory',
      });
      
      if (result && result[0]) {
        // In a real implementation, you'd process the image file
        updateSettings({ companyLogo: result[0].uri });
        Alert.alert('Success', 'Company logo updated');
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        Alert.alert('Error', 'Failed to upload logo');
      }
    }
  };

  const handleSaveCompanyName = () => {
    updateSettings({ companyName });
    Alert.alert('Success', 'Company name saved');
  };

  const removeLogo = () => {
    Alert.alert(
      'Remove Logo',
      'Are you sure you want to remove the company logo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => updateSettings({ companyLogo: undefined }),
        },
      ]
    );
  };

  const SettingsContent = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Icon name="settings" size={24} color="#111827" />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Theme Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.themeContainer}>
          {[
            { value: 'light', label: 'Light', icon: 'wb-sunny' },
            { value: 'dark', label: 'Dark', icon: 'brightness-2' },
            { value: 'system', label: 'System', icon: 'computer' },
          ].map(({ value, label, icon }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.themeOption,
                selectedTheme === value && styles.themeOptionSelected,
              ]}
              onPress={() => handleThemeChange(value as any)}
            >
              <Icon
                name={icon}
                size={20}
                color={selectedTheme === value ? '#3b82f6' : '#6b7280'}
              />
              <Text
                style={[
                  styles.themeOptionText,
                  selectedTheme === value && styles.themeOptionTextSelected,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Company Logo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Logo</Text>
        {settings.companyLogo ? (
          <View style={styles.logoContainer}>
            <View style={styles.logoPreview}>
              <Text style={styles.logoPlaceholder}>Logo Preview</Text>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={removeLogo}>
              <Text style={styles.removeButtonText}>Remove Logo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={handleLogoUpload}>
            <Icon name="cloud-upload" size={24} color="#6b7280" />
            <Text style={styles.uploadButtonText}>Upload Logo</Text>
            <Text style={styles.uploadHint}>PNG, JPG or SVG</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Company Name */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Name</Text>
        <View style={styles.inputContainer}>
          <Icon name="business" size={20} color="#6b7280" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="Enter company name"
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveCompanyName}
          >
            <Icon name="save" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Google API Configuration */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Google API Configuration</Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.textInput}
            placeholder="Google Client ID"
            placeholderTextColor="#9ca3af"
          />
          <TextInput
            style={[styles.textInput, styles.textInputMargin]}
            placeholder="Google Client Secret"
            placeholderTextColor="#9ca3af"
            secureTextEntry={true}
          />
          <Text style={styles.hint}>
            Get these credentials from the Google Cloud Console
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  if (onClose) {
    return (
      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <SettingsContent />
        </View>
      </Modal>
    );
  }

  return <SettingsContent />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeButton: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  themeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  themeOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  themeOptionText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  themeOptionTextSelected: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoPreview: {
    width: 120,
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  logoPlaceholder: {
    fontSize: 14,
    color: '#6b7280',
  },
  removeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  removeButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 8,
  },
  uploadHint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#111827',
  },
  textInputMargin: {
    marginTop: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  inputGroup: {
    gap: 12,
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <SettingsIcon className="h-6 w-6 text-gray-900 dark:text-white mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value as any)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                    settings.theme === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1 text-gray-700 dark:text-gray-300" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              Company Logo
            </label>
            {settings.companyLogo ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <img
                    src={settings.companyLogo}
                    alt="Company Logo"
                    className="max-h-16 max-w-32 object-contain"
                  />
                </div>
                <button
                  onClick={removeLogo}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-md transition-colors"
                >
                  Remove Logo
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload logo</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or SVG</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              Company Name
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={handleSaveCompanyName}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};