import {
  Image,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons } from '../../assets';
import fonts from '../../assets/fonts';
import Text from '../Text/Text';

interface AddPlot {
  index: number;
  plotName: string;
  raiAmount: number;
  plantName: string;
  status: string;
  locationName: string;
  navigation: any;
  plotId: string;
  fromRegister: boolean;
  data: any;
}

export function StatusObject(status: string) {
  switch (status) {
    case 'PENDING':
      return {
        status: 'รอการตรวจสอบ',
        colorBg: '#fffaf3',
        fontColor: '#E27904',
        borderColor: colors.darkOrange,
        bgBadge: '#fff2e3',
      };
    case 'ACTIVE':
      return {
        status: 'ตรวจสอบแล้ว',
        colorBg: colors.white,
        fontColor: colors.greenLight,
        borderColor: colors.greenLight,
        bgBadge: '#f2fff2',
      };
    case 'REJECTED':
      return {
        status: 'ไม่อนุมัติ',
        colorBg: colors.white,
        fontColor: colors.error,
        borderColor: colors.error,
        bgBadge: '#fff2f2',
      };
    case 'INACTIVE':
      return {
        status: 'ปิดการใช้งาน',
        colorBg: colors.greyDivider,
        fontColor: colors.fontGrey,
        borderColor: colors.fontGrey,
        bgBadge: '#f2f2f2',
      };
    default:
      return {
        status: 'รอการตรวจสอบ',
        colorBg: '#FFF2E3',
        fontColor: '#E27904',
        borderColor: colors.darkOrange,
        bgBadge: '#fffaf3',
      };
  }
}

const PlotsItem: React.FC<AddPlot> = ({
  plotName,
  raiAmount,
  plantName,
  status,
  locationName,
  navigation,
  fromRegister,
  plotId,
  data,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation?.navigate('EditPlotScreen', {
          plotId: plotId,
          fromRegister: fromRegister,
          data,
        });
      }}
      style={{
        backgroundColor: StatusObject(status).colorBg,
        borderWidth: 1,
        borderColor: StatusObject(status).borderColor,
        ...Platform.select({
          ios: {
            height: normalize(140),
            borderWidth: 0.5,
            // borderColor: colors.greenLight,
            // backgroundColor: '#ECFBF2',
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
            height: 'auto',
            borderWidth: 0.5,
            // borderColor: colors.greenLight,
            // backgroundColor: '#ECFBF2',
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
          <Text style={styles.title}>{plotName}</Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: normalize(10),
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginRight: normalize(10),
              }}>
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
                }}>
                {raiAmount + ' ' + 'ไร่'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginRight: normalize(10),
              }}>
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
              marginTop: 10,
              width: normalize(109),
              height: normalize(24),
              borderRadius: normalize(12),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: StatusObject(status).bgBadge,
              borderColor: StatusObject(status).borderColor,
              borderWidth: 0.5,
            }}>
            <Text
              style={[styles.label, { color: StatusObject(status).fontColor }]}>
              {StatusObject(status).status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: font.SarabunBold,
    fontSize: normalize(18),
    color: '#0D381F',
    lineHeight: normalize(28),
  },
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(14),
    color: colors.fontGrey,
  },
});

export default PlotsItem;
