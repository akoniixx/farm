import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import moment from 'moment';
import {colors, font} from '../../assets';

const mockObj = {
  0: 'แลกบัตรเติมน้ำมัน',
  1: 'ภารกิจทำโปรไฟล์ครบสมบูรณ์',
  2: 'ภารกิจบินครบ 1,000 ไร่',
  3: 'ภารกิจบินครบ 2,000 ไร่',
  4: 'รับงานบินโดรนเกษตร',
  5: 'รับงานบินโดรนเกษตร',
};
export default function UsedOrReceiveTab() {
  const mockData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 6; i++) {
      data.push({
        type: i % 2 === 0 ? 'used' : 'receive',
        point: Math.floor(Math.round(Math.random() * 1000) / 10) * 10,
        title: mockObj[i as keyof typeof mockObj],
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
          <View style={styles.containerList}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.fontBlack,
              }}>
              {item.title}
            </Text>
            <View
              style={{
                alignItems: 'flex-end',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.bold,
                  color:
                    item.type === 'used' ? colors.decreasePoint : colors.green,
                }}>
                {item.type === 'used' && '-'}
                {item.point}
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
          </View>
        );
      }}
    />
  );
}
const styles = StyleSheet.create({
  containerList: {
    width: '100%',
    borderBottomColor: colors.greys5,
    flexDirection: 'row',
    justifyContent: 'space-between',

    borderBottomWidth: 1,
    paddingVertical: 12,
  },
});
