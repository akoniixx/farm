import React from 'react';
import {View} from 'react-native';
import colors from '../assets/colors/colors';
import { normalize } from '../functions/Normalize';
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
            backgroundColor: i <= index ? colors.greenLight : colors.disable,
          }}
        />
      ))}
    </View>
  );
};

