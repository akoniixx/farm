import {View, Text, ViewStyle} from 'react-native';
import React from 'react';

interface Props {
  borderColor?: string;
  style?: ViewStyle;
}
export default function Divider({borderColor = '#DCDFE3', style}: Props) {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        paddingVertical: 4,
        ...style,
      }}
    />
  );
}
