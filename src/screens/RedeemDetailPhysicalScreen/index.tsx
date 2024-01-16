import { SafeAreaView, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { rewardDatasource } from '../../datasource/RewardDatasource';
import { colors } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Content from './Content';
import { MainStackParamList } from '../../navigations/MainNavigator';

interface Props {
  navigation: any;
  route: RouteProp<MainStackParamList, 'RedeemDetailPhysicalScreen'>;
}

export interface RedeemDetail {
  id: string;
  farmerId: string;
  campaignId: string | null;
  campaignName: string | null;
  allValue: number;
  amountValue: number;
  beforeValue: number;
  balance: number;
  beforeRai: number;
  afterRai: number;
  raiAmount: number;
  rewardId: string;
  rewardName: string;
  rewardQuantity: number;
  redeemNo: string;
  receiverDetail: {
    tel: string;
    address: string;
    lastname: string;
    firstname: string;
  };
  createAt: string;
  updateAt: string;
  redeemDetail: {
    rewardType: string;
    redeemStatus: string;
    deliveryCompany: string | null;
    trackingNo: string | null;
    remark: string | null;
    missionName?: string | null;
    rewardQuantity: number;
  };
  farmerRedeemHistories: {
    id: string;
    dronerTransactionId: string;
    status: string;
    beforeStatus: string | null;
    deliveryCompany: string | null;
    trackingNo: string | null;
    remark: string | null;
    createAt: string;
    updateAt: string;
    updateBy: string;
  }[];
  campaign: string | null;
  reward: {
    id: string;
    rewardName: string;
    imagePath: string;
    rewardType: string;
    rewardExchange: string;
    rewardNo: string;
    score: number;
    amount: number;
    used: number;
    remain: string;
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
    createBy: string | null;
    createAt: string;
    updateAt: string;
  };
  mission: string | null;
  dronerDetail: {
    dronerId: string;
    firstname: string;
    lastname: string;
    telephoneNo: string;
    address: {
      id: string;
      address1: string;
      address2: string;
      address3: string;
      provinceId: number;
      districtId: number;
      subdistrictId: number;
      postcode: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export default function RedeemDetailPhysicalScreen({
  navigation,
  route,
}: Props) {
  const { id, tab } = route.params;
  const [loading, setLoading] = useState(true);
  const [redeemDetail, setRedeemDetail] = useState<RedeemDetail>(
    {} as RedeemDetail,
  );
  console.log('redeemDetail', JSON.stringify(redeemDetail, null, 2));

  useEffect(() => {
    const getRedeemDetail = async () => {
      try {
        setLoading(true);
        const result = await rewardDatasource.getRedeemDetail(id);
        setRedeemDetail(result);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      getRedeemDetail();
    }
  }, [id]);
  const onPressBack = () => {
    const currentTab = tab
      ? tab
      : redeemDetail.redeemDetail.rewardType === 'PHYSICAL' &&
        redeemDetail.redeemDetail.redeemStatus === 'REQUEST'
      ? 'delivery'
      : 'history';
    navigation.navigate('MyRewardScreen', {
      tab: currentTab,
    });
  };

  // const onPressBackFromMissionDetail = () => {
  //   navigation.goBack();
  // };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <CustomHeader
        showBackBtn
        onPressBack={onPressBack}
        title="สรุปรายละเอียดการแลก"
      />
      {loading ? (
        <View />
      ) : (
        <Content redeemDetail={redeemDetail} navigation={navigation} />
      )}

      <Spinner
        visible={loading}
        animation="fade"
        textContent="Loading..."
        textStyle={{ color: '#FFF' }}
      />
    </SafeAreaView>
  );
}
