import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons } from '../../assets';
import fonts from '../../assets/fonts';

interface plotData {
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
    case 'INACTIVE':
      return {
        status: 'ปิดการใช้งาน',
        colorBg: '#FFF0F0',
        fontColor: colors.error,
        borderColor: colors.error,
      };
    case 'REJECTED':
      return {
        status: 'ไม่อนุมัติ',
        colorBg: '#FFF0F0',
        fontColor: colors.error,
        borderColor: colors.error,
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
const PlotInProfile: React.FC<plotData> = ({
  index,
  plotName,
  raiAmount,
  plantName,
  status,
  locationName,
}) => {
  return (
    <View
      style={{
        width: '100%',
      }}>
      {StatusObject(status).status === 'ตรวจสอบแล้ว' && (
        <View key={index} style={[styles.cards]}>
          <View>
            <Text style={styles.title}>{plotName}</Text>
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
                  bottom: 2,
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
                  bottom: 2,
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
                style={{
                  fontFamily: fonts.SarabunMedium,
                  fontSize: normalize(16),
                  color: colors.fontGrey,
                  marginRight: '10%',
                  width: normalize(280),
                  bottom: 2,
                  lineHeight: 30,
                }}>
                {locationName.length > 30
                  ? locationName.slice(0, 30) + '...'
                  : locationName}
              </Text>
            </View>
          </View>
        </View>
      )}
      {StatusObject(status).status === 'รอการตรวจสอบ' && (
        <View key={index} style={[styles.cardsPending]}>
          <View>
            <Text style={styles.title}>{plotName}</Text>
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
                  bottom: 2,
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
                  bottom: 2,
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
                style={{
                  fontFamily: fonts.SarabunMedium,
                  fontSize: normalize(16),
                  color: colors.fontGrey,
                  marginRight: '10%',
                  width: normalize(280),
                  bottom: 2,
                  lineHeight: 30,
                }}>
                {locationName.length > 30
                  ? locationName.slice(0, 30) + '...'
                  : locationName}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
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
      )}
      {StatusObject(status).status === 'ไม่อนุมัติ' && (
        <View key={index} style={[styles.cardsRejected]}>
          <View>
            <Text style={styles.title}>{plotName}</Text>
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
                  bottom: 2,
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
                  bottom: 2,
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
                style={{
                  fontFamily: fonts.SarabunMedium,
                  fontSize: normalize(16),
                  color: colors.fontGrey,
                  marginRight: '10%',
                  width: normalize(280),
                  bottom: 2,
                  lineHeight: 30,
                }}>
                {locationName.length > 30
                  ? locationName.slice(0, 30) + '...'
                  : locationName}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                width: normalize(135),
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
                {'ไม่ผ่านการตรวจสอบ'}
              </Text>
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
    fontFamily: font.AnuphanBold,
    fontSize: normalize(14),
    color: colors.fontGrey,
  },
  h1: {
    color: colors.primary,
    fontFamily: font.SarabunBold,
    fontSize: normalize(18),
  },
  cards: {
    width: Dimensions.get('window').width - normalize(40),
    height: 'auto',
    backgroundColor: '#ECFBF2',
    borderWidth: 0.5,
    borderColor: colors.greenLight,
    margin: normalize(10),
    borderRadius: normalize(10),
    padding: normalize(10),
  },
  cardsPending: {
    width: Dimensions.get('window').width - normalize(40),
    height: 'auto',
    backgroundColor: '#FFFAF3',
    borderWidth: 0.5,
    borderColor: '#E27904',
    margin: normalize(10),
    borderRadius: normalize(10),
    padding: normalize(10),
  },
  cardsRejected: {
    width: Dimensions.get('window').width - normalize(40),
    height: 'auto',
    backgroundColor: '#FFFAFA',
    borderWidth: 0.5,
    borderColor: colors.error,
    margin: normalize(10),
    borderRadius: normalize(10),
    padding: normalize(10),
  },
  mainButton: {
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: normalize(8),
    width: normalize(343),
  },
  headFont: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(26),
    color: 'black',
  },
  detail: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(14),
    color: 'black',
    textAlign: 'center',
    marginTop: normalize(16),
    flexShrink: 1,
  },
});

export default PlotInProfile;
