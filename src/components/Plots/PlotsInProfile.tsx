import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
} from 'react-native';
import React from 'react';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { Avatar } from '@rneui/base';

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
        colorBg: colors.white,
        fontColor: colors.error,
        borderColor: colors.error,
      };
    case 'REJECTED':
      return {
        status: 'ไม่อนุมัติ',
        colorBg: colors.white,
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
  const windowWidth = Dimensions.get('screen').width;

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 5,
        alignSelf: 'center',
        paddingHorizontal: 10,
        width: '100%',
      }}>
      {StatusObject(status).status === 'ตรวจสอบแล้ว' ? (
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
                numberOfLines={1}
                style={{
                  fontFamily: fonts.SarabunMedium,
                  fontSize: normalize(16),
                  color: colors.fontGrey,
                  marginRight: '10%',
                  width: normalize(280),
                  bottom: 2,
                }}>
                {locationName}
              </Text>
            </View>
          </View>
        </View>
      ) : (
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
                numberOfLines={1}
                style={{
                  fontFamily: fonts.SarabunMedium,
                  fontSize: normalize(16),
                  color: colors.fontGrey,
                  marginRight: '10%',
                  width: normalize(280),
                  bottom: 2,
                }}>
                {locationName}
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
  h1: {
    color: colors.primary,
    fontFamily: font.SarabunBold,
    fontSize: normalize(18),
  },
  cards: {
    height: 'auto',
    width: normalize(340),
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
