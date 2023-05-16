import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import CustomHeader from '../../components/CustomHeader';
import { colors, font, image } from '../../assets';
import { normalize } from '@rneui/themed';
import fonts from '../../assets/fonts';
import { checkCouponByCode } from '../../datasource/PromotionDatasource';
import CouponCard from '../../components/CouponCard/CouponCard';
import { useRecoilState, useRecoilValue } from 'recoil';
import { couponState } from '../../recoil/CouponAtom';

const SearchCouponScreen: React.FC<any> = ({ navigation }) => {
  const [coupon, setCoupon] = useRecoilState(couponState);
  const couponInfo = useRecoilValue(couponState);
  const [disable, setDisable] = useState<boolean>(true);
  const [couponCode, setCouponCode] = useState<string>('');
  const [errText, setErrText] = useState<string>('');
  const [empty, setEmpty] = useState<boolean>(true);
  const [data, setData] = useState({
    id: '',
    couponCode: '',
    couponName: '',
    couponType: '',
    promotionStatus: '',
    promotionType: 'OFFLINE',
    discountType: '',
    discount: 0,
    count: 0,
    keep: 0,
    used: 0,
    startDate: '',
    expiredDate: '',
    description: '',
    condition: '',
    conditionSpecificFarmer: false,
    couponConditionRai: false,
    couponConditionRaiMin: 0,
    couponConditionRaiMax: 0,
    couponConditionService: false,
    couponConditionServiceMin: 0,
    couponConditionServiceMax: 0,
    couponConditionPlant: false,
    couponConditionPlantList: [],
    couponConditionProvince: false,
    couponConditionProvinceList: [],
    couponOfflineCode: [],
    keepthis: false,
  });
  const getCoupon = (code: string) => {
    checkCouponByCode(code)
      .then(res => {
        if (res.canUsed === undefined) {
          setErrText('ไม่มีรหัสคูปอง โปรดตรวจสอบหมายเลขคูปองอีกครั้ง');
        } else {
          if (res.canUsed) {
            setEmpty(false);
            setData({
              id: res.id,
              couponCode: res.couponCode,
              couponName: res.couponName,
              couponType: res.couponType,
              promotionStatus: res.promotionStatus,
              promotionType: res.promotionType,
              discountType: res.discountType,
              discount: res.discount,
              count: res.count,
              keep: res.keep,
              used: res.used,
              startDate: res.startDate,
              expiredDate: res.expiredDate,
              description: res.description,
              condition: res.condition,
              conditionSpecificFarmer: res.conditionSpecificFarmer,
              couponConditionRai: res.couponConditionRai,
              couponConditionRaiMin: res.couponConditionRaiMin,
              couponConditionRaiMax: res.couponConditionRaiMax,
              couponConditionService: res.couponConditionService,
              couponConditionServiceMin: res.couponConditionServiceMin,
              couponConditionServiceMax: res.couponConditionServiceMax,
              couponConditionPlant: res.couponConditionPlant,
              couponConditionPlantList: res.couponConditionPlantList,
              couponConditionProvince: res.couponConditionProvince,
              couponConditionProvinceList: res.couponConditionProvinceList,
              couponOfflineCode: res.couponOfflineCode,
              keepthis: false,
            });
          } else {
            setErrText('คูปองนี้ถูกใช้แล้ว');
          }
        }
      })
      .catch(err => console.log(err));
  };
  return (
    <>
      <View>
        <CustomHeader
          title="ค้นหาคูปอง"
          showBackBtn
          onPressBack={() => {
            setCoupon({
              ...coupon,
              err: '',
            });
            navigation.goBack();
          }}
        />
        <View
          style={{
            backgroundColor: colors.white,
          }}>
          <View style={styles.searchBar}>
            <TextInput
              style={{
                flex: 5,
                height: normalize(50),
                padding: normalize(10),
                backgroundColor: colors.grayBg,
                borderRadius: normalize(8),
                fontFamily: fonts.SarabunMedium,
                fontSize: normalize(16),
                color: colors.fontBlack,
              }}
              placeholder="ระบุรหัสคูปองส่วนลด"
              placeholderTextColor={colors.gray}
              clearButtonMode="always"
              onChangeText={text => {
                setCouponCode(text);
                setErrText('');
                setEmpty(true);
                if (text.length < 1) {
                  setCoupon({
                    ...coupon,
                    err: '',
                  });
                  setDisable(true);
                } else {
                  setDisable(false);
                }
              }}
            />
            <TouchableOpacity
              disabled={disable}
              onPress={() => getCoupon(couponCode)}>
              <View
                style={{
                  flex: 1,
                  marginLeft: normalize(10),
                  backgroundColor: disable ? colors.grey20 : colors.greenLight,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: normalize(10),
                  borderRadius: normalize(6),
                }}>
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: font.AnuphanMedium,
                    fontSize: normalize(16),
                  }}>
                  ยืนยัน
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              paddingHorizontal: normalize(15),
              paddingVertical: normalize(5),
              fontFamily: fonts.SarabunMedium,
              fontSize: normalize(16),
              color: colors.errorText,
            }}>
            {errText}
            {couponInfo.err}
          </Text>
        </View>
        {empty ? (
          <View
            style={{
              backgroundColor: '#F6FCF8',
              height: '100%',
              paddingVertical: '50%',
              alignItems: 'center',
            }}>
            <Image source={image.searchEmpty} />
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                color: colors.gray,
                fontSize: normalize(18),
                paddingTop: normalize(20),
              }}>
              กรุณาค้นหาคูปองส่วนลด
            </Text>
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                color: colors.gray,
                fontSize: normalize(18),
              }}>
              ด้วยการระบุรหัส
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: '#F6FCF8',
              height: '100%',
              padding: normalize(17),
            }}>
            <CouponCard
              id={data.id}
              couponCode={data.couponCode}
              couponName={data.couponName}
              couponType={data.couponType}
              promotionStatus={data.promotionStatus}
              promotionType={data.promotionType}
              discountType={data.discountType}
              discount={data.discount}
              count={data.count}
              keep={data.keep}
              used={data.used}
              startDate={data.startDate}
              expiredDate={data.expiredDate}
              description={data.description}
              condition={data.condition}
              conditionSpecificFarmer={data.conditionSpecificFarmer}
              couponConditionRai={data.couponConditionRai}
              couponConditionRaiMin={data.couponConditionRaiMin}
              couponConditionRaiMax={data.couponConditionRaiMax}
              couponConditionService={data.couponConditionService}
              couponConditionServiceMin={data.couponConditionServiceMin}
              couponConditionServiceMax={data.couponConditionServiceMax}
              couponConditionPlant={data.couponConditionPlant}
              couponConditionPlantList={data.couponConditionPlantList}
              couponConditionProvince={data.couponConditionProvince}
              couponConditionProvinceList={data.couponConditionProvinceList}
              couponOfflineCode={data.couponOfflineCode}
              keepthis={true}
              disabled={false}
            />
          </View>
        )}
      </View>
    </>
  );
};

export default SearchCouponScreen;

const styles = StyleSheet.create({
  searchBar: {
    padding: normalize(10),
    flexDirection: 'row',
    aligndatas: 'center',
    backgroundColor: colors.white,
  },
});
