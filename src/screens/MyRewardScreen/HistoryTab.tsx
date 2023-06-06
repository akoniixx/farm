/* eslint-disable @typescript-eslint/no-shadow */
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {colors, image} from '../../assets';
import fonts from '../../assets/fonts';
import {momentExtend} from '../../function/utility';
import {useFocusEffect} from '@react-navigation/native';
import {rewardDatasource} from '../../datasource/RewardDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import RenderHTML from '../../components/RenderHTML/RenderHTML';
import {Image} from 'react-native';

const mappingStatusText = {
  REQUEST: 'คำร้องขอแลก',
  PREPARE: 'เตรียมจัดส่ง',
  USED: 'ใช้แล้ว',
  DONE: 'ส่งแล้ว',
  EXPIRE: 'หมดอายุ',
  CANCEL: 'ยกเลิก',
};
const mappingStatusColor = {
  REQUEST: colors.orange,
  PREPARE: colors.orange,
  USED: colors.green,
  DONE: colors.green,
  EXPIRE: colors.gray,
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
interface RedemptionTransaction {
  dronerTransactionsId: string;
  redeemDetail: RedeemDetail;
  rewardId: string;
  rewardName: string;
  imagePath: string;
  rewardType: string;
  rewardExchange: string;
  dronerRedeemHistoriesId: string;
  redeemDate: string;
}

interface RedeemDetail {
  remark: string;
  rewardType: string;
  trackingNo: string;
  redeemStatus: string;
  deliveryCompany: string;
}

export default function HistoryTab({navigation}: {navigation: any}) {
  const take = 10;
  const [prepareData, setPrepareData] = React.useState<RedemptionTransaction[]>(
    [],
  );
  const [doneData, setDoneData] = React.useState<RedemptionTransaction[]>([]);
  const [total, setTotal] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const getHistoryReward = useCallback(async () => {
    try {
      const dronerId = await AsyncStorage.getItem('droner_id');
      const result = await rewardDatasource.getHistoryRedeem({
        dronerId: dronerId || '',
        page: 1,
        take,
      });
      setTotal(result.count);
      const curPrepareData: RedemptionTransaction[] = [];
      const curDoneData: RedemptionTransaction[] = [];
      (result.data || []).forEach((el: RedemptionTransaction) => {
        const isStatusDone = el.redeemDetail.redeemStatus === 'DONE';
        if (isStatusDone) {
          curDoneData.push(el);
        } else {
          curPrepareData.push(el);
        }
      });
      setPrepareData(curPrepareData);
      setDoneData(curDoneData);
    } catch (error) {
      console.log('error', error);
    }
  }, []);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getHistoryReward();
    setRefreshing(false);
  }, [getHistoryReward]);
  useFocusEffect(
    React.useCallback(() => {
      getHistoryReward();
    }, [getHistoryReward]),
  );

  const historyData = useMemo(() => {
    const sectionData = [];

    if (prepareData.length > 0) {
      sectionData.push({
        title: 'กำลังดำเนินการ',
        data: prepareData,
        sectionName: 'progress',
      });
    }
    if (doneData.length > 0) {
      sectionData.push({
        title: 'เสร็จสิ้น',
        data: doneData,
        sectionName: 'complete',
      });
    }
    return sectionData;
  }, [prepareData, doneData]);
  const onLoadingMore = async () => {
    if (doneData.length + prepareData.length < total) {
      const dronerId = await AsyncStorage.getItem('droner_id');
      const result = await rewardDatasource.getHistoryRedeem({
        dronerId: dronerId || '',
        page: Math.ceil((doneData.length + prepareData.length) / take) + 1,
        take,
      });
      const curPrepareData: RedemptionTransaction[] = [];
      const curDoneData: RedemptionTransaction[] = [];
      (result.data || []).forEach((el: RedemptionTransaction) => {
        const isStatusDone = el.redeemDetail.redeemStatus === 'DONE';
        if (isStatusDone) {
          curDoneData.push(el);
        } else {
          curPrepareData.push(el);
        }
      });
      setPrepareData([...prepareData, ...curPrepareData]);
      setDoneData([...doneData, ...curDoneData]);
    } else {
      console.log('end');
    }
  };
  const onPressItem = (id: string) => {
    navigation.navigate('RedeemDetailScreen', {id});
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
            fontFamily: fonts.light,
            fontSize: 16,
            color: colors.gray,
          }}>
          ไม่มีรีวอร์ด
        </Text>
      </View>
    );
  };
  return (
    <SectionList
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
      stickySectionHeadersEnabled={false}
      keyExtractor={(item, index) => `-${index}`}
      sections={historyData || []}
      renderSectionHeader={({section: {title, data}}) => {
        if (data.length < 1) {
          return EmptyState();
        }

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
        const statusRedeem = item.redeemDetail.redeemStatus;
        const isMission = item.rewardExchange !== 'SCORE';
        return (
          <TouchableOpacity
            onPress={() => {
              onPressItem(item.dronerTransactionsId);
            }}
            style={styles({type: section.sectionName}).card}>
            <FastImage
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
                source={{html: item.rewardName}}
                contentWidth={500}
                tagsStyles={{
                  body: {
                    fontSize: 16,
                    fontFamily: fonts.medium,
                  },
                }}
              />
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 14,
                  fontFamily: fonts.light,
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
                      fontFamily: fonts.light,
                      color: colors.gray,
                    }}>
                    {
                      mappingStatusText[
                        statusRedeem as keyof typeof mappingStatusText
                      ]
                    }
                  </Text>
                </View>
                {isMission && (
                  <View
                    style={{
                      borderRadius: 10,
                      backgroundColor: '#FBCC96',
                      paddingVertical: 2,
                      paddingHorizontal: 8,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: fonts.semiBold,
                        color: '#993A03',
                      }}>
                      ภารกิจ
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
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
