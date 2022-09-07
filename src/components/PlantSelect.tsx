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
        width: normalize(103),
        height: normalize(37),
        borderRadius : normalize(6),
        backgroundColor: active ? '#2BB0ED' : colors.greyWhite,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            color: active ? colors.white : colors.fontBlack,
            fontFamily: font.medium,
            fontSize: normalize(16),
          }}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
});
