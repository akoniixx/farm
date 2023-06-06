import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import {colors, font} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import {numberWithCommas} from '../../function/utility';
import AddressDetail from './AddressDetail';
import Text from '../../components/Text';
import FastImage from 'react-native-fast-image';
import {usePoint} from '../../contexts/PointContext';
import RenderHTML from '../../components/RenderHTML/RenderHTML';
import Modal from '../../components/Modal/Modal';
import {rewardDatasource} from '../../datasource/RewardDatasource';
interface Props {
  navigation: any;
  route: RouteProp<StackParamList, 'RedeemAddressScreen'>;
}
export interface RewardParams {
  id: string;
  rewardName: string;
  imagePath: string | null;
  rewardType: string;
  rewardExchange: string;
  rewardNo: string;
  score: number | null;
  amount: number;
  used: number;
  remain: number;
  description: string;
  condition: string;
  startExchangeDate: string | null;
  expiredExchangeDate: string | null;
  startUsedDate: string | null;
  expiredUsedDate: string | null;
  startExchangeDateCronJob: string | null;
  expiredExchangeDateCronJob: string | null;
  startUsedDateCronJob: string | null;
  expiredUsedDateCronJob: string | null;
  digitalCode: string | null;
  status: string;
  statusUsed: string | null;
  createAt: string;
  updateAt: string;
  amountExchange: number;
  usePoint: number;
}

export default function RedeemAddressScreen({navigation, route}: Props) {
  const {data = null, missionData = null} = route.params;
  const {currentPoint, getCurrentPoint} = usePoint();
  const [missionDetail, setMissionDetail] = React.useState<any>(null);
  const [isConfirm, setIsConfirm] = React.useState(false);
  const [isConfirmMission, setIsConfirmMission] = React.useState(false);

  const onConfirm = () => {
    setIsConfirm(true);
  };
  const onShowConfirmMission = () => {
    setIsConfirmMission(true);
  };

  const [exchangeDetail, setExchangeDetail] = React.useState<RewardParams>(
    {} as RewardParams,
  );

  useEffect(() => {
    if (data) {
      setExchangeDetail(data);
      getCurrentPoint();
    }
    if (missionData) {
      setMissionDetail(missionData);
    }
  }, [data, getCurrentPoint, missionData]);
  const {width} = useWindowDimensions();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        showBackBtn
        onPressBack={() => navigation.goBack()}
        title="สรุปรายละเอียดการแลก"
      />
      <ScrollView>
        {Object.keys(exchangeDetail).length > 0 && (
          <>
            <View style={styles.container}>
              <View
                style={{
                  flex: 0.2,
                }}>
                <FastImage
                  source={{uri: data.imagePath}}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                  }}
                />
              </View>
              <View style={{paddingLeft: 16, flex: 0.8}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    color: colors.gray,
                  }}>
                  สินค้า
                </Text>
                <RenderHTML
                  contentWidth={width * 0.8}
                  source={{html: exchangeDetail.rewardName}}
                  tagsStyles={{
                    body: {
                      fontSize: 18,
                      fontFamily: font.bold,
                      color: colors.fontBlack,
                      marginTop: 4,
                      alignSelf: 'flex-start',
                    },
                  }}
                />
              </View>
            </View>
            <View style={styles.content}>
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 28,

                    fontFamily: font.medium,
                    color: colors.grey2,
                  }}>
                  จำนวน
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    color: colors.fontBlack,
                    lineHeight: 28,
                  }}>
                  {exchangeDetail.amountExchange}
                </Text>
              </View>
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    color: colors.grey2,
                    lineHeight: 28,
                  }}>
                  แต้มสะสมปัจจุบัน
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    color: colors.fontBlack,
                    lineHeight: 28,
                  }}>
                  {numberWithCommas(currentPoint.toString(), true)} แต้ม
                </Text>
              </View>
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    color: colors.grey2,
                    lineHeight: 28,
                  }}>
                  ใช้แต้ม
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    color: colors.decreasePoint,
                    lineHeight: 28,
                  }}>
                  {numberWithCommas(data.usePoint.toString(), true)} แต้ม
                </Text>
              </View>
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 28,

                    fontFamily: font.medium,
                    color: colors.grey2,
                  }}>
                  แต้มคงเหลือ
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    lineHeight: 28,

                    color: colors.fontBlack,
                  }}>
                  {numberWithCommas(
                    (currentPoint - exchangeDetail.usePoint).toString(),
                    true,
                  )}{' '}
                  แต้ม
                </Text>
              </View>
            </View>
          </>
        )}
        {missionDetail && (
          <>
            <View style={styles.container}>
              <View
                style={{
                  flex: 0.2,
                }}>
                <FastImage
                  source={{uri: missionDetail?.imagePath}}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                  }}
                />
              </View>
              <View style={{paddingLeft: 16, flex: 0.8}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    color: colors.gray,
                  }}>
                  สินค้า
                </Text>
                <RenderHTML
                  contentWidth={width * 0.8}
                  source={{html: missionData.rewardName}}
                  tagsStyles={{
                    body: {
                      fontSize: 18,
                      fontFamily: font.bold,
                      color: colors.fontBlack,
                      marginTop: 4,
                      alignSelf: 'flex-start',
                    },
                  }}
                />
              </View>
            </View>
            <View style={styles.content}>
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 28,

                    fontFamily: font.medium,
                    color: colors.grey2,
                  }}>
                  จำนวน
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    color: colors.fontBlack,
                    lineHeight: 28,
                  }}>
                  {missionDetail.amount}
                </Text>
              </View>
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    color: colors.grey2,
                    lineHeight: 28,
                  }}>
                  จากภารกิจ
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.medium,
                    color: colors.orange,
                    lineHeight: 28,
                  }}>
                  {missionDetail.missionName}
                </Text>
              </View>
            </View>
          </>
        )}

        <AddressDetail
          isConfirmMission={isConfirmMission}
          setIsConfirmMission={setIsConfirmMission}
          navigation={navigation}
          data={exchangeDetail}
          missionDetail={missionDetail}
          isConfirm={isConfirm}
          setIsConfirm={setIsConfirm}
        />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={missionDetail ? onShowConfirmMission : onConfirm}>
          <Text style={styles.textButton}>ยืนยันการแลก</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomColor: colors.greys5,
    borderBottomWidth: 1,
    borderTopColor: colors.greys5,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  content: {
    padding: 16,
    borderBottomColor: colors.greys5,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    height: 100,
    backgroundColor: colors.white,

    flexDirection: 'row',
    padding: 16,
    elevation: 8,
    shadowColor: '#242D35',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  textButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.white,
  },
  button: {
    width: '100%',
    backgroundColor: colors.orange,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F86820',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },

  disabledButton: {
    width: '100%',
    backgroundColor: colors.disable,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DCDFE3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  subButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  textSubButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.fontBlack,
  },
});
