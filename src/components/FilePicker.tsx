import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FilePickerProps {
  onFileSelected: (fileId: string, fileName: string) => void;
  isLoading?: boolean;
}

export const FilePicker: React.FC<FilePickerProps> = ({ 
  onFileSelected, 
  isLoading = false 
}) => {
  const [isPickerLoading, setIsPickerLoading] = useState(false);

  const openPicker = async () => {
    // For React Native, we'd use a different approach for Google Picker
    // This is a simplified version that shows a mock picker
    try {
      setIsPickerLoading(true);
      
      // Simulate file picker dialog
      Alert.alert(
        'Select Google Sheet',
        'Choose a Google Sheet containing athlete profiles and dashboard',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setIsPickerLoading(false),
          },
          {
            text: 'Select Demo File',
            onPress: () => {
              // Simulate selecting a file
              setTimeout(() => {
                onFileSelected('demo-file-id', 'Player Performance Data.xlsx');
                setIsPickerLoading(false);
              }, 1000);
            },
          },
        ]
      );
    } catch (error) {
      console.error('File picker error:', error);
      Alert.alert('Error', 'Failed to open file picker');
      setIsPickerLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Icon name="description" size={48} color="#3b82f6" style={styles.icon} />
          <Text style={styles.title}>Select Google Sheet</Text>
          <Text style={styles.subtitle}>
            Choose a Google Sheet containing athlete profiles and dashboard
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.button,
            (isLoading || isPickerLoading) && styles.buttonDisabled
          ]}
          onPress={openPicker}
          disabled={isLoading || isPickerLoading}
        >
          {isPickerLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.buttonText}>Opening Picker...</Text>
            </View>
          ) : (
            <View style={styles.buttonContent}>
              <Icon name="cloud-upload" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Choose File</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <Text style={styles.requirement}>
          Required sheets: "Profiles" and "Dashboard"
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxWidth: 400,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  requirement: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
  },
});