import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  LogBox,
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { colors, image } from '../../assets';
import fonts from '../../assets/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { rewardDatasource } from '../../datasource/RewardDatasource';
import { RedemptionTransaction } from '../../types/MyRewardType';

import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import Text from '../../components/Text/Text';
import { momentExtend } from '../../utils/moment-buddha-year';
import RenderHTML from 'react-native-render-html';
const mappingStatusText = {
  REQUEST: 'พร้อมใช้',
  PREPARE: 'เตรียมจัดส่ง',
  USED: 'ใช้แล้ว',
  DONE: 'ส่งแล้ว',
  EXPIRED: 'หมดอายุ',
  CANCEL: 'ยกเลิก',
};
const mappingStatusColor = {
  REQUEST: colors.orange,
  PREPARE: colors.orange,
  USED: colors.greenLight,
  DONE: colors.greenLight,
  EXPIRED: colors.gray,
  CANCEL: colors.errorText,
};
export default function InDelivery({ navigation }: { navigation: any }) {
  const take = 10;
  const [total, setTotal] = React.useState<number>(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = React.useState<RedemptionTransaction[]>([]);
  const getHistoryRewardReadyToUse = useCallback(async () => {
    try {
      const dronerId = await AsyncStorage.getItem('droner_id');
      const result = await rewardDatasource.getReadyToUseReward({
        dronerId: dronerId || '',
        page: 1,
        take,
      });
      setTotal(result.count);
      setData(result.data);
    } catch (error) {
      console.log('error', error);
    }
  }, []);

  useEffect(() => {
    getHistoryRewardReadyToUse();
    LogBox.ignoreLogs([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNavigation = async (item: RedemptionTransaction) => {
    try {
      const result = await rewardDatasource.getRedeemDetail(
        item.dronerTransactionsId,
      );
      navigation.navigate('RedeemScreen', {
        imagePath: item.imagePath,
        data: {
          dronerTransaction: {
            ...result,
          },
        },
        expiredUsedDate: result.reward.expiredUsedDate,
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getHistoryRewardReadyToUse();
    setRefreshing(false);
  }, [getHistoryRewardReadyToUse]);
  const onLoadMore = useCallback(async () => {
    if (data?.length < total) {
      try {
        const dronerId = await AsyncStorage.getItem('droner_id');
        const result = await rewardDatasource.getReadyToUseReward({
          dronerId: dronerId || '',
          page: Math.ceil(data.length / take) + 1,
          take,
        });
        setData(prev => [...prev, ...result.data]);
      } catch (error) {
        console.log('error', error);
      }
    }
  }, [total, data?.length]);
  return (
    <FlatList
      onEndReached={onLoadMore}
      style={{
        marginTop: 16,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{
        paddingHorizontal: 16,
      }}
      data={data}
      renderItem={({ item }) => {
        const statusRedeem = item.redeemDetail.redeemStatus;

        return (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onNavigation(item)}>
            <ProgressiveImage
              source={{
                uri: item.imagePath,
              }}
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
              <RenderHTML
                source={{ html: item.rewardName }}
                contentWidth={500}
                tagsStyles={{
                  body: {
                    fontSize: 16,
                    fontFamily: fonts.AnuphanMedium,
                  },
                }}
              />
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 14,
                  fontFamily: fonts.SarabunRegular,
                }}>
                {`แลกเมื่อ ${momentExtend.toBuddhistYear(
                  item.redeemDate,
                  'DD MMM YYYY HH:mm',
                )}`}
              </Text>
              <View
                style={{
                  marginTop: 4,

                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                }}>
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
                      backgroundColor:
                        mappingStatusColor[
                          statusRedeem as keyof typeof mappingStatusColor
                        ],
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.SarabunRegular,
                      color: colors.gray,
                    }}>
                    {
                      mappingStatusText[
                        statusRedeem as keyof typeof mappingStatusText
                      ]
                    }
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
      ListFooterComponent={
        <View
          style={{
            height: 60,
          }}
        />
      }
      ListEmptyComponent={
        <View
          style={{
            height: Dimensions.get('window').height - 300,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={image.emptyReward}
            style={{
              width: 155,
              height: 130,
              marginBottom: 16,
            }}
          />
          <Text
            style={{
              fontFamily: fonts.AnuphanRegular,
              fontSize: 16,
              color: colors.gray,
            }}>
            ไม่มีรีวอร์ด
          </Text>
        </View>
      }
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
