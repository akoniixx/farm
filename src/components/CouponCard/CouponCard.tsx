import {
  View,
  Text,
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

const CouponCard: React.FC<CouponCardEntities> = ({
  id,
  couponCode,
  couponName,
  couponType,
  promotionStatus,
  discountType,
  discount,
  count,
  keep,
  used,
  startDate,
  expiredDate,
  description,
  condition,
  specialCondition,
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
  keepthis,
  disabled,
  expired,
}) => {
  const KeepCoupon = () => {
    keepCoupon(id)
      .then(res => {
        RootNavigation.navigate('MyCouponScreen', {});
      })
      .catch(err => console.log(err));
  };
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
            discountType: discountType,
            discount: discount,
            count: count,
            keep: keep,
            used: used,
            startDate: startDate,
            expiredDate: expiredDate,
            description: description,
            condition: condition,
            specialCondition: specialCondition,
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
            keepthis: keepthis,
          },
        });
      }}>
      <View style={styles.mainCard}>
        <Image
          source={disabled ? image.couponCardDisabled : image.couponCard}
          style={styles.cardImg}
          resizeMode={'contain'}
        />
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
          <View>
            <Text
              style={{
                color: colors.fontBlack,
                fontFamily: fonts.AnuphanMedium,
                fontSize: normalize(20),
                marginBottom: normalize(10),
              }}>
              {couponName}
            </Text>
            <Text
              style={{
                color: colors.fontBlack,
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(18),
              }}>
              {checkRai(couponConditionRaiMin, couponConditionRaiMax)}
            </Text>
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(18),
                color: colors.gray,
              }}>
              หมดเขต {generateTime(expiredDate)}
            </Text>
          </View>
          {keepthis ? (
            <TouchableOpacity
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
                position: 'absolute',
                bottom: normalize(40),
                right: normalize(15),
                width: normalize(60),
                height: normalize(30),
              }}
            />
          ) : (
            <></>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    position: 'relative',
    marginBottom: normalize(15),
  },
  cardImg: {
    width: Dimensions.get('window').width - normalize(35),
    height: normalize(132),
  },
  content: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: normalize(132),
    flexDirection: 'row',
    paddingHorizontal: normalize(15),
    alignItems: 'center',
  },
});

export default CouponCard;
