import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  MainStackParamList,
  RedeemSelectAddressScreenType,
} from '../../navigations/MainNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../assets/colors/colors';
import CustomHeader from '../../components/CustomHeader';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import { font } from '../../assets';
import RenderHTML from 'react-native-render-html';
import { numberWithCommas } from '../../functions/utility';
import { usePoint } from '../../contexts/PointContext';
import AddressDetail from './AddressDetail';

type ScreenType = {
  navigation: StackNavigationProp<
    MainStackParamList,
    'RedeemSelectAddressScreen'
  >;
  route: RouteProp<MainStackParamList, 'RedeemSelectAddressScreen'>;
};

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
const RedeemSelectAddressScreen = ({ navigation, route }: ScreenType) => {
  const { data } = route.params;
  const { width } = Dimensions.get('window');
  const { currentPoint } = usePoint();
  const [isConfirm, setIsConfirm] = React.useState<boolean>(false);
  const [disableButton, setDisableButton] = React.useState<boolean>(false);
  const [exchangeDetail, setExchangeDetail] =
    React.useState<RedeemSelectAddressScreenType>({
      amountExchange: 0,
      rewardName: '',
      usePoint: 0,
    } as RedeemSelectAddressScreenType);

  useFocusEffect(
    React.useCallback(() => {
      if (data) {
        setExchangeDetail(data);
      }
    }, [data]),
  );
  const onConfirm = () => {
    setIsConfirm(true);
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'top', 'left']}>
      <CustomHeader
        title={'รายละเอียดรางวัล'}
        showBackBtn
        onPressBack={() => {
          navigation.goBack();
        }}
        styleWrapper={{ backgroundColor: colors.greenLight }}
        titleColor={colors.white}
      />
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: 16,
        }}>
        {Object.keys(exchangeDetail).length > 0 && (
          <>
            <View
              style={[
                styles.container,
                {
                  flexDirection: 'row',
                  marginBottom: 16,
                },
              ]}>
              <View
                style={{
                  width: 80,
                }}>
                <ProgressiveImage
                  source={{ uri: data.imagePath }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                  }}
                />
              </View>
              <View
                style={{
                  paddingLeft: Platform.OS === 'android' ? 32 : 16,
                  flex: 1,
                  alignItems: 'flex-start',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.AnuphanRegular,
                    color: colors.gray,
                  }}>
                  สินค้า
                </Text>
                <RenderHTML
                  contentWidth={width * 0.8}
                  source={{ html: exchangeDetail.rewardName }}
                  tagsStyles={{
                    body: {
                      fontSize: 18,
                      fontFamily: font.AnuphanSemiBold,
                      color: colors.fontBlack,
                      marginTop: 4,
                      alignSelf: 'flex-start',
                    },
                  }}
                  systemFonts={[font.AnuphanSemiBold]}
                />
              </View>
            </View>
            <View style={styles.content}>
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.SarabunRegular,
                    color: colors.grey60,
                    lineHeight: 28,
                  }}>
                  จำนวน
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.SarabunSemiBold,
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
                    fontFamily: font.SarabunRegular,
                    color: colors.grey60,
                    lineHeight: 28,
                  }}>
                  แต้มสะสมปัจจุบัน
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.SarabunSemiBold,
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
                    fontFamily: font.SarabunRegular,
                    color: colors.grey60,
                    lineHeight: 28,
                  }}>
                  ใช้แต้ม
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.SarabunSemiBold,
                    color: colors.errorText,
                    lineHeight: 28,
                  }}>
                  {numberWithCommas(data.usePoint.toString(), true)} แต้ม
                </Text>
              </View>
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 18,
                    lineHeight: 28,

                    fontFamily: font.SarabunRegular,
                    color: colors.grey60,
                  }}>
                  แต้มคงเหลือ
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: font.SarabunSemiBold,
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
        <AddressDetail
          setDisableButton={setDisableButton}
          data={data}
          navigation={navigation}
          setIsConfirm={setIsConfirm}
          isConfirm={isConfirm}
        />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={disableButton}
          style={disableButton ? styles.disabledButton : styles.button}
          onPress={onConfirm}>
          <Text style={styles.textButton}>ยืนยันการแลก</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RedeemSelectAddressScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.greenLight,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    paddingVertical: 16,
    borderBottomColor: colors.greyDivider,
    borderBottomWidth: 1,
    borderTopColor: colors.greyDivider,
    borderTopWidth: 1,
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  textButton: {
    fontSize: 20,
    fontFamily: font.AnuphanSemiBold,
    color: colors.white,
  },
  button: {
    width: '100%',
    backgroundColor: colors.greenLight,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.greenLight,
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
});
