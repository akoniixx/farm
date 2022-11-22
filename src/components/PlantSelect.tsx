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
        marginRight : (width-normalize(40)-3*normalize(103))/3,
        marginBottom : (width-normalize(40)-3*normalize(103))/3,
        width: normalize(160),
        height: normalize(50),
        borderRadius : normalize(6),
        backgroundColor: active ? colors.greenLight : colors.greyWhite,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            color: active ? colors.white : colors.fontBlack,
            fontFamily: font.SarabunLight,
            fontSize: normalize(16),
          }}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
