import React from 'react';
import {View, StyleSheet} from 'react-native';

import {normalize} from '@rneui/themed';
import colors from '../assets/colors/colors';
import {width} from '../function/Normalize';

interface ProgressBarProps {
  index: number;
}
export const ProgressBarV2: React.FC<ProgressBarProps> = ({index}) => {
  const progress = [1, 2];

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
            width: normalize(width / 2 - 34),
            height: 4,
            backgroundColor: i <= index ? colors.orange : colors.disable,
          }}
        />
      ))}
    </View>
  );
};
