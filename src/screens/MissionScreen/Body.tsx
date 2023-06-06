import {View, StyleSheet, ScrollView, Image, Dimensions} from 'react-native';
import React, {useEffect} from 'react';

import CollapseItem from './CollapseItem';
import Text from '../../components/Text';
import {colors, image} from '../../assets';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabNavigatorParamList} from '../../navigations/bottomTabs/MainTapNavigator';
import {missionDatasource} from '../../datasource/MissionDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: BottomTabNavigationProp<TabNavigatorParamList, 'mission'>;
}
export interface Mission {
  id: string;
  campaignName: string;
  campaignType: string;
  startDate: string;
  endDate: string;
  condition: Condition[];
  createBy: string;
  updateBy: string;
  status: string;
  application: string;
  createAt: string;
  updateAt: string;
  description: string | null;
  pathImageBanner: string | null;
  pathImageReward: string | null;
  missionNo: string;
  pathImageFloating: string | null;
  pathImageRewardRound: string | null;
  rulesCampaign: string | null;
}

interface Condition {
  num: number;
  rai: number;
  point: string | null;
  quata: number;
  rewardId: string;
  missionId: string;
  rewardName: string | null;
  missionName: string;
  rewardRound: number;
  conditionReward: string;
  descriptionReward: string;
  allRai: number;
  status: string;
  reward: Reward;
}

interface Reward {
  id: string;
  rewardName: string;
  imagePath: string;
  rewardType: string;
  rewardExchange: string;
  rewardNo: string;
  score: string | null;
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
  expiredExchangeDateCronJob: string | null;
  startUsedDateCronJob: string | null;
  expiredUsedDateCronJob: string | null;
  digitalCode: string | null;
  status: string;
  statusUsed: string | null;
  createBy: string;
  createAt: string;
  updateAt: string;
}

export default function Body({navigation}: Props) {
  const [missionList, setMissionList] = React.useState<{
    count: number;
    mission: Mission[];
  }>({
    count: 0,
    mission: [],
  });

  useEffect(() => {
    const getAllMission = async () => {
      try {
        const dronerId = await AsyncStorage.getItem('droner_id');
        const payload = {
          page: 1,
          take: 10,
          dronerId: dronerId || '',
        };
        const res = await missionDatasource.getListMissions(payload);
        setMissionList(res);
      } catch (err) {
        console.log(err);
      }
    };
    getAllMission();
  }, []);
  const EmptyContent = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={image.emptyMission}
          style={{
            width: 120,
            height: 120,
            marginBottom: 16,
          }}
        />
        <Text
          style={{
            color: colors.grey3,
          }}>
          ยังไม่มีภารกิจในขณะนี้
        </Text>
        <Text
          style={{
            color: colors.grey3,
          }}>
          ติดตามภารกิจพร้อมพิชิตรางวัลมากมาย
        </Text>
        <Text
          style={{
            color: colors.grey3,
          }}>
          ได้ที่หน้านี่
        </Text>
      </View>
    );
  };

  return (
    <View>
      {missionList.mission.length > 0 ? (
        <ScrollView style={styles.container}>
          {missionList.mission.map((item, index) => {
            return (
              <CollapseItem
                key={index}
                navigation={navigation}
                mission={item}
              />
            );
          })}

          <View style={{height: 200}} />
        </ScrollView>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: Dimensions.get('window').height - 300,
          }}>
          <EmptyContent />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    padding: 16,
  },
});
