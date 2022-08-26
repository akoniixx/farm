import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

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
  return (
    <View
      style={{
        width: normalize(103),
        height: normalize(37),
        backgroundColor: active ? colors.orange : colors.greyWhite,
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
