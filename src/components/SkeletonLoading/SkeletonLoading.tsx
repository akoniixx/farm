import {View, ViewStyle} from 'react-native';
import React from 'react';
import colors from '../../assets/colors/colors';
import {Skeleton} from '@rneui/base';

interface Props {
  style?: ViewStyle;
  height?: number;
  width?: number;
  rows?: number;
}
export default function SkeletonLoading({style, rows = 1, ...props}: Props) {
  const box = Array.from({length: rows}, (_, i) => i);
  return (
    <View>
      {box.map((_, i) => {
        return (
          <Skeleton
            skeletonStyle={{
              backgroundColor: colors.loading,
            }}
            style={{
              borderRadius: 10,
              ...style,
            }}
            {...props}
          />
        );
      })}
    </View>
  );
}
