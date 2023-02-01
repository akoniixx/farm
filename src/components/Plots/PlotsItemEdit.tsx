import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
} from 'react-native';
import React from 'react';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons } from '../../assets';
import fonts from '../../assets/fonts';

interface AddPlot {
  index: number;
  plotName: string;
  raiAmount: number;
  plantName: string;
  status: string;
  locationName: string;
}

export function StatusObject(status: string) {
  switch (status) {
    case 'PENDING':
      return {
        status: 'รอการตรวจสอบ',
        colorBg: '#FFF2E3',
        fontColor: '#E27904',
        borderColor: colors.darkOrange,
      };
    case 'ACTIVE':
      return {
        status: 'ตรวจสอบแล้ว',
        colorBg: colors.white,
        fontColor: colors.greenLight,
        borderColor: colors.greenLight,
      };
    case 'REJECTED':
      return {
        status: 'ไม่อนุมัติ',
        colorBg: colors.white,
        fontColor: colors.error,
        borderColor: colors.error,
      };
    case 'INACTIVE':
      return {
        status: 'ปิดการใช้งาน',
        colorBg: colors.white,
        fontColor: colors.fontGrey,
        borderColor: colors.bg,
      };
    default:
      return {
        status: 'รอการตรวจสอบ',
        colorBg: '#FFF2E3',
        fontColor: '#E27904',
        borderColor: colors.darkOrange,
      };
  }
}

const PlotsItemEdit: React.FC<AddPlot> = ({
  index,
  plotName,
  raiAmount,
  plantName,
  status,
  locationName,
}) => {
  return (
    <View>
      {StatusObject(status).status === 'ตรวจสอบแล้ว' ? (
        <View
          key={index}
          style={{
            height: normalize(134),
            borderWidth: 0.5,
            borderColor: colors.greenLight,
            backgroundColor: '#ECFBF2',
            borderRadius: normalize(12),
            paddingVertical: normalize(10),
            paddingHorizontal: normalize(20),
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: normalize(10),
          }}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingRight: 30
                }}>
                <Text style={styles.title}>{plotName}</Text>
                <Image
                  source={icons.arrowRigth}
                  style={{
                    ...Platform.select({
                      ios: {
                        width: normalize(20),
                        height: normalize(20),
                        alignSelf: 'flex-end',
                      },
                      android: {
                        width: normalize(20),
                        height: normalize(20),
                        alignSelf: 'flex-end',
                        right: 30,
                      },
                    }),
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
                <Image
                  source={icons.plot}
                  style={{
                    width: normalize(18),
                    height: normalize(20),
                    marginRight: normalize(10),
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.fontGrey,
                    marginRight: '40%',
                  }}>
                  {raiAmount + ' ' + 'ไร่'}
                </Text>
                <Image
                  source={icons.plant}
                  style={{
                    width: normalize(18),
                    height: normalize(20),
                    marginRight: normalize(10),
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.fontGrey,
                    marginRight: '10%',
                  }}>
                  {plantName}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
                <Image
                  source={icons.location}
                  style={{
                    width: normalize(18),
                    height: normalize(20),
                    marginRight: normalize(10),
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.fontGrey,
                    marginRight: '10%',
                    width: normalize(270),
                  }}>
                  {locationName}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View
          key={index}
          style={{
            ...Platform.select({
              ios: {
                height: normalize(145),
                borderWidth: 0.5,
                borderColor: colors.greenLight,
                backgroundColor: '#ECFBF2',
                borderRadius: normalize(12),
                paddingVertical: normalize(10),
                paddingHorizontal: normalize(20),
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: normalize(10),
              },
              android: {
                height: normalize(165),
                borderWidth: 0.5,
                borderColor: colors.greenLight,
                backgroundColor: '#ECFBF2',
                borderRadius: normalize(12),
                paddingVertical: normalize(10),
                paddingHorizontal: normalize(20),
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: normalize(10),
              },
            }),
          }}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingRight: 30
                }}>
                <View>
                  <Text
                    style={[styles.title, { width: normalize(200) }]}
                    numberOfLines={1}>
                    {plotName}
                  </Text>
                </View>
                <Image
                  source={icons.arrowRigth}
                  style={{
                    ...Platform.select({
                      ios: {
                        width: normalize(20),
                        height: normalize(20),
                        alignSelf: 'flex-end',
                      },
                      android: {
                        width: normalize(20),
                        height: normalize(20),
                        alignSelf: 'flex-end',
                        right: 30,
                      },
                    }),
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
                <Image
                  source={icons.plot}
                  style={{
                    width: normalize(18),
                    height: normalize(20),
                    marginRight: normalize(10),
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.fontGrey,
                    marginRight: '40%',
                  }}>
                  {raiAmount + ' ' + 'ไร่'}
                </Text>
                <Image
                  source={icons.plant}
                  style={{
                    width: normalize(18),
                    height: normalize(20),
                    marginRight: normalize(10),
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.fontGrey,
                    marginRight: '10%',
                  }}>
                  {plantName}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
                <Image
                  source={icons.location}
                  style={{
                    width: normalize(18),
                    height: normalize(20),
                    marginRight: normalize(10),
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.fontGrey,
                    marginRight: '10%',
                    width: normalize(270),
                  }}>
                  {locationName}
                </Text>
              </View>
              <View
                style={{
                  top: 10,
                  width: normalize(109),
                  height: normalize(24),
                  borderRadius: normalize(12),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: StatusObject(status).colorBg,
                  borderColor: StatusObject(status).borderColor,
                  borderWidth: 0.5,
                }}>
                <Text
                  style={[
                    styles.label,
                    { color: StatusObject(status).fontColor },
                  ]}>
                  {StatusObject(status).status}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: font.SarabunBold,
    fontSize: normalize(18),
    color: '#0D381F',
  },
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(14),
    color: colors.fontGrey,
  },
});

export default PlotsItemEdit;
