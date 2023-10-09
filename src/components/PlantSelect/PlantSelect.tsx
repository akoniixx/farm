import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { normalize } from '@rneui/themed';
import { colors, font } from '../../assets';
import Text from '../Text/Text';

interface PrantSelectProps {
  label: string;
  id: any;
  onPress?: () => void;
}
export const PlantSelect: React.FC<PrantSelectProps> = ({
  label,
  id,
  onPress,
}) => {
  const width = Dimensions.get('window').width;
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          marginRight: (width - normalize(40) - 3 * normalize(103)) / 3,
          width: '100%',
          minHeight: normalize(60),
          borderTopWidth: 0.5,
          borderColor: colors.disable,
          justifyContent: 'center',
          paddingVertical: 16,
        }}>
        <Text
          style={{
            fontFamily: font.SarabunLight,
            fontSize: normalize(20),

            color: colors.fontBlack,
          }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
