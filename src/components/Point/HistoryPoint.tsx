import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { font } from '../../assets';
import colors from '../../assets/colors/colors';
import { normalize } from '../../functions/Normalize';
import { momentExtend } from '../../utils/moment-buddha-year';
import { formatNumberWithComma } from '../../utils/ formatNumberWithComma';
import Text from '../Text/Text';
interface guruData {
  index: any;
  date: any;
  point: number;
  action: any;
  taskId: any;
  taskNo: any;
}
export const HistoryPoint: React.FC<guruData> = ({
  index,
  date,
  point,
  action,
  taskId,
  taskNo,
}) => {
  return (
    <View key={index}>
      <View
        style={{
          backgroundColor: colors.Surface,
          paddingVertical: 0.5,
          width: '95%',
          alignSelf: 'center',
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}>
        <View>
          <Text style={styles.title}>
            {action === 'INCREASE' && taskId !== null
              ? 'จ้างโดรนเกษตร'
              : action === 'RETURN'
              ? 'คืนแต้ม'
              : 'ส่วนลดฉีดพ่น'}
          </Text>
          <Text style={styles.textDate}>{taskNo}</Text>
        </View>
        {action === 'INCREASE' ? (
          <View
            style={{
              alignItems: 'flex-end',
            }}>
            <Text style={styles.positive}>{`${formatNumberWithComma(
              point,
            )} คะแนน`}</Text>
            <Text style={styles.textDate}>
              {momentExtend.toBuddhistYear(date, `DD MMM YYYY HH:mm น.`)}
            </Text>
          </View>
        ) : action === 'RETURN' ? (
          <View
            style={{
              alignItems: 'flex-end',
            }}>
            <Text style={styles.positive}>{`${formatNumberWithComma(
              point,
            )} คะแนน`}</Text>
            <Text style={styles.textDate}>
              {momentExtend.toBuddhistYear(date, `DD MMM YYYY HH:mm น.`)}
            </Text>
          </View>
        ) : (
          <View
            style={{
              alignItems: 'flex-end',
            }}>
            <Text style={styles.negative}>{`- ${formatNumberWithComma(
              point,
            )} แต้ม`}</Text>
            <Text style={styles.textDate}>
              {momentExtend.toBuddhistYear(date, `DD MMM YYYY HH:mm น.`)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width - normalize(35),
    height: 'auto',
    borderWidth: 1,
    borderColor: '#C0C5CA',
    margin: normalize(5),
    borderRadius: normalize(10),
  },
  title: {
    fontSize: normalize(16),
    fontFamily: font.SarabunMedium,
    fontWeight: '600',
    color: colors.fontGrey,
    lineHeight: 30,
  },
  textDate: {
    fontSize: normalize(14),
    fontFamily: font.SarabunLight,
    color: colors.gray,
    lineHeight: 30,
  },
  positive: {
    fontSize: normalize(18),
    fontFamily: font.SarabunBold,
    color: colors.greenLight,

    lineHeight: 30,
  },
  negative: {
    fontSize: normalize(18),
    fontFamily: font.SarabunBold,
    color: colors.error,
    lineHeight: 30,
  },
});
