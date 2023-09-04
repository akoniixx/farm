import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import { normalize } from '@rneui/themed';
import { colors, icons } from '../../assets';
import fonts from '../../assets/fonts';
import { checkRai } from '../../functions/CheckRai';
import { generateTime } from '../../functions/DateTime';
import { CouponCardEntities } from '../../entites/CouponCard';
import * as RootNavigation from '../../navigations/RootNavigation';
import { width } from '../../functions/Normalize';
import Text from '../Text/Text';

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
  return (
    <TouchableOpacity
      onPress={() => {
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
      }}>
      <View
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
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(10),
    minHeight: normalize(121),
    borderRadius: normalize(12),
    marginVertical: normalize(10),
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
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

export default CouponCardUsed;
