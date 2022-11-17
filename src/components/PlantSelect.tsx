import React from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions, useWindowDimensions} from 'react-native';

import {normalize} from '@rneui/themed';
import colors from '../assets/colors/colors';
import {Text} from '@rneui/base';
import {font} from '../assets';

interface PrantSelectProps {
  label: string;
  active: boolean;
  onPress?: () => void;
}
export const PlantSelect: React.FC<PrantSelectProps> = ({
  label,
  active,
  onPress,
}) => {
  const width = Dimensions.get('window').width;
  return (
    <View
      style={{
        margin: '2%',
        width: normalize(165),
        height: normalize(47),
        borderRadius : normalize(6),
        backgroundColor: active ? '#2BB0ED' : colors.greyWhite,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            color: active ? colors.white : colors.fontBlack,
            fontFamily: font.Sarabun,
            fontSize: normalize(16),
          }}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
