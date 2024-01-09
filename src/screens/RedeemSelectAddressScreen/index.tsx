import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
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

type ScreenType = {
  navigation: StackNavigationProp<
    MainStackParamList,
    'RedeemSelectAddressScreen'
  >;
  route: RouteProp<MainStackParamList, 'RedeemSelectAddressScreen'>;
};

const RedeemSelectAddressScreen = ({ navigation, route }: ScreenType) => {
  const { data } = route.params;
  const { width } = Dimensions.get('window');
  const { currentPoint } = usePoint();
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
      </ScrollView>
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
});
