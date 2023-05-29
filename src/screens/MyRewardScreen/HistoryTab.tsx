/* eslint-disable @typescript-eslint/no-shadow */
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  SectionList,
} from 'react-native';
import React, {useMemo} from 'react';
import moment from 'moment';
import mockImage from '../../assets/mockImage';
import {colors} from '../../assets';
import fonts from '../../assets/fonts';
import {momentExtend} from '../../function/utility';

const mappingStatusText = {
  REQUEST: 'คำร้องขอแลก',
  DELIVERING: 'เตรียมจัดส่ง',
  USED: 'ใช้แล้ว',
  DELIVERED: 'ส่งแล้ว',
  EXPIRED: 'หมดอายุ',
  CANCEL: 'ยกเลิก',
};
const mappingStatusColor = {
  REQUEST: colors.orange,
  DELIVERING: colors.orange,
  USED: colors.green,
  DELIVERED: colors.green,
  EXPIRED: colors.gray,
  CANCEL: colors.decreasePoint,
};
// const mappingStatusColorText = {
//   REQUEST: colors.fontBlack,
//   DELIVERING: colors.fontBlack,
//   USED: colors.green,
//   DELIVERED: colors.green,
//   EXPIRED: colors.gray,
//   CANCEL: colors.decreasePoint,
// };
export default function HistoryTab() {
  const mockData = useMemo(() => {
    const progressData = [
      {
        id: 1,
        title: 'ส่วนลด ศูนย์ ICPX มูลค่า 1,000 บาท',
        date: moment().toISOString(),
        image: mockImage.reward1,
        status: 'REQUEST',
      },

      {
        id: 3,
        title: 'ส่วนลด ศูนย์ ICPX มูลค่า 2,000 บาท ',
        date: moment().subtract(2, 'day').toISOString(),
        image: mockImage.reward2,
        status: 'DELIVERING',
      },
    ];

    const completeData = [
      {
        id: 1,
        title: 'ส่วนลด ศูนย์ ICPX มูลค่า 1,000 บาท',
        date: moment().toISOString(),
        image: mockImage.reward3,
        status: 'USED',
      },
      {
        id: 2,
        title: 'ส่วนลด ศูนย์ ICPX มูลค่า 1,500 บาท',
        date: moment().subtract(1, 'day').toISOString(),
        image: mockImage.reward3,
        status: 'EXPIRED',
      },
      {
        id: 3,
        title: 'ส่วนลด ศูนย์ ICPX มูลค่า 2,000 บาท ',
        date: moment().subtract(2, 'day').toISOString(),
        image: mockImage.reward3,
        status: 'DELIVERED',
      },
    ];
    return [
      {
        title: 'กำลังดำเนินการ',
        data: progressData,
        sectionName: 'progress',
      },
      {
        title: 'เสร็จสิ้น',
        data: completeData,
        sectionName: 'complete',
      },
    ];
  }, []);
  return (
    <SectionList
      contentContainerStyle={{
        paddingHorizontal: 16,
        marginTop: 16,
      }}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      sections={mockData}
      renderSectionHeader={({section: {title}}) => {
        return (
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.medium,
              color: colors.gray,
              marginBottom: 8,
            }}>
            {title}
          </Text>
        );
      }}
      renderItem={({item, section}) => {
        return (
          <View style={styles({type: section.sectionName}).card}>
            <Image
              source={item.image}
              style={{
                borderRadius: 10,
                width: 76,
                height: 76,
                marginRight: 16,
              }}
            />
            <View
              style={{
                width: '75%',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.medium,
                }}>
                {item.title}
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 14,
                  fontFamily: fonts.light,
                }}>
                {`แลกเมื่อ ${momentExtend.toBuddhistYear(
                  item.date,
                  'DD MMM YYYY HH:mm',
                )}`}
              </Text>
              <View
                style={{
                  marginTop: 4,

                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    marginRight: 4,
                    backgroundColor:
                      mappingStatusColor[
                        item.status as keyof typeof mappingStatusColor
                      ],
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: fonts.light,
                    color: colors.gray,
                  }}>
                  {
                    mappingStatusText[
                      item.status as keyof typeof mappingStatusText
                    ]
                  }
                </Text>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
}
const styles = ({type}: {type: string}) =>
  StyleSheet.create({
    card: {
      backgroundColor: type === 'progress' ? colors.lightOrange : colors.white,
      padding: 16,
      borderRadius: 10,
      marginBottom: 16,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: type === 'progress' ? colors.darkOrange : colors.disable,
    },
  });
