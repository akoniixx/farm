import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useEffect } from 'react';
import CustomHeader from '../../components/CustomHeader';
import { colors, font, icons } from '../../assets';
import { RouteProp } from '@react-navigation/native';
import { SheetManager } from 'react-native-actions-sheet';
// import { BASE_URL, httpClient } from '../../config/develop-config';
import moment from 'moment';
// import Modal from '../../components/Modal/Modal';
// import { rewardDatasource } from '../../datasource/RewardDatasource';
// import AsyncButton from '../../components/Button/AsyncButton';

import { SafeAreaView } from 'react-native-safe-area-context';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Text from '../../components/Text/Text';
import CardRedeemDigital from '../../components/CardRedeemDigital/CardRedeemDigital';
import { shopDatasource } from '../../datasource/ShopDatasource';
import { rewardDatasource } from '../../datasource/RewardDatasource';
import { useAuth } from '../../contexts/AuthContext';
import { normalize } from '../../functions/Normalize';

interface Props {
  navigation: any;
  route: RouteProp<MainStackParamList, 'RedeemDetailDigitalScreen'>;
}
interface Branch {
  createdAt: string;
  id: string;
  isActive: boolean;
  name: string;
  nameEn: string | null;
  updatedAt: string;
  shopCode: string;
}
// interface CompanyData {
//   id: string;
//   name: string;
//   companyCode: string;
//   createdAt: string;
//   isActive: boolean;
//   nameEn: string | null;
//   imagePath: string;
// }

export default function RedeemDetailDigitalScreen({
  navigation,
  route,
}: Props) {
  const { data, imagePath, expiredUsedDate } = route.params;
  const {
    state: { user },
  } = useAuth();
  // const [selectedArea, setSelectedArea] = React.useState<any>(null);

  const isExpired = React.useMemo(() => {
    return moment(expiredUsedDate).isBefore(moment());
  }, [expiredUsedDate]);
  // const [companyItem, setCompanyItem] = React.useState<CompanyData>({
  //   name: '',
  //   id: '',
  // } as CompanyData);
  const [dataBranch, setDataBranch] = React.useState<Branch[]>([]);
  const onSelected = async (selected: Branch) => {
    try {
      const res = await rewardDatasource.useRedeemReward({
        farmerTransactionId: data.farmerTransaction.id,
        shopCode: selected.shopCode,
        shopName: selected.name,
        updateBy: `${user?.firstname} ${user?.lastname}`,
      });
      navigation.navigate('RedeemDetailDigitalReadOnlyScreen', {
        id: res.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSelectReceiver = async () => {
    try {
      const result: {
        selected: Branch;
        isCancel?: boolean;
      } = await SheetManager.show('selectReceiver', {
        payload: {
          shopList: dataBranch,
          rewardData: data,
        },
      });
      if (result && !result.isCancel) {
        await onSelected(result?.selected);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onPressSeeDetail = () => {
    navigation.navigate('RewardDetailReadOnlyScreen', {
      id: data.farmerTransaction.rewardId,
      isDigital: data.farmerTransaction.redeemDetail.rewardType === 'DIGITAL',
      isReadOnly: true,
    });
  };
  useEffect(() => {
    const getShopList = async () => {
      try {
        const res = await shopDatasource.getShopList({});
        setDataBranch(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getShopList();
  }, []);
  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <CustomHeader
        styleWrapper={{
          height: 56,
        }}
        title="รายละเอียดรางวัล"
        headerRight={() => {
          return (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: 16,
              }}>
              <Image
                source={icons.closeGrey}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          );
        }}
      />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          backgroundColor: '#f9fafd',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <CardRedeemDigital
              imagePath={imagePath}
              data={data}
              expiredUsedDate={expiredUsedDate}
            />
            <View style={styles.warningBox}>
              <Image
                source={icons.warningRed}
                style={{
                  width: 16,
                  height: 16,
                }}
              />
              <Text
                style={{
                  flex: 0.95,
                  marginLeft: 8,
                  fontSize: 12,
                  fontFamily: font.SarabunRegular,
                  color: colors.errorText,
                }}>
                นำภาพหน้าจอส่วนนี้ไปที่ร้านค้า/บริษัท/สถานประกอบการ
                หรือสถานที่ในรายละเอียดที่ต้องการและแสดงให้เจ้าหน้าที่ยืนยันการใช้สิทธิ์
              </Text>
            </View>
          </View>
          {!isExpired && (
            <View
              style={{
                marginTop: 16,
                marginBottom: 32,
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={styles.buttonDetail}
                onPress={onPressSeeDetail}>
                <Text
                  style={{
                    color: colors.grey80,
                    fontSize: normalize(18),
                    fontFamily: font.AnuphanSemiBold,
                  }}>
                  รายละเอียด
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: 10,
                }}
              />
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={onSelectReceiver}>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: normalize(18),
                    fontFamily: font.AnuphanSemiBold,
                  }}>
                  ใช้สิทธิ์ (เฉพาะเจ้าหน้าที่)
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  listCompany: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  containerBrand: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 8,
    borderRadius: 8,
    width: '100%',
    backgroundColor: colors.white,
  },

  buttonPrimary: {
    backgroundColor: colors.blueBorder,
    borderRadius: 8,
    minHeight: 58,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonDetail: {
    borderColor: colors.grey80,
    borderWidth: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    borderRadius: 8,
    minHeight: 58,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
  },
  warningBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.errorText,
    padding: 8,
    marginTop: 16,
    minHeight: 58,
    flexDirection: 'row',
  },
});
