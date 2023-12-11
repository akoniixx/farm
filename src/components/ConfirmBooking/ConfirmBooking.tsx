import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons } from '../../assets';
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
  loading?: boolean;
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
  loading,
}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingTop: normalize(30),
        paddingHorizontal: normalize(20),
        width: windowWidth,
        height: windowHeight * 0.86,
        borderRadius: normalize(20),
      }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View style={{ flex: 1 }}>
            <View>
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
                  paddingTop: 10,
                  paddingBottom: 4,
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.plot}
                  style={{ width: normalize(20), height: normalize(20) }}
                />
                <Text style={styles.textConfirm}> {plotName} , </Text>
                <Text style={styles.textConfirm}>{raiAmount} ไร่</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 2,
                  alignItems: 'center',
                }}>
                {isSelectDrone === 'ระบบค้นหานักบินอัตโนมัติ' && (
                  <View
                    style={{
                      backgroundColor: '#B05E03',
                      borderRadius: 50,
                      padding: 4,
                    }}>
                    <Image
                      source={icons.drone_auto}
                      style={{ width: normalize(16), height: normalize(16) }}
                    />
                  </View>
                )}
                {isSelectDrone === 'ระบบค้นหานักบินอัตโนมัติ' ? (
                  <Text style={styles.textConfirm}>{isSelectDrone}</Text>
                ) : (
                  isSelectDrone
                )}
              </View>
              <View
                style={{
                  backgroundColor: colors.bg,
                  height: 0.5,
                  padding: 0,
                  marginVertical: 10,
                }}
              />
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text style={styles.textPrice}>วิธีการชำระเงิน</Text>
                <Text style={styles.textPrice}>เงินสด</Text>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text style={styles.textPrice}>ราคารวม</Text>
                <Text style={styles.textPrice}>
                  {`${numberWithCommas(totalPrice, true)} บาท`}
                </Text>
              </View>
              {isUsePoint && (
                <>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.textDiscount}>ส่วนลดแต้ม</Text>
                    <Text
                      style={[styles.textDiscount, { color: colors.orange }]}>
                      {`- ${numberWithCommas(discountPoint, true)} บาท`}
                    </Text>
                  </View>
                </>
              )}
              {couponInfo && (
                <>
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.textDiscount}>ส่วนลดคูปอง</Text>
                    <Text
                      style={[styles.textDiscount, { color: colors.orange }]}>
                      {`- ${numberWithCommas(discountCoupon, true)} บาท`}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <View>
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 5,
              alignContent: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: font.AnuphanSemiBold,
                fontSize: normalize(20),
              }}>
              รวมค่าบริการ
            </Text>
            <Text
              style={{
                fontFamily: font.AnuphanSemiBold,
                fontSize: normalize(20),
                color: colors.greenLight,
              }}>
              {`${numberWithCommas(price.toString(), true)} บาท`}
            </Text>
          </View>
          <View>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={[
                  styles.textDiscount,
                  { color: colors.grey20, fontSize: 16 },
                ]}>
                ได้รับแต้มโดยประมาณ
              </Text>
              <Text
                style={[
                  styles.textDiscount,
                  { color: colors.grey20, fontSize: 16 },
                ]}>
                {`≈${numberWithCommas(campaignPoint, true)} แต้ม`}
              </Text>
            </View>
          </View>
        </View>
        <MainButton
          label="ยืนยัน"
          onPress={submit}
          disable={loading}
          color={colors.greenLight}
          fontFamily={font.AnuphanSemiBold}
          style={{
            height: 54,
          }}
        />
        <MainButton
          label="ยกเลิก"
          fontColor={colors.fontBlack}
          fontFamily={font.AnuphanSemiBold}
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
    fontFamily: font.SarabunLight,
    paddingLeft: 5,
    alignContent: 'center',
    lineHeight: normalize(30),
  },
  textPrice: {
    fontFamily: font.SarabunSemiBold,
    color: colors.grey60,
    fontSize: normalize(18),
    paddingVertical: 5,
    alignContent: 'center',
  },
  textDiscount: {
    fontFamily: font.SarabunSemiBold,
    color: colors.primary,
    fontSize: normalize(18),
    paddingVertical: 5,
    alignContent: 'center',
  },
});
