import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
import React, {useMemo} from 'react';
import moment from 'moment';
import {colors} from '../../assets';
import mockImage from '../../assets/mockImage';
import fonts from '../../assets/fonts';
import dayjs from 'dayjs';
import {momentExtend} from '../../function/utility';

export default function ReadyToUseTab() {
  const mockData = useMemo(() => {
    const data = [
      {
        id: 1,
        title: 'ส่วนลด ศูนย์ ICPX มูลค่า 1,000 บาท',
        date: moment().toISOString(),
        image: mockImage.reward3,
      },
      {
        id: 2,
        title: 'ส่วนลด ศูนย์ ICPX มูลค่า 1,500 บาท',
        date: moment().subtract(1, 'day').toISOString(),
        image: mockImage.reward3,
      },
      {
        id: 3,
        title: 'ส่วนลด ศูนย์ ICPX มูลค่า 2,000 บาท ',
        date: moment().subtract(2, 'day').toISOString(),
        image: mockImage.reward3,
      },
    ];
    return data;
  }, []);
  return (
    <FlatList
      style={{
        marginTop: 16,
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
      }}
      data={mockData}
      renderItem={({item}) => {
        return (
          <View style={styles.card}>
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
                  fontSize: 14,
                  marginTop: 4,

                  fontFamily: fonts.light,
                }}>
                {`แลกเมื่อ ${momentExtend.toBuddhistYear(
                  item.date,
                  'DD MMM YYYY HH:mm',
                )}`}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    marginRight: 4,
                    backgroundColor: colors.orange,
                  }}
                />
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    fontFamily: fonts.light,
                  }}>
                  พร้อมใช้
                </Text>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.disable,
  },
});
