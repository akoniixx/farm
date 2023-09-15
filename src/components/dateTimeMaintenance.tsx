import { StyleSheet, View } from 'react-native';
import React from 'react';
import fonts from '../assets/fonts';
import { normalize } from '../functions/Normalize';
import { colors } from '../assets';
import { momentExtend } from '../utils/moment-buddha-year';
import moment, { Moment } from 'moment';
import Text from './Text/Text';

interface MaintenanceProps {
  header: string;
  dateStart: Moment;
  dateEnd: Moment;
  text: string;
  footer: string;
}
export const DateTimeMaintenance: React.FC<MaintenanceProps> = ({
  header,
  dateStart,
  dateEnd,
  text,
}) => {
  const start = momentExtend.toBuddhistYear(dateStart, 'DD MMMM YYYY');
  const end = momentExtend.toBuddhistYear(dateEnd, 'DD MMMM YYYY');
  return (
    <>
      {start !== end ? (
        <View
          style={{
            paddingHorizontal: 16,
            justifyContent: 'space-between',
          }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.fontTitle}>{header}</Text>
            </View>
            <View
              style={{
                marginTop: 20,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                }}>
                {`วันที่ `}
                <Text
                  style={{
                    color: '#FB8705',
                  }}>
                  {momentExtend.toBuddhistYear(dateStart, ' DD MMMM YYYY')}
                </Text>
              </Text>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                  marginBottom: 2,
                }}>
                {'ช่วงเวลา '}
                {moment(dateStart)
                  .add(543, 'year')
                  .locale('th')
                  .format('HH.mm')}
                {' - 23:59 น.'}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                }}>
                {`ถึงวันที่ `}
                <Text
                  style={{
                    color: '#FB8705',
                  }}>
                  {momentExtend.toBuddhistYear(dateEnd, ' DD MMMM YYYY')}
                </Text>
              </Text>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                  marginBottom: 2,
                }}>
                {`ช่วงเวลา 00:00 - `}

                {moment(dateEnd)
                  .add(543, 'year')
                  .locale('th')
                  .format('HH.mm น.')}
              </Text>
              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    fontFamily: fonts.SarabunLight,
                    fontSize: normalize(18),
                    color: colors.fontBlack,
                    marginBottom: 2,
                    lineHeight: 30,
                    paddingHorizontal: 30,
                  }}>
                  {text}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            paddingHorizontal: 16,
            justifyContent: 'space-between',
          }}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.fontTitle}>{header}</Text>
            </View>
            <View
              style={{
                // paddingHorizontal: 30,
                marginTop: 20,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                }}>
                {`วันที่ `}
                <Text
                  style={{
                    color: '#FB8705',
                    fontSize: normalize(24),
                  }}>
                  {momentExtend.toBuddhistYear(dateStart, ' DD MMMM YYYY')}
                </Text>
              </Text>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                  marginBottom: 2,
                }}>
                {'ช่วงเวลา '}
                {moment(dateStart)
                  .add(543, 'year')
                  .locale('th')
                  .format('HH.mm')}
                {' - '}
                {moment(dateEnd).add(543, 'year').locale('th').format('HH.mm')}
                {' น.'}
              </Text>
              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    fontFamily: fonts.SarabunLight,
                    fontSize: normalize(18),
                    color: colors.fontBlack,
                    marginBottom: 2,
                    lineHeight: 30,
                    paddingHorizontal: 30,
                  }}>
                  {text}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
};
export default DateTimeMaintenance;
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
