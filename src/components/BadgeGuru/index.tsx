import {View, StyleSheet} from 'react-native';
import React from 'react';
import Text from '../Text';
import {colors, font} from '../../assets';
interface Props {
  title: string;
}
export default function BadgeGuru({title}: Props) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 14,
    position: 'absolute',
    right: 12,
    bottom: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
  },
  text: {
    fontSize: 12,
    fontFamily: font.semiBold,
  },
});
