import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

export default function ProgressBarAnimated({
  current = 90,
  total = 100,
  height = 14,
}: {
  current?: number;
  total?: number;
  height?: number;
  color?: string;
}) {
  const progress = (current / total) * 100;
  return (
    <View style={[styles.container, {height}]}>
      <LinearGradient
        colors={['#F89132', '#FFDE1F']}
        start={{x: 0, y: 0}}
        end={{x: 0.6, y: 0.4}}
        style={[styles.progress, {width: `${progress}%`}]}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progress: {
    height: '100%',
    width: '100%',
  },
});
