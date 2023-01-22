import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts';
import { colors } from '../../assets';
import SlipCard from '../../components/SlipCard/SlipCard';

export default function SectionBody() {
  return (
    <View style={styled.container}>
      <View>
        <Text
          style={{
            color: colors.orangeLight,
            fontFamily: fonts.AnuphanBold,
            fontSize: 24,
            textAlign: 'center',
            paddingVertical: 8,
          }}>
          รอนักบินโดรนรับงานให้คุณ
        </Text>
        <Text
          style={{
            color: colors.fontBlack,
            textAlign: 'center',
            fontFamily: fonts.SarabunMedium,
            fontSize: 18,
          }}>
          อาจจะใช้เวลาสักครู่ คุณสามารถใช้ส่วนอื่นๆ เพื่อรอนักบินโดรนรับงาน
        </Text>
        <SlipCard />
      </View>
    </View>
  );
}
const styled = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 0,
  },
  fontSarabunM: {
    fontFamily: fonts.SarabunMedium,
  },
  fontSarabunB: {
    fontFamily: fonts.SarabunBold,
  },
});
