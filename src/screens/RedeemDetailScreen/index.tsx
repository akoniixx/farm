import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import {rewardDatasource} from '../../datasource/RewardDatasource';
import {colors, font} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {momentExtend, numberWithCommas} from '../../function/utility';
import RenderHTML from 'react-native-render-html';
import {usePoint} from '../../contexts/PointContext';

interface Props {
  navigation: any;
  route: RouteProp<StackParamList, 'RedeemDetailScreen'>;
}

interface RedeemDetail {
  id: string;
  dronerId: string;
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
  rewardCode: string;
  receiverDetail: {
    tel: string;
    address: string;
    lastname: string;
    firstname: string;
  };
  createAt: string;
  updateAt: string;
  dronerRedeemHistories: {
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
    dronerTransaction: {
      id: string;
      dronerId: string;
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
      rewardCode: string;
      receiverDetail: {
        tel: string;
        address: string;
        lastname: string;
        firstname: string;
      };
      createAt: string;
      updateAt: string;
    };
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
const mappingStatus = {
  REQUEST: 'คำร้องขอแลก',
  PREPARE: 'เตรียมจัดส่ง',
  DONE: 'ส่งแล้ว',
  CANCEL: 'ยกเลิก',
  EXPIRED: 'หมดอายุ',
  USED: 'ใช้แล้ว',
};
const mappingStatusColor = {
  REQUEST: '#EBBB00',
  PREPARE: colors.orange,
  DONE: colors.green,
  CANCEL: colors.decreasePoint,
  EXPIRED: colors.decreasePoint,
  USED: colors.green,
};

export default function RedeemDetailScreen({navigation, route}: Props) {
  const {id} = route.params;
  const width = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);
  const [redeemDetail, setRedeemDetail] = useState<RedeemDetail>(
    {} as RedeemDetail,
  );
  useEffect(() => {
    const getRedeemDetail = async () => {
      try {
        setLoading(true);
        const result = await rewardDatasource.getRedeemDetail(id);
        setRedeemDetail(result);
        setLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      getRedeemDetail();
    }
  }, [id]);
  console.log(JSON.stringify(redeemDetail, null, 2));

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        showBackBtn
        onPressBack={() =>
          navigation.navigate('MyRewardScreen', {
            tab: 'history',
          })
        }
        title="สรุปรายละเอียดการแลก"
      />
      {loading ? (
        <></>
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <View
              style={{
                flex: 0.2,
              }}>
              <FastImage
                source={{uri: redeemDetail?.reward?.imagePath}}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                }}
              />
            </View>
            <View style={{paddingLeft: 16, flex: 0.8}}>
              <RenderHTML
                contentWidth={width * 0.8}
                source={{html: redeemDetail.reward.rewardName}}
                tagsStyles={{
                  body: {
                    fontSize: 20,
                    fontFamily: font.bold,
                    color: colors.fontBlack,
                    marginTop: 4,
                    lineHeight: 28,
                    alignSelf: 'flex-start',
                  },
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: font.medium,
                  color: colors.gray,
                }}>
                สถานะ : <Text>wait api</Text>
              </Text>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: colors.greys5,
              borderBottomWidth: 1,
              padding: 16,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.light,
                color: colors.gray,
              }}>
              บริษัทจะจัดส่งสินค้า/ของรางวัลให้ท่านภายใน 14 วันทำการ
            </Text>
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
                {redeemDetail.rewardQuantity}
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
                แต้มที่ใช้แลก
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: font.medium,
                  color: colors.decreasePoint,
                  lineHeight: 28,
                }}>
                {numberWithCommas(redeemDetail.amountValue.toString(), true)}{' '}
                แต้ม
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
                วัน/เวลาที่ทำรายการ
              </Text>
              <Text
                style={{
                  fontSize: 16,

                  lineHeight: 28,
                }}>
                {momentExtend.toBuddhistYear(
                  redeemDetail.createAt,
                  'DD MMM YYYY HH:mm',
                )}
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
                รหัสการทำรายการ
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: font.medium,
                  lineHeight: 28,

                  color: colors.fontBlack,
                }}>
                {redeemDetail.rewardCode}
              </Text>
            </View>
          </View>
          <View style={{padding: 16}}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: font.bold,
                color: colors.fontBlack,
              }}>
              ที่อยู่ในการจัดส่ง
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.light,
                color: colors.gray,
                marginVertical: 4,
              }}>
              ชื่อ-นามสกุล : {redeemDetail?.receiverDetail.firstname}{' '}
              {redeemDetail?.receiverDetail.lastname}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.light,
                color: colors.gray,
                marginVertical: 4,
              }}>
              เบอร์โทรศัพท์ : {redeemDetail?.receiverDetail.tel}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.light,
                color: colors.gray,
                marginVertical: 4,
                alignSelf: 'flex-start',
                width: '90%',
                lineHeight: 24,
              }}>
              ที่อยู่ : {redeemDetail?.receiverDetail?.address}
            </Text>
          </View>
        </ScrollView>
      )}

      <Spinner
        visible={loading}
        animation="fade"
        textContent="Loading..."
        textStyle={{color: '#FFF'}}
      />
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
});
