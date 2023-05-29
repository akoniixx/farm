import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import HTML from 'react-native-render-html';
import React, {useEffect, useMemo, useState} from 'react';
import mockImage from '../../assets/mockImage';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {font} from '../../assets';
import {numberWithCommas} from '../../function/utility';
import {rewardDatasource} from '../../datasource/RewardDatasource';

export interface RewardListType {
  id: string;
  rewardName: string;
  imagePath: string;
  rewardType: string;
  rewardExchange: string;
  rewardNo: string;
  score: string | null;
  amount: number;
  used: number;
  remain: number;
  description: string;
  condition: string;
  startExchangeDate: string;
  expiredExchangeDate: string;
  startUsedDate: string | null;
  expiredUsedDate: string | null;
  startExchangeDateCronJob: string | null;
  expiredExchangeDateCronJob: string;
  startUsedDateCronJob: string | null;
  expiredUsedDateCronJob: string | null;
  digitalCode: string | null;
  status: string;
  statusUsed: string | null;
  createAt: string;
  updateAt: string;
}
export default function ListReward({
  navigation,
  setLoading,
}: {
  navigation: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [listReward, setListReward] = useState<{
    count: number;
    data: RewardListType[];
  }>({
    count: 0,
    data: [],
  });
  const take = 10;
  useEffect(() => {
    const getFirstListReward = async () => {
      try {
        setLoading(true);
        const result = await rewardDatasource.getListRewards({
          page: 1,
          take,
        });
        setListReward(result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getFirstListReward();
  }, []);
  console.log(JSON.stringify(listReward, null, 2));
  const loadMore = async () => {
    if (listReward.data.length >= listReward.count) {
      return;
    } else {
      try {
        setLoading(true);
        const result = await rewardDatasource.getListRewards({
          page: Math.ceil(listReward.data.length / take) + 1,
          take,
        });
        setListReward({
          count: result.count,
          data: [...listReward.data, ...result.data],
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const renderItem = useMemo(() => {
    return ({item}: {item: RewardListType}) => {
      return (
        <TouchableOpacity
          style={[styles.card]}
          onPress={() => {
            navigation.navigate('RewardDetailScreen', {
              id: item.id,
              isDigital: item.rewardType === 'DIGITAL',
            });
          }}>
          <FastImage
            style={{
              width: '100%',
              height: 190,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
            source={{uri: item.imagePath}}
          />
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 8,
            }}>
            <HTML
              source={{html: item.rewardName}}
              contentWidth={Dimensions.get('window').width / 2}
              tagsStyles={{
                p: {
                  fontFamily: font.medium,
                  fontSize: 14,
                },
              }}
            />
            <Text
              style={{
                fontFamily: font.medium,
                fontSize: 14,
                paddingVertical: 4,
              }}>
              {numberWithCommas((item.score || 0).toString(), true)}{' '}
              <Text
                style={{
                  fontFamily: font.light,
                  fontSize: 14,
                }}>
                แต้ม
              </Text>
            </Text>
            {item.expiredUsedDate && (
              <Text
                style={{
                  fontFamily: font.light,
                  fontSize: 14,
                }}>
                หมดอายุอีก {moment(item.expiredUsedDate).diff(moment(), 'days')}{' '}
                วัน
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
      data={listReward.data}
      renderItem={renderItem}
      numColumns={2}
      onEndReached={loadMore}
      ListFooterComponent={
        <View
          style={{
            height: 180,
          }}
        />
      }
      columnWrapperStyle={{
        justifyContent: 'space-between',
        paddingHorizontal: 16,
      }}
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
