import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomHeader from '../../components/CustomHeader';
import { colors, icons } from '../../assets';
import { normalize } from '@rneui/themed';
import fonts from '../../assets/fonts';
import {
  checkCouponByCode,
  checkMyCoupon,
  getMyCoupon,
  keepCoupon,
} from '../../datasource/PromotionDatasource';
import { MyCouponCardEntities } from '../../entites/CouponCard';
import CouponCardUsed from '../../components/CouponCard/CouponCardUsed';
import { Image } from '@rneui/base';
import { useRecoilState, useRecoilValue } from 'recoil';
import { couponState } from '../../recoil/CouponAtom';
import { PlotDatasource } from '../../datasource/PlotDatasource';
import { mixpanel } from '../../../mixpanel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Text from '../../components/Text/Text';
import LoadingSkeletonCoupon from './LoadingSkeletonCoupon';

const UseCouponScreen: React.FC<any> = ({ navigation, route }) => {
  const conditionCheck = route.params;
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useRecoilState(couponState);
  const couponInfo = useRecoilValue(couponState);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<MyCouponCardEntities[]>([]);
  const [couponOffline, setCouponOffline] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);
  const getData = async (page: number, take: number, used?: boolean) => {
    setLoading(true);
    await getMyCoupon(page, take, used)
      .then(res => {
        setCount(res.count);
        let Data = res.data;
        Data.map((item: any, index: number) => {
          Data[index].passCondition = checkCouponCondition(
            item.promotion.couponConditionRai,
            item.promotion.couponConditionRaiMax,
            item.promotion.couponConditionRaiMin,
            item.promotion.couponConditionService,
            item.promotion.couponConditionServiceMax,
            item.promotion.couponConditionServiceMin,
            item.promotion.couponConditionPlant,
            item.promotion.couponConditionPlantList,
            item.promotion.couponConditionProvince,
            item.promotion.couponConditionProvinceList,
          );
        });
        setData(
          Data.sort((a: any, b: any) => a.passCondition - b.passCondition),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const checkCouponCondition = (
    conditionRai: boolean,
    conditionRaiMax: number,
    conditionRaiMin: number,
    conditionService: boolean,
    conditionServiceMax: number,
    conditionServiceMin: number,
    conditionPlant: boolean,
    conditionPlantList: any[],
    conditionProvince: boolean,
    conditionProvinceList: string[],
  ): boolean => {
    let raiCheck = conditionRai;
    let serviceCheck = conditionService;
    let plantCheck = conditionPlant;
    let provinceCheck = conditionProvince;
    if (raiCheck) {
      if (conditionRaiMin && conditionRaiMax) {
        if (
          conditionCheck.farmAreaAmount <= conditionRaiMax &&
          conditionCheck.farmAreaAmount >= conditionRaiMin
        ) {
          raiCheck = false;
        } else {
          raiCheck = true;
        }
      } else if (!conditionRaiMin && conditionRaiMax) {
        //max only
        if (conditionCheck.farmAreaAmount <= conditionRaiMax) {
          raiCheck = false;
        } else {
          raiCheck = true;
        }
      } else if (conditionRaiMin && !conditionRaiMax) {
        // min only
        if (conditionCheck.farmAreaAmount >= conditionRaiMin) {
          raiCheck = false;
        } else {
          raiCheck = true;
        }
      }
    }
    if (serviceCheck) {
      if (conditionServiceMin && conditionServiceMax) {
        if (
          conditionCheck.price <= conditionServiceMax &&
          conditionCheck.price >= conditionServiceMin
        ) {
          serviceCheck = false;
        } else {
          serviceCheck = true;
        }
      } else if (!conditionServiceMin && conditionServiceMax) {
        //max only
        if (conditionCheck.price <= conditionServiceMax) {
          serviceCheck = false;
        } else {
          serviceCheck = true;
        }
      } else if (conditionServiceMin && !conditionServiceMax) {
        // min only
        if (conditionCheck.price >= conditionServiceMin) {
          serviceCheck = false;
        } else {
          serviceCheck = true;
        }
      }
    }
    if (plantCheck) {
      plantCheck = !conditionPlantList.some(
        (item: any) =>
          item.plantName === conditionCheck.plantName &&
          item.injectionTiming.includes(conditionCheck.purposeSprayName),
      );
    }
    if (provinceCheck) {
      provinceCheck = !conditionProvinceList.includes(conditionCheck.province);
    }
    let result = raiCheck || serviceCheck || plantCheck || provinceCheck;
    return result;
  };

  const onScrollEnd = () => {
    let pageNow = page;
    if (data.length < count) {
      getMyCoupon(pageNow + 1, 5, false)
        .then(res => {
          let Data = res.data;
          Data.map((item: any, index: number) => {
            Data[index].passCondition = checkCouponCondition(
              item.promotion.couponConditionRai,
              item.promotion.couponConditionRaiMax,
              item.promotion.couponConditionRaiMin,
              item.promotion.couponConditionService,
              item.promotion.couponConditionServiceMax,
              item.promotion.couponConditionServiceMin,
              item.promotion.couponConditionPlant,
              item.promotion.couponConditionPlantList,
              item.promotion.couponConditionProvince,
              item.promotion.couponConditionProvinceList,
            );
          });
          let newData = data.concat(Data);
          setPage(pageNow + 1);
          setData(
            newData.sort((a: any, b: any) => a.passCondition - b.passCondition),
          );
        })
        .catch(err => console.log(err));
    }
  };

  const checkOffline = async () => {
    setDisabled(true);
    setCoupon(prev => ({ ...prev, err: '' }));
    checkCouponByCode(couponOffline)
      .then(res => {
        if (res.canUsed === undefined) {
          setCoupon({
            ...coupon,
            err: 'ไม่มีรหัสคูปอง โปรดตรวจสอบหมายเลขคูปองอีกครั้ง',
          });
          mixpanel.track('UseCouponScreen_KeepCouponButton_tapped', {
            couponCode: couponOffline,
            errorMessage: 'ไม่มีรหัสคูปอง โปรดตรวจสอบหมายเลขคูปองอีกครั้ง',
          });
        } else {
          if (res.canUsed) {
            checkMyCoupon(couponOffline)
              .then(resCheck => {
                if (!resCheck.userMessage) {
                  PlotDatasource.getCalculatePrice({
                    farmerPlotId: conditionCheck.farmerPlotId,
                    couponCode: couponOffline,
                    cropName: conditionCheck.cropName,
                    raiAmount: conditionCheck.raiAmount,
                  }).then(() => {
                    setCoupon({
                      ...coupon,
                      err: res.message,
                    });
                    mixpanel.track('UseCouponScreen_KeepCouponButton_tapped', {
                      couponCode: couponOffline,
                      errorMessage:
                        'ไม่มีรหัสคูปอง โปรดตรวจสอบหมายเลขคูปองอีกครั้ง',
                    });
                  });
                } else {
                  if (res.promotionStatus === 'INACTIVE') {
                    setCoupon({
                      ...coupon,
                      err: res.message,
                    });
                    mixpanel.track('UseCouponScreen_KeepCouponButton_tapped', {
                      couponCode: couponOffline,
                      errorMessage: res.message,
                    });
                  } else {
                    keepCoupon(res.id, couponOffline)
                      .then(resKeep => {
                        let newData = [
                          {
                            passCondition: checkCouponCondition(
                              res.couponConditionRai,
                              res.couponConditionRaiMax,
                              res.couponConditionRaiMin,
                              res.couponConditionService,
                              res.couponConditionServiceMax,
                              res.couponConditionServiceMin,
                              res.couponConditionPlant,
                              res.couponConditionPlantList,
                              res.couponConditionProvince,
                              res.couponConditionProvinceList,
                            ),
                            ...resKeep,
                            promotion: {
                              ...res,
                            },
                          },
                          ...data,
                        ];
                        setData(newData);
                        mixpanel.track(
                          'UseCouponScreen_KeepCouponButton_tapped',
                          {
                            couponCode: couponOffline,
                            errorMessage: res.message,
                          },
                        );
                      })
                      .catch(err => console.log(err));
                  }
                }
              })
              .catch(err => console.log(err));
          } else {
            setCoupon({
              ...coupon,
              err: res.message,
            });
            mixpanel.track('UseCouponScreen_KeepCouponButton_tapped', {
              couponCode: couponOffline,
              errorMessage: res.message,
            });
          }
        }
      })
      .finally(() => {
        setDisabled(false);
      });
  };

  useEffect(() => {
    getData(page, 5, false);
  }, []);

  return (
    <>
      <CustomHeader
        showBackBtn
        onPressBack={() => {
          mixpanel.track('UseCouponScreen_BackButton_tapped', {
            changeTo: 'TaskBookingScreen',
          });
          setCoupon(prev => ({
            ...prev,
            err: '',
          }));
          navigation.goBack();
        }}
        title="คูปองส่วนลด"
      />
      <View style={styles.searchCode}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          <View
            style={{
              flex: 8,
              height: normalize(60),
            }}>
            <TextInput
              allowFontScaling={false}
              keyboardType="numeric"
              placeholder="ระบุรหัสคูปองส่วนลด"
              placeholderTextColor={colors.gray}
              style={styles.searchInput}
              value={couponOffline}
              clearButtonMode="always"
              onBlur={() => {
                mixpanel.track('UseCouponScreen_CouponCodeInput_typed', {
                  couponCode: couponOffline,
                });
              }}
              onChangeText={value => {
                setCouponOffline(value);
                if (value.length != 0) {
                  setDisabled(false);
                } else {
                  setDisabled(true);
                }
              }}
            />
          </View>
          <TouchableOpacity
            disabled={disabled}
            style={{
              flex: 3,
              marginLeft: normalize(10),
            }}
            onPress={checkOffline}>
            <View
              style={[
                styles.searchButton,
                {
                  backgroundColor: disabled
                    ? colors.disable
                    : colors.greenLight,
                },
              ]}>
              <Text style={styles.textButton}>ยืนยัน</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: normalize(17),
          backgroundColor: colors.white,
        }}>
        <Text style={styles.error}>{couponInfo.err}</Text>
      </View>

      {loading ? (
        <View
          style={{
            height: '100%',
            marginTop: 10,
          }}>
          <LoadingSkeletonCoupon />
        </View>
      ) : (
        <View
          style={{
            height: '100%',
            backgroundColor: colors.bgGreen,
          }}>
          <FlatList
            contentContainerStyle={{
              padding: 16,
            }}
            data={data}
            ListFooterComponent={<View style={{ height: normalize(250) }} />}
            onScrollEndDrag={onScrollEnd}
            renderItem={({ item }) =>
              item.passCondition! ? (
                <View
                  style={{
                    paddingBottom: normalize(10),
                  }}>
                  <CouponCardUsed
                    id={item.promotion.id}
                    couponCode={
                      item.promotion.promotionType === 'ONLINE'
                        ? item.promotion.couponCode
                        : item.offlineCode!
                    }
                    couponName={item.promotion.couponName}
                    couponType={item.promotion.couponType}
                    promotionType={item.promotion.promotionType}
                    promotionStatus={item.promotion.promotionStatus}
                    discountType={item.promotion.discountType}
                    discount={item.promotion.discount}
                    count={item.promotion.count}
                    keep={item.promotion.keep}
                    used={item.promotion.used}
                    startDate={item.promotion.startDate}
                    expiredDate={item.promotion.expiredDate}
                    description={item.promotion.description}
                    condition={item.promotion.condition}
                    conditionSpecificFarmer={
                      item.promotion.conditionSpecificFarmer
                    }
                    couponConditionRai={item.promotion.couponConditionRai}
                    couponConditionRaiMin={item.promotion.couponConditionRaiMin}
                    couponConditionRaiMax={item.promotion.couponConditionRaiMax}
                    couponConditionService={
                      item.promotion.couponConditionService
                    }
                    couponConditionServiceMin={
                      item.promotion.couponConditionServiceMin
                    }
                    couponConditionServiceMax={
                      item.promotion.couponConditionServiceMax
                    }
                    couponConditionPlant={item.promotion.couponConditionPlant}
                    couponConditionPlantList={
                      item.promotion.couponConditionPlantList
                    }
                    couponConditionProvince={
                      item.promotion.couponConditionProvince
                    }
                    couponConditionProvinceList={
                      item.promotion.couponConditionProvinceList
                    }
                    disabled={true}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={icons.dangercirclered}
                      style={{
                        width: normalize(20),
                        height: normalize(20),
                        marginRight: normalize(8),
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.SarabunMedium,
                        color: colors.errorText,
                        fontSize: normalize(16),
                      }}>
                      ไม่ตรงตามเงื่อนไขที่สามารถใช้คูปองได้
                    </Text>
                  </View>
                </View>
              ) : (
                <CouponCardUsed
                  id={item.promotion.id}
                  couponCode={
                    item.promotion.promotionType === 'ONLINE'
                      ? item.promotion.couponCode
                      : item.offlineCode!
                  }
                  couponName={item.promotion.couponName}
                  couponType={item.promotion.couponType}
                  promotionType={item.promotion.promotionType}
                  promotionStatus={item.promotion.promotionStatus}
                  discountType={item.promotion.discountType}
                  discount={item.promotion.discount}
                  count={item.promotion.count}
                  keep={item.promotion.keep}
                  used={item.promotion.used}
                  startDate={item.promotion.startDate}
                  expiredDate={item.promotion.expiredDate}
                  description={item.promotion.description}
                  condition={item.promotion.condition}
                  conditionSpecificFarmer={
                    item.promotion.conditionSpecificFarmer
                  }
                  couponConditionRai={item.promotion.couponConditionRai}
                  couponConditionRaiMin={item.promotion.couponConditionRaiMin}
                  couponConditionRaiMax={item.promotion.couponConditionRaiMax}
                  couponConditionService={item.promotion.couponConditionService}
                  couponConditionServiceMin={
                    item.promotion.couponConditionServiceMin
                  }
                  couponConditionServiceMax={
                    item.promotion.couponConditionServiceMax
                  }
                  couponConditionPlant={item.promotion.couponConditionPlant}
                  couponConditionPlantList={
                    item.promotion.couponConditionPlantList
                  }
                  couponConditionProvince={
                    item.promotion.couponConditionProvince
                  }
                  couponConditionProvinceList={
                    item.promotion.couponConditionProvinceList
                  }
                  couponOfflineCode={item.promotion.couponOfflineCode}
                  disabled={false}
                  callback={async () => {
                    PlotDatasource.getCalculatePrice({
                      farmerPlotId: conditionCheck.farmerPlotId,
                      couponCode:
                        item.promotion.promotionType === 'ONLINE'
                          ? item.promotion.couponCode
                          : item.offlineCode!,
                      cropName: conditionCheck.cropName,
                      raiAmount: conditionCheck.raiAmount,
                    }).then(res => {
                      console.log('callback', JSON.stringify(res, null, 2));

                      mixpanel.track('UseCouponScreen_UseCouponButton_tapped', {
                        couponCode: item.promotion.couponCode,
                        type: item.promotion.promotionType,
                        cropName: conditionCheck.cropName,
                        raiAmount: conditionCheck.raiAmount,
                        couponName: item.promotion.couponName,
                        discountType: item.promotion.discountType,
                        discount: res.responseData.priceCouponDiscount,
                        netPrice: res.responseData.netPrice,
                      });
                      setCoupon({
                        id: item.id,
                        promotionId: item.promotionId,
                        couponCode:
                          item.promotion.promotionType === 'ONLINE'
                            ? item.promotion.couponCode
                            : item.offlineCode!,
                        promotionType: item.promotion.promotionType,
                        name: item.promotion.couponName,
                        discountType: item.promotion.discountType,
                        discount: res.responseData.priceCouponDiscount,
                        netPrice: res.responseData.netPrice,
                        err: '',
                      });
                      navigation.goBack();
                    });
                  }}
                />
              )
            }
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </>
  );
};

export default UseCouponScreen;

const styles = StyleSheet.create({
  searchCode: {
    backgroundColor: colors.white,
    paddingHorizontal: normalize(17),
    paddingVertical: normalize(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    flex: 5,
    height: normalize(50),
    padding: normalize(10),
    backgroundColor: colors.grayBg,
    borderRadius: normalize(8),
    fontFamily: fonts.SarabunMedium,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  searchButton: {
    flex: 1,
    marginLeft: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(10),
    borderRadius: normalize(6),
  },
  textButton: {
    fontFamily: fonts.SarabunMedium,
    fontSize: normalize(16),
    color: colors.white,
  },
  error: {
    fontFamily: fonts.SarabunMedium,
    fontSize: normalize(16),
    paddingBottom: normalize(10),
    color: colors.error,
  },
});
