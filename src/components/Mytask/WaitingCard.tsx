import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, image } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize } from '../../functions/Normalize';
import { dialCall } from '../../functions/utility';

export const WaittingCard = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Image
          source={image.droneBrown}
          style={{
            width: normalize(56),
            height: normalize(56),
            borderRadius: 50,
            marginRight: normalize(10),
          }}
        />
        <View>
          <Text style={styles.name}>ระบบค้นหาอัตโนมัติ</Text>
          <Text style={styles.h2}>คัดสรรนักบินคุณภาพ</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  name: {
    fontFamily: fonts.SarabunMedium,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: fonts.SarabunLight,
    fontSize: normalize(16),
    color: '#8D96A0',
  },
});
