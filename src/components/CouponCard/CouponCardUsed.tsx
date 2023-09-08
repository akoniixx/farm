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
import Text from '../Text/Text';
import moment from 'moment';

const CouponCardUsed: React.FC<CouponCardEntities> = ({
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
  disabled,
  callback,
}) => {
  const onPressCoupon = () => {
    RootNavigation.navigate('CouponDetail', {
      detail: {
        id: id,
        couponCode: couponCode,
        couponName: couponName,
        couponType: couponType,
        promotionStatus: promotionStatus,
        promotionType: promotionType,
        discountType: discountType,
        discount: discount,
        count: count,
        keep: keep,
        used: used,
        startDate: startDate,
        expiredDate: expiredDate,
        description: description,
        condition: condition,
        conditionSpecificFarmer: conditionSpecificFarmer,
        couponConditionRai: couponConditionRai,
        couponConditionRaiMin: couponConditionRaiMin,
        couponConditionRaiMax: couponConditionRaiMax,
        couponConditionService: couponConditionService,
        couponConditionServiceMin: couponConditionServiceMin,
        couponConditionServiceMax: couponConditionServiceMax,
        couponConditionPlant: couponConditionPlant,
        couponConditionPlantList: couponConditionPlantList,
        couponConditionProvince: couponConditionProvince,
        couponConditionProvinceList: couponConditionProvinceList,
      },
    });
  };
  return (
    <TouchableOpacity
      onPress={onPressCoupon}
      style={{
        marginBottom: 8,
      }}>
      {/* <View
        style={[
          styles.mainCard,
          {
            backgroundColor:
              new Date(expiredDate).getTime() - new Date().getTime() > 604800000
                ? colors.white
                : colors.bgOrange,
            borderColor:
              new Date(expiredDate).getTime() - new Date().getTime() > 604800000
                ? colors.grey20
                : '#FDC382',
            borderWidth: normalize(2),
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
              new Date(expiredDate).getTime() - new Date().getTime() > 604800000
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
              new Date(expiredDate).getTime() - new Date().getTime() > 604800000
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
              height: normalize(48),
              width: normalize(48),
              borderRadius: normalize(24),
              backgroundColor: colors.bgGreen,
              marginRight: normalize(20),
            }}>
            <Image
              source={icons.injectionicon}
              style={{
                width: normalize(17),
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
            {couponConditionProvinceList &&
            couponConditionProvinceList!.length === 1 ? (
              <Text
                style={{
                  color: colors.fontBlack,
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(20),
                  marginBottom: normalize(5),
                }}>
                {`(${couponConditionProvinceList![0]})`}
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
            {checkRai(couponConditionRaiMin!, couponConditionRaiMax!) != '' ? (
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
                  604800000
                    ? colors.gray
                    : colors.error,
              }}>
              {new Date(expiredDate).getTime() - new Date().getTime() >
              604800000
                ? `ใช้ได้ถึง ${generateTime(expiredDate)}`
                : `เหลือเวลาใช้อีก ${(
                    (new Date(expiredDate).getTime() - new Date().getTime()) /
                    86400000
                  ).toFixed(0)} วัน`}
            </Text>
          </View>
          <TouchableOpacity
            disabled={disabled}
            onPress={callback}
            style={{
              position: 'absolute',
              right: normalize(5),
            }}>
            <View
              style={{
                backgroundColor: disabled ? colors.disable : colors.greenLight,
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
                ใช้งาน
              </Text>
            </View>
          </TouchableOpacity>
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
              backgroundColor: disabled
                ? colors.greyDivider
                : moment(expiredDate).diff(moment(), 'days') > 7 || disabled
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
                  marginTop: 2,
                  fontFamily: fonts.SarabunLight,
                  fontSize: 14,
                  color:
                    moment(expiredDate).diff(moment(), 'days') > 7 || disabled
                      ? colors.gray
                      : colors.errorText,
                }}>
                {moment(expiredDate).diff(moment(), 'days') > 7 || disabled
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
                minWidth: 40,
              }}>
              <TouchableOpacity
                disabled={disabled}
                onPress={callback}
                style={{
                  right: normalize(16),
                }}>
                <View
                  style={
                    disabled ? styles.buttonKeepDisable : styles.buttonKeep
                  }>
                  <Text
                    style={
                      disabled
                        ? styles.buttonKeepTextDisable
                        : styles.buttonKeepText
                    }>
                    ใช้งาน
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
  buttonKeep: {
    backgroundColor: colors.greenLight,
    borderRadius: 4,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(6),
  },
  buttonKeepText: {
    color: colors.white,
    fontSize: normalize(16),
    fontFamily: fonts.AnuphanBold,
  },
  buttonKeepTextDisable: {
    color: colors.greyDivider,
    fontSize: normalize(16),
    fontFamily: fonts.AnuphanBold,
  },
  buttonKeepDisable: {
    backgroundColor: colors.disable,
    borderRadius: 4,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(6),
  },
});

export default CouponCardUsed;
