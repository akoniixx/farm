import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Platform,
} from 'react-native';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { colors, font } from '../../assets';
import { mixpanel } from '../../../mixpanel';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import { rewardDatasource } from '../../datasource/RewardDatasource';
import RenderHTML from 'react-native-render-html';
import Text from '../../components/Text/Text';
import { numberWithCommas } from '../../functions/utility';
import EmptyReward from './EmptyReward';
import { RewardListType } from '../../types/RewardType';

export default function ListReward({ navigation }: { navigation: any }) {
  const [listReward, setListReward] = useState<{
    count: number;
    data: RewardListType[];
  }>({
    count: 0,
    data: [],
  });
  const take = 10;
  const widthImg = Dimensions.get('window').width / 2 - 32;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const getFirstListReward = useCallback(async () => {
    try {
      setLoading(true);
      const result = await rewardDatasource.getRewardList({
        page: 1,
        take,
        application: 'FARMER',
      });
      setListReward(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, take]);
  useEffect(() => {
    getFirstListReward();
  }, [getFirstListReward]);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getFirstListReward().finally(() => setRefreshing(false));
  }, [getFirstListReward]);

  const loadMore = async () => {
    if (listReward.data.length >= listReward.count) {
      return;
    } else {
      try {
        setLoading(true);
        const result = await rewardDatasource.getRewardList({
          page: Math.ceil(listReward.data.length / take) + 1,
          take,
          application: 'FARMER',
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
    return ({ item }: { item: RewardListType; index: number }) => {
      const dateDiff = moment(item.expiredUsedDate).fromNow();
      const isExpired =
        item.expiredUsedDate && moment(item.expiredUsedDate).isAfter(moment());
      return (
        <>
          <TouchableOpacity
            style={[styles.card]}
            onPress={() => {
              mixpanel.track('RewardScreen_RewardCard_Press', {
                ...item,
                rewardId: item.id,
              });
              navigation.navigate('RewardDetailScreen', {
                id: item.id,
                isDigital: item.rewardType === 'DIGITAL',
              });
            }}>
            <ProgressiveImage
              style={{
                width: widthImg,
                height: widthImg,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              }}
              source={{ uri: item.imagePath }}
            />
            <View
              style={{
                paddingTop: 10,
                paddingHorizontal: 8,
                justifyContent: 'space-between',
                height: Platform.OS === 'ios' ? 90 : 100,
              }}>
              <RenderHTML
                source={{ html: item.rewardName }}
                contentWidth={Dimensions.get('window').width / 2}
                defaultTextProps={{
                  numberOfLines: 2,
                  style: {
                    fontFamily: font.AnuphanSemiBold,
                    fontSize: 18,
                    color: colors.fontBlack,
                  },
                }}
                tagsStyles={{
                  body: {
                    fontFamily: font.AnuphanSemiBold,
                    fontSize: 16,
                    color: colors.fontBlack,
                  },
                }}
                systemFonts={[font.AnuphanSemiBold]}
              />
              <Text
                style={{
                  fontFamily: font.SarabunSemiBold,
                  fontSize: 16,
                  paddingVertical: 4,
                  marginTop: Platform.OS === 'ios' ? 4 : 0,
                  color: colors.fontBlack,
                }}>
                {numberWithCommas((item.score || 0).toString(), true)}{' '}
                <Text
                  style={{
                    fontFamily: font.SarabunRegular,
                    fontSize: 14,
                    color: colors.fontBlack,
                  }}>
                  แต้ม
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        </>
      );
    };
  }, [navigation, widthImg]);
  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{ marginTop: 16 }}
      data={listReward?.data || []}
      renderItem={renderItem}
      numColumns={2}
      onEndReached={loadMore}
      ListEmptyComponent={<EmptyReward />}
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
    flexGrow: 1,
    margin: 6,
    flex: 0.48,
    maxWidth: Dimensions.get('window').width / 2 - 32,
  },
  itemSeparator: {
    width: 10,
  },
});
