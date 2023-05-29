import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {font, image} from '../../assets';
import colors from '../../assets/colors/colors';
import {momentExtend, numberWithCommas} from '../../function/utility';
import {normalize} from '../../function/Normalize';

interface guruData {
  index: any;
  date: any;
  point: string;
  action: any;
  taskId: any;
  taskNo: any;
  campaignName:string
}
export const HistoryPoint: React.FC<guruData> = ({
  index,
  date,
  point,
  action,
  taskId,
  taskNo,
  campaignName
}) => {
  return (
    <View key={index}>
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
              ? campaignName
              : campaignName}
          </Text>
          <Text style={styles.textDate}>{taskNo? '#':'' }{taskNo}</Text>
        </View>
        {action === 'INCREASE' ? (
          <View>
            <Text style={styles.positive}>{`+ ${numberWithCommas(
              point,
            )} `}</Text>
            <Text style={styles.textDate}>
              {momentExtend.toBuddhistYear(date, `DD MMM YY HH:mm น.`)}
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.negative}>{`- ${numberWithCommas(
              point,
            )} `}</Text>
            <Text style={styles.textDate}>
              {momentExtend.toBuddhistYear(date, `DD MMM YY HH:mm น.`)}
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          backgroundColor: colors.Surface,
          paddingVertical: 0.5,
          width: '95%',
          alignSelf: 'center',
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
    fontFamily: font.medium,
    fontWeight: '600',
    color: colors.fontGrey,
    lineHeight: 30,
  },
  textDate: {
    fontSize: normalize(14),
    fontFamily: font.light,
    color: colors.gray,
    lineHeight: 30,
  },
  positive: {
    fontSize: normalize(18),
    fontFamily: font.bold,
    color: colors.green,
    lineHeight: 30,
  },
  negative: {
    fontSize: normalize(18),
    fontFamily: font.bold,
    color: colors.redPrice,
    lineHeight: 30,
  },
});
