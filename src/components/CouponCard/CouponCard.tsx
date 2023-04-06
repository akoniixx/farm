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
  couponOfflineCode,
  keepthis,
  disabled,
  expired,
}) => {
  const KeepCoupon = () => {
    if(promotionType === "ONLINE"){
      keepCoupon(id)
        .then(res => {
          RootNavigation.navigate('MyCouponScreen', {});
        })
        .catch(err => console.log(err));
    }
    else{
      keepCoupon(id,couponOfflineCode![0].couponCode)
      .then(res => {
        RootNavigation.navigate('MyCouponScreen', {});
      })
      .catch(err => console.log(err));
    }
  };
  console.log(new Date(expiredDate).getTime(),new Date().getTime())
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
            promotionType : promotionType,
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
      <View style={
        [
          styles.mainCard,
          {
            backgroundColor : disabled ? colors.disable: (new Date(expiredDate).getTime()-new Date().getTime() > 604800000)?colors.white : colors.bgOrange,
            borderColor : disabled ? colors.disable: (new Date(expiredDate).getTime()-new Date().getTime() > 604800000)?"#7BE0A6" : "#FDC382",
            borderWidth : normalize(2)
          }
        ]}>
        <View style={{
          position : 'absolute',
          top : normalize(-3.5),
          right : normalize(80),
        }}>
          <Image source={image.substractbottom} style={{
            width : normalize(20),
            height : normalize(10)
          }}/>
        </View>
        <View style={{
          position : 'absolute',
          bottom : normalize(-3.5),
          right : normalize(80),
        }}>
          <Image source={image.substracttop} style={{
            width : normalize(20),
            height : normalize(10)
          }}/>
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
          <View>
            <Text
              style={{
                color: colors.fontBlack,
                fontFamily: fonts.AnuphanMedium,
                fontSize: normalize(20),
                marginBottom: normalize(5),
              }}>
              {couponName}
            </Text>
            {
               checkRai(couponConditionRaiMin, couponConditionRaiMax) != ""?
               <Text
                style={{
                  color: colors.fontBlack,
                  fontFamily: fonts.SarabunLight,
                  fontSize: normalize(18),
                  marginBottom: normalize(5),
                }}>
                {checkRai(couponConditionRaiMin, couponConditionRaiMax)}
              </Text>:
              <></>
            }
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(18),
                color: new Date(expiredDate).getTime()-new Date().getTime() > 604800000 ? colors.gray : colors.error,
              }}>
              {new Date(expiredDate).getTime()-new Date().getTime() > 604800000 ? `ใช้ได้ถึง ${generateTime(expiredDate)}` : `เหลือเวลาใช้อีก ${((new Date(expiredDate).getTime()-new Date().getTime())/86400000).toFixed(0)} วัน`}
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
    paddingVertical : normalize(20),
    paddingHorizontal : normalize(10),
    minHeight : normalize(121),
    borderRadius : normalize(12),
    marginVertical : normalize(10),
    position : 'relative',
    justifyContent : 'center',
    alignItems : 'center'
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

export default CouponCard;
