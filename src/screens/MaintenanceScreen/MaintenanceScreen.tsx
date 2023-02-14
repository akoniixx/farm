import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { stylesCentral } from '../../styles/StylesCentral';
import { MainButton } from '../../components/Button/MainButton';
import { colors, font, image } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize } from '../../functions/Normalize';

const MaintenanceScreen: React.FC<any> = ({ navigation }) => {
  return (
    <SafeAreaView style={stylesCentral.container}>
      <View
        style={{
          paddingHorizontal: 16,
          justifyContent: 'space-between',
        }}>
        <View style={{ alignItems: 'center', marginTop: 180}}>
          <Image
            source={image.maintenance}
            style={{ width: 156, height: 160 }}
          />
          <View style={{ marginTop: 20 }}>
            <Text style={styles.fontTitle}>เรียนเกษตรกรทุกท่าน</Text>
          </View>
          <View
            style={{
              paddingHorizontal: 30,
              marginTop: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: font.AnuphanMedium,
                fontSize: normalize(24),
                color: colors.fontBlack,
                fontWeight: '800',
              }}>
              {`วันที่ `}
              <Text
                style={{
                  color: '#FB8705',
                }}>
                20 กุมภาพันธ์ 2565
              </Text>
            </Text>
            <Text
              style={{
                fontFamily: font.AnuphanMedium,
                fontSize: normalize(24),
                color: colors.fontBlack,
                fontWeight: '800',
                marginBottom: 2,
              }}>
              ช่วงเวลา 00:00 - 03:00 น.
            </Text>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: normalize(18),
                  color: colors.fontBlack,
                  marginBottom: 2,
                }}>
                ระบบจะปิดปรับปรุงชั่วคราว
              </Text>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: normalize(18),
                  color: colors.fontBlack,
                }}>
                เพื่อเพิ่มประสิทธิภาพระบบให้ดียิ่งขึ้น
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
           marginTop: 30
          }}>
          <MainButton
            label="ปิด"
            color={colors.greenLight}
            fontColor={'white'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MaintenanceScreen;
const styles = StyleSheet.create({
  fontTitle: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(22),
    color: colors.fontBlack,
    fontWeight: '800',
  },
  fontBody: {
    fontFamily: fonts.SarabunLight,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
});
