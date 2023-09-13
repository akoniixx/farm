import React from 'react';
import {View, StyleSheet} from 'react-native';

import {normalize} from '@rneui/themed';
import colors from '../assets/colors/colors';

interface ProgressBarProps {
  index: number;
}
export const ProgressBar: React.FC<ProgressBarProps> = ({index}) => {
  const progress = [1, 2, 3, 4];

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      {progress.map(i => (
        <View
          key={i}
          style={{
            width: normalize(80),
            height: 4,
            backgroundColor: i <= index ? colors.orange : colors.disable,
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
});
