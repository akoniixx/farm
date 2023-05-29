import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import {colors, font} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import {numberWithCommas} from '../../function/utility';
import AddressDetail from './AddressDetail';
import Modal from '../../components/Modal/Modal';
import Text from '../../components/Text';
import FastImage from 'react-native-fast-image';
import RenderHTML from 'react-native-render-html';
import {usePoint} from '../../contexts/PointContext';
interface Props {
  navigation: any;
  route: RouteProp<StackParamList, 'ExchangeAddressScreen'>;
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

export default function ExchangeAddressScreen({navigation, route}: Props) {
  const {data} = route.params;
  const [isConfirm, setIsConfirm] = React.useState(false);
  const {currentPoint} = usePoint();
  const [exchangeDetail, setExchangeDetail] = React.useState<RewardParams>(
    {} as RewardParams,
  );
  const onConfirm = () => {
    setIsConfirm(true);
  };
  useEffect(() => {
    if (data) {
      setExchangeDetail(data);
    }
  }, [data]);
  const {width} = useWindowDimensions();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        showBackBtn
        onPressBack={() => navigation.goBack()}
        title="สรุปรายละเอียดการแลก"
      />
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{
              flex: 0.2,
            }}>
            <FastImage
              source={{uri: data.imagePath}}
              resizeMode="contain"
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
                p: {
                  fontSize: 16,
                  fontFamily: font.bold,
                  color: colors.fontBlack,
                  marginTop: 4,
                  lineHeight: 28,
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
        <AddressDetail navigation={navigation} data={exchangeDetail} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={onConfirm}>
          <Text style={styles.textButton}>ยืนยันการแลก</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={isConfirm}>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 12,
            padding: 16,
            width: '100%',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: font.medium,
              color: colors.fontBlack,
            }}>
            กรุณาตรวจสอบข้อมูลของท่าน
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: font.medium,
              color: colors.fontBlack,
            }}>
            ก่อนยืนยันการแลกของรางวัล
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: font.light,
              color: colors.inkLight,
              marginTop: 8,
            }}>
            หากกดยืนยันการแลกแล้ว
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: font.light,
              color: colors.inkLight,
            }}>
            จะไม่สามารถแลกแต้มคืนได้
          </Text>
          <TouchableOpacity
            style={[styles.button, {marginTop: 16}]}
            onPress={() => {
              setIsConfirm(true);
            }}>
            <Text style={styles.textButton}>ยืนยัน</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subButton}
            onPress={() => {
              setIsConfirm(false);
            }}>
            <Text style={styles.textSubButton}>ยกเลิก</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
