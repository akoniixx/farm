import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons, image } from '../../assets';
import Text from '../Text/Text';
import { MainButton } from '../Button/MainButton';
import { numberWithCommas } from '../../functions/utility';

interface ConfirmBookingProps {
  plotName: any;
  raiAmount: any;
  isSelectDrone: any;
  price: any;
  totalPrice: any;
  close: () => void;
  submit: () => void;
  isUsePoint: any;
  discountPoint: any;
  couponInfo: any;
  discountCoupon: any;
  campaignPoint: any;
}
const ConfirmBooking: React.FC<ConfirmBookingProps> = ({
  plotName,
  raiAmount,
  isSelectDrone,
  price,
  totalPrice,
  close,
  submit,
  isUsePoint,
  discountPoint,
  couponInfo,
  discountCoupon,
  campaignPoint,
}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingVertical: normalize(30),
        paddingHorizontal: normalize(20),
        width: windowWidth,
        height: windowHeight * 0.86,
        borderRadius: normalize(20),
      }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: 8,
          }}>
          <Text style={{ fontSize: 22, fontFamily: font.AnuphanBold }}>
            กรุณายืนยันการจอง
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            alignItems: 'center',
          }}>
          <Image
            source={icons.plot}
            style={{ width: normalize(42), height: normalize(42) }}
          />
          <Text style={styles.textConfirm}> {plotName} , </Text>
          <Text style={styles.textConfirm}>{raiAmount} ไร่</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            alignItems: 'center',
          }}>
          {isSelectDrone === 'ระบบค้นหานักบินอัตโนมัติ' && (
            <View
              style={{
                backgroundColor: '#B05E03',
                borderRadius: 50,
                padding: 9,
                marginHorizontal: 4,
              }}>
              <Image
                source={icons.drone_auto}
                style={{ width: normalize(24), height: normalize(24) }}
              />
            </View>
          )}
          <Text style={styles.textConfirm}>{isSelectDrone}</Text>
        </View>
        <View style={{ backgroundColor: colors.bg, height: 0.5, margin: 10 }} />
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={styles.textPrice}>วิธีการชำระเงิน</Text>
          <Text style={styles.textPrice}>เงินสด</Text>
        </View>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={styles.textPrice}>ราคารวม</Text>
          <Text style={styles.textPrice}>
            {`${numberWithCommas(totalPrice, true)} บาท`}
          </Text>
        </View>
        {isUsePoint && (
          <>
            <View
              style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={styles.textDiscount}>ส่วนลดแต้ม</Text>
              <Text style={[styles.textDiscount, { color: colors.orange }]}>
                {`- ${numberWithCommas(discountPoint, true)} บาท`}
              </Text>
            </View>
          </>
        )}
        {couponInfo && (
          <>
            <View
              style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={styles.textDiscount}>ส่วนลดคูปอง</Text>
              <Text style={[styles.textDiscount, { color: colors.orange }]}>
                {`- ${numberWithCommas(discountCoupon, true)} บาท`}
              </Text>
            </View>
          </>
        )}
      </View>
      <View style={{ marginBottom: '15%' }}>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 10,
            alignContent: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{ fontFamily: font.AnuphanBold, fontSize: normalize(20) }}>
            รวมค่าบริการ
          </Text>
          <Text
            style={{
              fontFamily: font.AnuphanBold,
              fontSize: normalize(20),
              color: colors.greenLight,
            }}>
            {`${numberWithCommas(price.toString(), true)} บาท`}
          </Text>
        </View>
        <View>
          {isUsePoint && (
            <>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text style={[styles.textDiscount, { color: colors.grey20 }]}>
                  ได้รับแต้มโดยประมาณ
                </Text>
                <Text style={[styles.textDiscount, { color: colors.grey20 }]}>
                  {`≈ ${numberWithCommas(campaignPoint, true)} แต้ม`}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View>
        <MainButton
          label="ยืนยัน"
          onPress={submit}
          color={colors.greenLight}
          style={{
            height: 54,
          }}
        />
        <MainButton
          label="ยกเลิก"
          fontColor={colors.fontBlack}
          onPress={close}
          color={colors.white}
          borderColor={colors.fontBlack}
          style={{
            height: 54,
          }}
        />
      </View>
    </View>
  );
};

export default ConfirmBooking;
const styles = StyleSheet.create({
  textConfirm: {
    fontSize: normalize(18),
    fontFamily: font.SarabunMedium,
    paddingLeft: 5,
    alignContent: 'center',
  },
  textPrice: {
    fontFamily: font.SarabunBold,
    color: colors.grey60,
    fontSize: normalize(18),
    paddingVertical: 8,
    alignContent: 'center',
  },
  textDiscount: {
    fontFamily: font.SarabunBold,
    color: colors.primary,
    fontSize: normalize(18),
    paddingVertical: 8,
    alignContent: 'center',
  },
});
