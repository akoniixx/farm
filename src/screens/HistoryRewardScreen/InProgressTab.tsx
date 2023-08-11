import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import moment from 'moment';
import {colors, font} from '../../assets';

interface InProgressType {
  id: number;
  title: string;
  description: string;
  date: string;
}
export default function InProgressTab() {
  const mockData = useMemo(() => {
    const data: InProgressType[] = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        id: 123456789 + i,
        title: `รับงานบินโดรนเกษตร ${i + 1}`,
        description: 'ระบบกำลังคำนวณคะแนนที่จะได้รับ',
        date: moment().subtract(i, 'days').subtract(i, 'hours').toISOString(),
      });
    }
    return data;
  }, []);
  return (
    <FlatList
      data={mockData}
      contentContainerStyle={{paddingBottom: 60, paddingHorizontal: 16}}
      renderItem={({item}) => {
        return (
          <View style={styles.listInprogress}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.grey2,
              }}>
              {item.title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: font.medium,
                  color: colors.grey2,
                }}>
                #{item.id}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: font.medium,
                  color: colors.grey2,
                }}>
                {moment(item.date).format('DD/MM/YYYY HH:mm')}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: font.light,
                color: colors.grey2,
              }}>
              {item.description}
            </Text>
          </View>
        );
      }}
    />
  );
}
const styles = StyleSheet.create({
  listInprogress: {
    width: '100%',
    borderBottomColor: colors.greys5,

    borderBottomWidth: 1,
    paddingVertical: 12,
  },
});
