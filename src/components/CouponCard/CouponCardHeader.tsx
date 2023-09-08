import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import { normalize } from '@rneui/themed';
import { colors, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { checkRai } from '../../functions/CheckRai';
import { generateTime } from '../../functions/DateTime';
import { CouponCardEntities } from '../../entites/CouponCard';
import * as RootNavigation from '../../navigations/RootNavigation';
import { keepCoupon } from '../../datasource/PromotionDatasource';
import { width } from '../../functions/Normalize';
import Text from '../Text/Text';
import moment from 'moment';

const CouponCardHeader: React.FC<CouponCardEntities> = ({
  id,
  couponCode,
  couponName,
  couponType,
  promotionStatus,
  promotionType,
  discountType,
  discount,
  count,
  keep,
  used,
  startDate,
  expiredDate,
  description,
  condition,
  conditionSpecificFarmer,
  couponConditionRai,
  couponConditionRaiMin,
  couponConditionRaiMax,
  couponConditionService,
  couponConditionServiceMin,
  couponConditionServiceMax,
  couponConditionPlant,
  couponConditionPlantList,
  couponConditionProvince,
  couponConditionProvinceList,
  couponOfflineCode,
  keepthis,
  disabled,
  expired,
}) => {
  const KeepCoupon = () => {
    if (promotionType === 'ONLINE') {
      keepCoupon(id)
        .then(res => {
          RootNavigation.navigate('MyCouponScreen', {});
        })
        .catch(err => console.log(err));
    } else {
      keepCoupon(id, couponOfflineCode![0].couponCode)
        .then(res => {
          RootNavigation.navigate('MyCouponScreen', {});
        })
        .catch(err => console.log(err));
    }
  };
  return (
    <View
      style={{
        marginBottom: 16,
      }}>
      <View>
        {/* <View
      style={[
        styles.mainCard,
        {
          backgroundColor: disabled
            ? colors.grey10
            : new Date(expiredDate).getTime() - new Date().getTime() >
                604800000 || disabled
            ? colors.white
            : colors.bgOrange,
          borderColor: disabled
            ? colors.grey5
            : new Date(expiredDate).getTime() - new Date().getTime() >
                604800000 || disabled
            ? colors.grey20
            : '#FDC382',
          borderWidth: normalize(1),
        },
      ]}>
      <View
        style={{
          position: 'absolute',
          top: -2,
          right: normalize(80),
        }}>
        <Image
          source={
            expired
              ? icons.halfcircle1
              : new Date(expiredDate).getTime() - new Date().getTime() >
                  604800000 || disabled
              ? icons.halfcircle1
              : icons.halfcircleorange1
          }
          style={{
            width: normalize(20),
            height: normalize(10),
          }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: -2,
          right: normalize(80),
        }}>
        <Image
          source={
            expired
              ? icons.halfcircle2
              : new Date(expiredDate).getTime() - new Date().getTime() >
                  604800000 || disabled
              ? icons.halfcircle2
              : icons.halfcircleorange2
          }
          style={{
            width: normalize(20),
            height: normalize(10),
          }}
        />
      </View>
      <View style={styles.content}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: normalize(60),
            width: normalize(60),
            borderRadius: normalize(30),
            backgroundColor:
              couponType === 'INJECTION' ? colors.bgGreen : colors.bgOrange,
            marginRight: normalize(20),
          }}>
          <Image
            source={
              couponType === 'INJECTION'
                ? icons.injectionicon
                : icons.drugicon
            }
            style={{
              width:
                couponType === 'INJECTION' ? normalize(32) : normalize(38),
              height: normalize(30),
            }}
          />
        </View>
        <View
          style={{
            width: width * 0.45,
          }}>
          <Text
            numberOfLines={1}
            style={{
              color: colors.fontBlack,
              fontFamily: fonts.AnuphanMedium,
              fontSize: normalize(20),
              marginBottom: normalize(5),
            }}>
            {couponName}
          </Text>
          {couponConditionProvince &&
          couponConditionProvinceList?.length === 1 ? (
            <Text
              style={{
                color: colors.fontBlack,
                fontFamily: fonts.AnuphanMedium,
                fontSize: normalize(20),
                marginBottom: normalize(5),
              }}>
              {`(${couponConditionProvinceList[0]})`}
            </Text>
          ) : (
            <></>
          )}
          {couponCode && (
            <Text
              style={{
                color: colors.fontBlack,
                marginBottom: 4,
              }}>
              {couponCode}
            </Text>
          )}
          {couponConditionRai &&
          checkRai(couponConditionRaiMin!, couponConditionRaiMax!) !== '' ? (
            <Text
              style={{
                color: colors.fontBlack,
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(18),
                marginBottom: normalize(5),
              }}>
              {checkRai(couponConditionRaiMin!, couponConditionRaiMax!)}
            </Text>
          ) : (
            <></>
          )}
          <Text
            style={{
              fontFamily: fonts.SarabunLight,
              fontSize: normalize(18),
              color:
                new Date(expiredDate).getTime() - new Date().getTime() >
                  604800000 || disabled
                  ? colors.gray
                  : colors.error,
            }}>
            {expired
              ? `ใช้ได้ถึง ${generateTime(expiredDate)}`
              : new Date(expiredDate).getTime() - new Date().getTime() >
                  604800000 || disabled
              ? `ใช้ได้ถึง ${generateTime(expiredDate)}`
              : `เหลือเวลาใช้อีก ${(
                  (new Date(expiredDate).getTime() - new Date().getTime()) /
                  86400000
                ).toFixed(0)} วัน`}
          </Text>
        </View>
        {keepthis ? (
          <TouchableOpacity
            disabled={disabledBtn}
            onPress={KeepCoupon}
            style={{
              position: 'absolute',
              right: normalize(15),
            }}>
            <View
              style={{
                backgroundColor: colors.greenLight,
                borderRadius: normalize(10),
                paddingHorizontal: normalize(10),
                paddingVertical: normalize(6),
                marginLeft: normalize(30),
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: normalize(16),
                  fontFamily: fonts.AnuphanMedium,
                }}>
                เก็บ
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <></>
        )}
        {expired ? (
          <Image
            source={image.expired}
            style={{
              width: normalize(60),
              height: normalize(30),
              position: 'absolute',
              right: normalize(10),
            }}
          />
        ) : (
          <></>
        )}
      </View>
    </View> */}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            height: 100,
            shadowColor: '#000',
            shadowOffset: {
              width: 1,
              height: 3,
            },
            shadowOpacity: 0.05,
            shadowRadius: 0.1,
            elevation: 3,
          }}>
          <Image
            source={image.couponHeader}
            style={{
              height: 100,
              width: 80,
            }}
          />
          <View
            style={[
              styles.mainCard,
              {
                backgroundColor:
                  moment(expiredDate).diff(moment(), 'days') > 7 || disabled
                    ? colors.white
                    : colors.bgOrange,
              },
            ]}>
            <View style={styles.content}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.fontBlack,
                    fontFamily: fonts.AnuphanMedium,
                    fontSize: 16,
                  }}>
                  {couponName}{' '}
                  {/* {couponConditionProvinceList?.[0] && (
                    <Text
                      style={{
                        color: colors.fontBlack,
                        fontFamily: fonts.AnuphanMedium,
                        fontSize: 16,
                        marginBottom: normalize(5),
                      }}>
                      {`(${couponConditionProvinceList?.[0]})`}
                    </Text>
                  )} */}
                </Text>

                {couponCode && (
                  <Text
                    style={{
                      color: colors.fontBlack,
                      fontSize: 14,
                      fontFamily: fonts.AnuphanMedium,
                    }}>
                    {couponCode}
                  </Text>
                )}
                {couponConditionRai &&
                checkRai(couponConditionRaiMin!, couponConditionRaiMax!) !==
                  '' ? (
                  <Text
                    style={{
                      color: colors.fontBlack,
                      fontFamily: fonts.SarabunLight,
                      fontSize: 14,
                      lineHeight: 24,
                    }}>
                    {checkRai(couponConditionRaiMin!, couponConditionRaiMax!)}
                  </Text>
                ) : (
                  <></>
                )}
                <Text
                  style={{
                    fontFamily: fonts.SarabunLight,
                    fontSize: 14,
                    color:
                      moment(expiredDate).diff(moment(), 'days') > 7 || disabled
                        ? colors.gray
                        : colors.errorText,
                  }}>
                  {expired
                    ? `ใช้ได้ถึง ${generateTime(expiredDate)}`
                    : moment(expiredDate).diff(moment(), 'days') > 7 || disabled
                    ? `ใช้ได้ถึง ${generateTime(expiredDate)}`
                    : `เหลือเวลาใช้อีก ${moment(expiredDate).diff(
                        moment(),
                        'days',
                      )} วัน`}
                </Text>
              </View>

              <View
                style={{
                  height: '100%',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  width: 80,
                }}
              />

              {/* {expired ? (
            <Image
              source={image.expired}
              style={{
                width: normalize(60),
                height: normalize(30),
                position: 'absolute',
                right: normalize(10),
              }}
            />
          ) : (
            <></>
          )} */}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: normalize(8),
    borderTopRightRadius: normalize(8),
    flex: 1,
  },
  cardImg: {
    width: Dimensions.get('window').width - normalize(35),
    height: normalize(132),
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: normalize(15),
    alignItems: 'center',
  },
});

export default CouponCardHeader;
