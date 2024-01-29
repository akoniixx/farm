/* eslint-disable @typescript-eslint/no-shadow */
import {
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { colors, image } from '../../assets';
import fonts from '../../assets/fonts';
import { rewardDatasource } from '../../datasource/RewardDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Image } from 'react-native';
import { RedemptionTransaction } from '../../types/MyRewardType';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import Text from '../../components/Text/Text';
import RenderHTML from 'react-native-render-html';
import { momentExtend } from '../../utils/moment-buddha-year';

const mappingStatusText = {
  REQUEST: 'คำร้องขอแลก',
  PREPARE: 'เตรียมจัดส่ง',
  USED: 'ใช้แล้ว',
  DONE: 'ส่งแล้ว',
  EXPIRED: 'หมดอายุ',
  CANCEL: 'ยกเลิก',
};
const mappingStatusColor = {
  REQUEST: '#EBBB00',
  PREPARE: colors.orange,
  USED: colors.greenLight,
  DONE: colors.greenLight,
  EXPIRED: colors.grey50,
  CANCEL: colors.errorText,
};
// const mappingStatusColorText = {
//   REQUEST: colors.fontBlack,
//   DELIVERING: colors.fontBlack,
//   USED: colors.green,
//   DELIVERED: colors.green,
//   EXPIRED: colors.gray,
//   CANCEL: colors.decreasePoint,
// };
interface HistoryData {
  count: number;
  data: RedemptionTransaction[];
}

export default function HistoryTab({ navigation }: { navigation: any }) {
  const take = 10;

  const [historyData, setHistoryData] = React.useState<HistoryData>({
    count: 0,
    data: [],
  } as HistoryData);

  const [refreshing, setRefreshing] = React.useState(false);
  const getHistoryReward = useCallback(async () => {
    try {
      const farmerId = await AsyncStorage.getItem('farmer_id');
      const result = await rewardDatasource.getHistoryRedeem({
        farmerId: farmerId || '',
        page: 1,
        take,
      });
      setHistoryData(result);
    } catch (error) {
      console.log('error', error);
    }
  }, []);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getHistoryReward();
    setRefreshing(false);
  }, [getHistoryReward]);
  useEffect(() => {
    getHistoryReward();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoadingMore = async () => {
    if (historyData.data.length < historyData.count) {
      try {
        const farmerId = await AsyncStorage.getItem('farmer_id');
        const result = await rewardDatasource.getHistoryRedeem({
          farmerId: farmerId || '',
          page: Math.ceil(historyData.data.length / take) + 1,
          take,
        });
        setHistoryData({
          count: result.count,
          data: [...historyData.data, ...result.data],
        });
      } catch (error) {
        console.log('error', error);
      }
    }
  };
  const onPressItem = (id: string) => {
    navigation.navigate('RedeemDetailPhysicalScreen', { id });
  };
  const EmptyState = () => {
    return (
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
    );
  };
  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{
        paddingHorizontal: 16,
        marginTop: 16,
      }}
      onEndReached={onLoadingMore}
      ListFooterComponent={
        <View
          style={{
            height: 100,
          }}
        />
      }
      keyExtractor={(item, index) => `-${index}`}
      data={historyData.data || []}
      ListEmptyComponent={EmptyState()}
      renderItem={({ item }) => {
        const statusRedeem = item.redeemDetail.redeemStatus;
        const isDigital = item.rewardType === 'DIGITAL';
        return (
          <TouchableOpacity
            onPress={() => {
              isDigital
                ? navigation.navigate('RedeemDetailDigitalReadOnlyScreen', {
                    id: item.farmerTransactionsId,
                  })
                : onPressItem(item.farmerTransactionsId);
            }}
            style={styles({ type: statusRedeem }).card}>
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
                    fontFamily: fonts.AnuphanSemiBold,
                    color: colors.fontBlack,
                  },
                }}
                systemFonts={[fonts.AnuphanSemiBold]}
              />
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 14,
                  fontFamily: fonts.SarabunRegular,
                  color: colors.grey50,
                  lineHeight: 26,
                }}>
                {`แลกเมื่อ ${momentExtend.toBuddhistYear(
                  item.redeemDate,
                  'DD MMM YYYY HH:mm',
                )}`}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                  width: '100%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      marginRight: 6,
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
                      color: colors.grey50,
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
    />
  );
}
const styles = ({ type }: { type: string }) => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.white,
      padding: 16,
      borderRadius: 10,
      marginBottom: 8,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: colors.disable,
    },
  });
};
