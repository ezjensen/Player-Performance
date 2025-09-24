import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isComplete ? 'Processing Complete' : 'Generating PDFs'}
          </Text>
          <Text style={styles.counter}>
            {current} / {total}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                { width: `${percentage}%` }
              ]}
            />
          </View>
        </View>

        {currentPlayer && !isComplete && (
          <View style={styles.currentStatus}>
            <Icon name="schedule" size={16} color="#6b7280" />
            <Text style={styles.currentText}>
              Processing: {currentPlayer}
            </Text>
          </View>
        )}

        {isComplete && (
          <View style={styles.completeStatus}>
            <Icon name="check-circle" size={16} color="#10b981" />
            <Text style={styles.completeText}>
              All PDFs generated successfully
            </Text>
          </View>
        )}
        
        <Text style={styles.percentageText}>
          Progress: {percentage.toFixed(1)}%
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
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxWidth: 600,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  counter: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  currentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  completeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  completeText: {
    fontSize: 14,
    color: '#10b981',
    marginLeft: 8,
  },
  percentageText: {
    fontSize: 12,
    color: '#6b7280',
  },
});