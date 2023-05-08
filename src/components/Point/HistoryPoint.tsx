import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { font, image } from '../../assets';
import colors from '../../assets/colors/colors';
import { normalize } from '../../functions/Normalize';
import { momentExtend } from '../../utils/moment-buddha-year';
interface guruData {
  index: any;
  date: any;
  title: any;
  point: number;
}
export const HistoryPoint: React.FC<guruData> = ({
  index,
  date,
  title,
  point,
}) => {
  return (
    <View key={index}>
      <View
        style={{
          backgroundColor: colors.Surface,
          paddingVertical: 5,
          padding: 15,
        }}>
        <View>
          <Text style={styles.textDate}>
            {' '}
            {momentExtend.toBuddhistYear(new Date(), 'DD MMM YY')}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.textDate}>
            {' '}
            {momentExtend.toBuddhistYear(new Date(), 'HH:mm น.')}
          </Text>
        </View>
        {point > 0 ? (
          <View>
            <Text style={styles.positive}>{`${point} คะแนน`}</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.negative}>{`${point} คะแนน`}</Text>
          </View>
        )}
      </View>
      <View
        style={{
          backgroundColor: '#EBEEF0',
          height: 1,
          top: 15,
        }}
      />
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
    fontFamily: font.SarabunBold,
    color: colors.gray,
    lineHeight: 30,
  },
  textTime: {
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
