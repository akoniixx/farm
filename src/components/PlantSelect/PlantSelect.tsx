import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
} from 'react-native';

import { normalize } from '@rneui/themed';
import { Text } from '@rneui/base';
import { colors, font } from '../../assets';

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
            height: '100%',
            color: colors.fontBlack
          }}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
