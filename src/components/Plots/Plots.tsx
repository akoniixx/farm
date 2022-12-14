import { Image, StyleSheet, Text, View, TextInput } from 'react-native';
import React from 'react';
import {normalize} from '../../functions/Normalize';
import {colors, font, icons} from '../../assets';
import fonts from '../../assets/fonts';

interface AddPlot {
  plotName: string;
  raiAmount: number;
  plantName: string;
  status: string;
  landMark: string;
  locationName: string;
}

export function StatusObject(status: string) {
  switch (status) {
    case 'PENDING':
      return {
        status: 'รอการตรวจสอบ',
        colorBg: '#FDF0E3',
        fontColor: '#E27904',
        borderColor: colors.darkOrange
      };
    case 'ACTIVE':
      return {
        status: 'ตรวจสอบแล้ว',
        colorBg: 'rgba(46, 198, 110, 0.15)',
        fontColor: '#014D40',
      };
    default:
      return {
        status: 'รอการตรวจสอบ',
        colorBg: '#FDF0E3',
        fontColor: '#E27904',
        borderColor: colors.darkOrange
      };
  }
}

const PlotsItem: React.FC<AddPlot> = ({
  plotName,
  raiAmount,
  plantName,
  status,
  landMark,
  locationName
}) => {
  return (
    <View
      style={{
        height: normalize(131),
        borderWidth: 0.5,
        borderColor: colors.greenLight,
        backgroundColor: '#ECFBF2',
        borderRadius: normalize(10),
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
          <Text style={styles.title}>{plotName}</Text>
          <View style={{flexDirection: 'row', marginTop: normalize(10) }}>
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
          <View style={{flexDirection: 'row', marginTop: normalize(10)}}>
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
              }}>
                 {locationName.length < 15
                ? `${locationName}`
                : `${locationName.substring(0, 15)}...`}
             
            </Text>
            <View
              style={{
                width: normalize(109),
                height: normalize(24),
                borderRadius: normalize(12),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: StatusObject(status).colorBg,
                borderColor: StatusObject(status).borderColor
                }}>
              <Text
                style={[styles.label, {color: StatusObject(status).fontColor}]}>
                {StatusObject(status).status}
              </Text>
            </View>
          </View>
        </View>
      </View>
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

export default PlotsItem;
