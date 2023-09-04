import moment from 'moment';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors, font, icons } from '../../assets';
import { normalize } from '../../functions/Normalize';
import Text from '../Text/Text';

interface DateTimeProp {
  date: string;
  time: string;
  note: string;
}
export const MyTaskDateTimeDetail: React.FC<DateTimeProp> = ({
  date,
  time,
  note,
}) => {
  return (
    <>
      <View>
        <View
          style={{
            padding: normalize(10),
            backgroundColor: '#FFF2E3',
            borderRadius: 10,
            marginTop: normalize(10),
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Image
                source={icons.calendarOrange}
                style={{
                  width: normalize(18),
                  height: normalize(20),
                  marginRight: normalize(10),
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={styles.h2}>วันที่</Text>
                <Text style={styles.h2}>เวลา</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.h1}>
                  {moment(date)
                    .add(543, 'year')
                    .locale('th')
                    .format('DD MMMM YYYY')}
                </Text>
                <Text style={styles.h1}>
                  {' '}
                  {moment(time).locale('th').format('HH.mm')} น
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          paddingTop: 10,
          alignItems: 'center',
          borderTopColor: colors.greyDivider,
          borderTopWidth: 1,
          height: 40,
          paddingHorizontal: 16,
        }}>
        <Image
          source={icons.document}
          style={{
            width: normalize(24),
            height: normalize(24),
            marginRight: normalize(10),
          }}
        />
        <Text>{note ? note : '-'}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    lineHeight: normalize(30),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    lineHeight: normalize(30),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(19),
  },
});
