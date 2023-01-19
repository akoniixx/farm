import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';
import DashedLine from 'react-native-dashed-line';
import { image } from '../../assets';
import { momentExtend } from '../../utils/moment-buddha-year';
import { formatNumberWithComma } from '../../utils/ formatNumberWithComma';

export default function SlipCard() {
  const listDataObj = {
    date: {
      label: 'วันที่',
      value: momentExtend.toBuddhistYear(new Date(), 'DD MMMM YYYY'),
    },
    time: {
      label: 'เวลา',
      value: momentExtend.toBuddhistYear(new Date(), 'HH:mm น.'),
    },
    plantInjection: {
      label: 'พืชที่พ่น',
      value: 'ข้าวโพด',
    },
    timeInjection: {
      label: 'ช่วงเวลาการพ่น',
      value: 'คุมเลน',
    },
    targetInjection: {
      label: 'เป้าหมายการพ่น',
      value: 'หญ้า',
    },
    prepareType: {
      label: 'ยาที่ต้องใช้',
      value: 'เกษตกรเตรียมเอง',
    },
    note: {
      label: 'หมายเหตุ',
      value: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  };
  const listArray = Object.keys(listDataObj);
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 32,
          marginBottom: 16,
        }}>
        <Text
          style={{
            color: colors.fontBlack,
            fontFamily: fonts.AnuphanBold,
            fontSize: 16,
          }}>
          Task No.
        </Text>
        <Text
          style={{
            color: colors.fontBlack,
            fontSize: 16,
            fontFamily: fonts.SarabunMedium,
          }}>
          TK20221018TH-0000001
        </Text>
      </View>
      <View style={styles.shadow}>
        <View style={styles.card}>
          {listArray.map((item, index) => {
            return (
              <View
                style={{
                  marginBottom: 8,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: colors.fontBlack,
                    fontSize: 18,
                    fontFamily: fonts.SarabunLight,
                  }}>
                  {listDataObj[item as keyof typeof listDataObj].label}
                </Text>
                <View
                  style={{
                    width: '60%',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: colors.fontBlack,
                      fontSize: 18,
                      fontFamily: fonts.SarabunMedium,
                    }}>
                    {listDataObj[item as keyof typeof listDataObj].value}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <DashedLine
        dashColor={colors.grayBg}
        dashGap={16}
        style={{
          width: '98%',
        }}
      />

      <View style={styles.shadow}>
        <View
          style={[
            styles.card,
            {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#ECFBF2',
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: colors.fontBlack,
                fontSize: 18,
                fontFamily: fonts.SarabunLight,
              }}>
              การชำระเงิน
            </Text>
            <Text
              style={{
                color: colors.fontBlack,
                fontSize: 18,
                fontFamily: fonts.SarabunMedium,
              }}>
              เงินสด
            </Text>
          </View>
          <Text
            style={{
              color: colors.fontBlack,
              fontSize: 18,
              fontFamily: fonts.AnuphanMedium,
              marginTop: 16,
              textAlign: 'center',
            }}>
            รวมค่าบริการ
          </Text>
          <Text
            style={{
              color: colors.greenLight,
              fontSize: 30,
              fontFamily: fonts.AnuphanBold,
              marginTop: 16,
              textAlign: 'center',
            }}>
            {`${formatNumberWithComma(1000)} บาท`}
          </Text>
        </View>
      </View>
      <Image
        source={image.endSlip}
        resizeMode="center"
        style={{
          width: '100%',
          height: 14,
          marginTop: -5,
          zIndex: 1,
          backgroundColor: 'transparent',
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
});
