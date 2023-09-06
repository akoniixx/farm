import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, font } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { normalize } from '@rneui/themed';
import HTML from 'react-native-render-html';
import { generateYearTime } from '../../functions/DateTime';
import LinearGradient from 'react-native-linear-gradient';
import { MainButton } from '../../components/Button/MainButton';
import { checkRaiFull } from '../../functions/CheckRai';
import { checkService } from '../../functions/CheckServicePrice';
import {
  checkMyCoupon,
  keepCoupon,
} from '../../datasource/PromotionDatasource';
import CouponCardHeader from '../../components/CouponCard/CouponCardHeader';
import { useFocusEffect } from '@react-navigation/native';
import { mixpanel } from '../../../mixpanel';
import Text from '../../components/Text/Text';

const CouponDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const { detail } = route.params;

  const [canKeep, setCanKeep] = useState(false);
  const [disable, setDisable] = useState(false);
  const checkCoupon = () => {
    checkMyCoupon(detail.couponCode).then(res => {
      if (!res.userMessage) {
        setCanKeep(false);
      } else {
        setCanKeep(true);
      }
    });
  };

  const KeepCoupon = () => {
    setDisable(true);
    keepCoupon(detail.id)
      .then(() => {
        setDisable(false);
        mixpanel.track('CouponDetailScreen_KeepCouponButton_tapped', {
          ...detail,
          changeTo: 'MyCouponScreen',
        });
        navigation.navigate('MyCouponScreen');
      })
      .catch(err => console.log(err))
      .finally(() => {
        setDisable(false);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      checkCoupon();
    }, []),
  );
  return (
    <>
      <View style={styles.appBar}>
        <CustomHeader
          backgroundColor={colors.greenLight}
          titleColor={colors.white}
          title="รายละเอียดของคูปอง"
          showBackBtn
          onPressBack={() => {
            mixpanel.track('CouponDetailScreen_BackButton_tapped');
            navigation.goBack();
          }}
        />
        <View style={styles.appBarCard}>
          <CouponCardHeader
            id={detail.id}
            couponCode={detail.couponCode}
            couponName={detail.couponName}
            couponType={detail.couponType}
            promotionType={detail.promotionType}
            promotionStatus={detail.promotionStatus}
            discountType={detail.discountType}
            discount={detail.discount}
            count={detail.count}
            keep={detail.keep}
            used={detail.used}
            startDate={detail.startDate}
            expiredDate={detail.expiredDate}
            description={detail.description}
            condition={detail.condition}
            conditionSpecificFarmer={detail.conditionSpecificFarmer}
            couponConditionRai={detail.couponConditionRai}
            couponConditionRaiMin={detail.couponConditionRaiMin}
            couponConditionRaiMax={detail.couponConditionRaiMax}
            couponConditionService={detail.couponConditionService}
            couponConditionServiceMin={detail.couponConditionServiceMin}
            couponConditionServiceMax={detail.couponConditionServiceMax}
            couponConditionPlant={detail.couponConditionPlant}
            couponConditionPlantList={detail.couponConditionPlantList}
            couponConditionProvince={detail.couponConditionProvince}
            couponConditionProvinceList={detail.couponConditionProvinceList}
            keepthis={false}
          />
        </View>
      </View>
      <ScrollView
        style={{
          backgroundColor: colors.white,
        }}>
        {canKeep ? (
          <View
            style={{
              backgroundColor: '#F7FFF0',
              padding: normalize(17),
            }}>
            <View style={styles.couponRemain}>
              <Text style={styles.header}>คูปองเหลือ</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[styles.header, { color: colors.orange }]}>
                  {detail.keep}
                </Text>
                <Text style={styles.header}> / {detail.count} สิทธิ</Text>
              </View>
            </View>
            <View style={styles.couponScale}>
              <LinearGradient
                colors={['#FB8705', '#FFCF75']}
                start={{ x: 0.14, y: 0.85 }}
                style={[
                  styles.couponScore,
                  { width: `${(detail.keep / detail.count) * 100}%` },
                ]}
              />
            </View>
          </View>
        ) : (
          <></>
        )}
        <View style={styles.content}>
          <Text style={[styles.header, { paddingBottom: normalize(10) }]}>
            ช่วงเวลาที่ใช้งานได้
          </Text>
          <Text style={styles.description}>
            {generateYearTime(detail.startDate) +
              ' ถึง ' +
              generateYearTime(detail.expiredDate)}
          </Text>
          <Text style={styles.header}>รายละเอียด</Text>
          <HTML
            source={{ html: detail.description }}
            contentWidth={Dimensions.get('screen').width}
            tagsStyles={htmlStyle}
          />
          <Text style={styles.header}>เงื่อนไข</Text>
          <HTML
            source={{ html: detail.condition }}
            contentWidth={Dimensions.get('screen').width}
            tagsStyles={htmlStyle}
          />
          <Text style={[styles.header, { paddingBottom: normalize(10) }]}>
            เงื่อนไขการใช้คูปอง
          </Text>
          {detail.couponConditionRai ? (
            <View
              style={{
                paddingHorizontal: normalize(15),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={styles.description}>{`\u2022  ${checkRaiFull(
                detail.couponConditionRaiMin,
                detail.couponConditionRaiMax,
              )}`}</Text>
            </View>
          ) : (
            <></>
          )}
          {detail.couponConditionService ? (
            <View
              style={{
                paddingHorizontal: normalize(15),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={[styles.description]}>{`\u2022  ${checkService(
                detail.couponConditionServiceMin,
                detail.couponConditionServiceMax,
              )}`}</Text>
            </View>
          ) : (
            <></>
          )}
          {detail.couponConditionPlant ? (
            <View
              style={{
                paddingHorizontal: normalize(15),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  styles.description,
                ]}>{`\u2022  พืชที่ใช้คูปอง ${detail.couponConditionPlantList?.map(
                (item: any) =>
                  item.plantName + ' ' + '(' + item.injectionTiming + ') ',
              )}`}</Text>
            </View>
          ) : (
            <></>
          )}
          {detail.couponConditionProvince ? (
            <View
              style={{
                paddingHorizontal: normalize(15),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  styles.description,
                ]}>{`\u2022  จังหวัด ${detail.couponConditionProvinceList?.map(
                (item: string) => item + ' ',
              )}`}</Text>
            </View>
          ) : (
            <View
              style={{
                paddingHorizontal: normalize(15),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={[styles.description]}>{`\u2022  ใช้ได้ทุกจังหวัด`}</Text>
            </View>
          )}
        </View>
      </ScrollView>
      {canKeep ? (
        <View
          style={{
            padding: normalize(17),
            backgroundColor: colors.white,
          }}>
          <MainButton
            label="เก็บคูปอง"
            disable={disable}
            color={colors.greenLight}
            onPress={KeepCoupon}
          />
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: colors.greenLight,
  },
  appBarCard: {
    paddingHorizontal: normalize(17),
  },
  header: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  description: {
    fontFamily: font.SarabunLight,
    color: colors.grey60,
    fontSize: normalize(18),
  },
  content: {
    paddingHorizontal: normalize(17),
    paddingVertical: normalize(20),
  },
  couponRemain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: normalize(17),
  },
  couponScale: {
    width: '100%',
    height: normalize(10),
    borderRadius: normalize(5),
    backgroundColor: '#F2F3F4',
    position: 'relative',
  },
  couponScore: {
    height: normalize(10),
    borderRadius: normalize(5),
    backgroundColor: colors.orange,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

const htmlStyle = {
  ul: {
    fontFamily: font.SarabunLight,
    color: colors.grey60,
    fontSize: normalize(18),
  },
  p: {
    fontFamily: font.SarabunLight,
    color: colors.grey60,
    fontSize: normalize(18),
  },
  span: {
    fontFamily: font.SarabunLight,
    color: colors.grey60,
    fontSize: normalize(18),
  },
  ol: {
    fontFamily: font.SarabunLight,
    color: colors.grey60,
    fontSize: normalize(18),
  },
  li: {
    fontFamily: font.SarabunLight,
    color: colors.grey60,
    fontSize: normalize(18),
  },
};

export default CouponDetailScreen;
