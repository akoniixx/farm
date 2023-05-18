import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo} from 'react';
import mockImage from '../../assets/mockImage';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {font} from '../../assets';
import {numberWithCommas} from '../../function/utility';

interface RewardListType {
  id: string;
  image: any;
  description: string;
  point: number;
  endDate?: string;
}
export default function ListReward({navigation}: {navigation: any}) {
  const mockData: RewardListType[] = [
    {
      id: '1',
      image: mockImage.reward1,
      description: 'เสื้อไอคอนเกษตกร  2 ตัว มูลค่า 1,000 บาท',
      point: 2000,
    },
    {
      id: '3',
      image: mockImage.reward3,
      description: 'ส่วนลด ศูนย์ ICPX มูลค่า 1,500 บาท',
      point: 60000,
      endDate: moment().add(120, 'days').toISOString(),
    },
    {
      id: '2',
      image: mockImage.reward2,
      description: 'บัตรเติมน้ำมัน ปตท 1 ใบ มูลค่า 500 บาท',
      point: 20000,
    },

    {
      id: '4',
      image: mockImage.reward3,
      description: 'ส่วนลด ศูนย์ ICPX มูลค่า 1,000 บาท',
      point: 40000,
      endDate: moment().add(120, 'days').toISOString(),
    },
  ];

  const renderItem = useMemo(() => {
    return ({item}: {item: RewardListType}) => {
      return (
        <TouchableOpacity
          style={[styles.card]}
          onPress={() => {
            navigation.navigate('RewardDetailScreen', {id: item.id});
          }}>
          <ImageBackground
            style={{
              width: '100%',
              height: 190,
            }}
            source={item.image}
            imageStyle={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              resizeMode: 'cover',
            }}
          />
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 8,
            }}>
            <Text
              style={{
                fontFamily: font.medium,
                fontSize: 14,
              }}>
              {item.description}
            </Text>
            <Text
              style={{
                fontFamily: font.medium,
                fontSize: 14,
                paddingVertical: 4,
              }}>
              {numberWithCommas(item.point.toString(), true)}{' '}
              <Text
                style={{
                  fontFamily: font.light,
                  fontSize: 14,
                }}>
                คะแนน
              </Text>
            </Text>
            {item.endDate && (
              <Text
                style={{
                  fontFamily: font.light,
                  fontSize: 14,
                }}>
                อีก {moment(item.endDate).diff(moment(), 'days')} วัน
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    };
  }, [navigation]);
  return (
    <FlatList
      style={{marginTop: 16}}
      data={mockData}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={{justifyContent: 'space-between'}}
      ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
    />
  );
}
const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCDFE3',
    flex: 0.48,
    flexGrow: 1,
    margin: 6,
  },
  itemSeparator: {
    width: 10,
  },
});
