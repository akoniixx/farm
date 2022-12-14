import React from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions, useWindowDimensions} from 'react-native';

import {normalize} from '@rneui/themed';
import {Text} from '@rneui/base';
import { colors, font } from '../../assets';

interface LocationSelectProps {
  label: any;
  value: any;
  onPress?: () => void;
}
export const LocationSelect: React.FC<LocationSelectProps> = ({
  label,
  value,
  onPress,
}) => {
  const width = Dimensions.get('window').width;
  return (
    <View
      style={{
        marginRight : (width-normalize(40)-3*normalize(103))/3,
        marginBottom : (width-normalize(40)-3*normalize(103))/3,
        width: '100%',
        height: normalize(60),
        borderBottomWidth: 0.2,
        borderColor: colors.disable
      }}>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            fontFamily: font.SarabunLight,
            fontSize: normalize(16),
            marginTop: normalize(15),
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
interface LocationInPostcodeSelectProps {
  label: any;
  value: any;
  postcode: any;
  onPress?: () => void;
}
export const LocationInPostcodeSelect: React.FC<LocationInPostcodeSelectProps> = ({
  label,
  value,
  postcode,
  onPress,
}) => {
  const width = Dimensions.get('window').width;
  return (
    <View
      style={{
        marginRight : (width-normalize(40)-3*normalize(103))/3,
        marginBottom : (width-normalize(40)-3*normalize(103))/3,
        width: '100%',
        height: normalize(60),
        borderBottomWidth: 0.2,
        borderColor: colors.disable
      }}>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            fontFamily: font.SarabunLight,
            fontSize: normalize(16),
            marginTop: normalize(15),
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};


