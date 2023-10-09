import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';

import { normalize } from '@rneui/themed';
import { colors, font } from '../../assets';
import Text from '../Text/Text';

interface LocationSelectProps {
  label: any;
  value: any;
  onPress?: (v: any) => void;
  item: any;
}
export const LocationSelect: React.FC<LocationSelectProps> = ({
  label,
  onPress,
  item,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress(item);
      }}
      style={{
        marginLeft: 8,
        width: '100%',
        height: normalize(70),
        borderBottomWidth: 0.2,
        borderColor: colors.disable,
        justifyContent: 'center',
      }}>
      <View>
        <Text
          style={{
            fontFamily: font.SarabunLight,
            fontSize: normalize(20),
            color: colors.fontBlack,
            lineHeight: normalize(30),
          }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
interface LocationInPostcodeSelectProps {
  label: any;
  value: any;
  postcode: any;
  onPress?: () => void;
}
export const LocationInPostcodeSelect: React.FC<
  LocationInPostcodeSelectProps
> = ({ label, value, postcode, onPress }) => {
  const width = Dimensions.get('window').width;
  return (
    <View
      style={{
        marginRight: (width - normalize(40) - 3 * normalize(103)) / 3,
        marginBottom: (width - normalize(40) - 3 * normalize(103)) / 3,
        width: '100%',
        height: normalize(60),
        borderBottomWidth: 0.2,
        borderColor: colors.disable,
      }}>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            fontFamily: font.SarabunLight,
            fontSize: normalize(16),
            marginTop: normalize(15),
            color: colors.fontBlack,
          }}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
