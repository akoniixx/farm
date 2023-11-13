import React, { useMemo } from 'react';
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
  campaign?: {
    campaignName: string;
  };
  isSpecialPointFarmer?: boolean;
}

const objAction = {
  RETURN: 'ได้รับแต้มคืน',
};
export const HistoryPoint: React.FC<guruData> = ({
  index,
  date,
  point,
  action,
  taskId,
  taskNo,
  campaign,
  isSpecialPointFarmer = false,
}) => {
  const { title } = useMemo(() => {
    let title = '';
    if (action === 'INCREASE' && taskId !== null && !isSpecialPointFarmer) {
      title = 'จ้างโดรนเกษตร';
    } else if (action === 'RETURN') {
      title = objAction[action as keyof typeof objAction];
    } else if (action === 'INCREASE' && isSpecialPointFarmer && campaign) {
      title = campaign?.campaignName || '';
    } else if (action === 'RETURN_REVERT' && isSpecialPointFarmer) {
      title = `แต้มถูกยกเลิก จาก${campaign?.campaignName || ''}`;
    } else if (action === 'RETURN_REVERT' && !isSpecialPointFarmer) {
      title = 'แต้มถูกยกเลิก จากจ้างโดรนเกษตร';
    } else {
      title = 'ส่วนลดฉีดพ่น';
    }
    return {
      title,
    };
  }, [action, taskId, isSpecialPointFarmer, campaign]);
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
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}>
        <View style={{ flex: 0.6 }}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.textDate}>{taskNo || ''}</Text>
        </View>
        <View style={{ flex: 0.4 }}>
          {action === 'INCREASE' ? (
            <View
              style={{
                alignItems: 'flex-end',
              }}>
              <Text style={styles.positive}>{`${formatNumberWithComma(
                point,
              )} แต้ม`}</Text>
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
              )} แต้ม`}</Text>
              <Text style={styles.textDate}>
                {momentExtend.toBuddhistYear(date, `DD MMM YYYY HH:mm น.`)}
              </Text>
            </View>
          ) : (
            <View
              style={{
                alignItems: 'flex-end',
              }}>
              <Text style={styles.negative}>{`-${formatNumberWithComma(
                point,
              )} แต้ม`}</Text>
              <Text style={styles.textDate}>
                {momentExtend.toBuddhistYear(date, `DD MMM YYYY HH:mm น.`)}
              </Text>
            </View>
          )}
        </View>
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
    fontFamily: font.SarabunSemiBold,
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
