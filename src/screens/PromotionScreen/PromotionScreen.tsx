import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors, font, icons } from '../../assets';
import { normalize } from '../../functions/Normalize';
import image from '../../assets/images/image';
import CouponCard from '../../components/CouponCard/CouponCard';
import { getCouponUser } from '../../datasource/PromotionDatasource';
import { CouponCardEntities } from '../../entites/CouponCard';
import { useIsFocused } from '@react-navigation/native';
import { mixpanel } from '../../../mixpanel';
import Text from '../../components/Text/Text';

const PromotionScreen: React.FC<any> = ({ navigation, route }) => {
  const [data, setData] = useState<CouponCardEntities[]>([]);
  const isFocused = useIsFocused();
  const getData = async () => {
    getCouponUser(1, 5)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };
  useEffect(() => {
    getData();
  }, [isFocused]);

  return (
    <View
      style={{
        backgroundColor: colors.bgGreen,
      }}>
      <View
        style={{
          position: 'relative',
        }}>
        <Image source={image.promotionbg} style={styles.promotionBg} />
        <View
          style={{
            width: '100%',
            position: 'absolute',
            top: '50%',
          }}>
          <View
            style={{
              paddingHorizontal: normalize(17),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: normalize(26),
                fontFamily: font.AnuphanBold,
                color: colors.white,
              }}>
              โปรโมชั่น
            </Text>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            top: '82%',
            marginHorizontal: normalize(12.5),
            width: Dimensions.get('screen').width - normalize(25),
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            height: normalize(56),
          }}>
          <TouchableOpacity
            style={{
              width: '48%',
              height: '100%',
            }}
            onPress={() => {
              mixpanel.track('PromotionScreen_SearchCouponButton_tapped', {
                changeTo: 'SearchCouponScreen',
              });
              navigation.navigate('SearchCouponScreen');
            }}>
            <View
              style={{
                borderRadius: normalize(10),
                borderWidth: normalize(1),
                borderColor: '#FB8705',
                height: '100%',
                backgroundColor: colors.bgOrange,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                shadowColor: '#0CDF65',
                shadowRadius: normalize(30),
              }}>
              <Image
                source={icons.tickerstar}
                style={{
                  width: normalize(20),
                  height: normalize(16),
                }}
              />
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  color: colors.fontBlack,
                  fontSize: normalize(18),
                  marginLeft: normalize(15),
                  marginRight: normalize(5),
                }}>
                ใส่เลขคูปอง
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '48%',
              height: '100%',
            }}
            onPress={() => {
              mixpanel.track('PromotionScreen_MyCouponButton_tapped', {
                changeTo: 'MyCouponScreen',
              });
              navigation.navigate('MyCouponScreen');
            }}>
            <View
              style={{
                borderRadius: normalize(10),
                borderWidth: normalize(1),
                borderColor: colors.greenLight,
                height: '100%',
                backgroundColor: '#F7FFF0',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                shadowColor: '#0CDF65',
                shadowRadius: normalize(30),
              }}>
              <Image
                source={icons.couponlogo}
                style={{
                  width: normalize(20),
                  height: normalize(16),
                }}
              />
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  color: colors.fontBlack,
                  fontSize: normalize(18),
                  marginLeft: normalize(15),
                  marginRight: normalize(5),
                }}>
                คูปองของฉัน
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inner}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: normalize(10),
          }}>
          <Text
            style={{
              fontFamily: font.AnuphanMedium,
              fontSize: normalize(22),
              color: colors.fontBlack,
            }}>
            สิทธิพิเศษ
          </Text>
          <TouchableOpacity
            onPress={() => {
              mixpanel.track('PromotionScreen_AllCouponButton_tapped', {
                changeTo: 'AllCouponScreen',
              });
              navigation.navigate('AllCouponScreen');
            }}>
            <Text
              style={{
                lineHeight: normalize(28),
                fontFamily: font.SarabunLight,
                fontSize: normalize(16),
              }}>
              ดูทั้งหมด
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {data.length !== 0 ? (
        <View
          style={{
            backgroundColor: colors.bgGreen,
          }}>
          <FlatList
            ListFooterComponent={<View style={{ height: normalize(450) }} />}
            data={data}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
            renderItem={({ item }) => (
              <CouponCard
                id={item.id}
                couponCode={item.couponCode}
                couponName={item.couponName}
                couponType={item.couponType}
                promotionStatus={item.promotionStatus}
                promotionType={item.promotionType}
                discountType={item.discountType}
                discount={item.discount}
                count={item.count}
                keep={item.keep}
                used={item.used}
                startDate={item.startDate}
                expiredDate={item.expiredDate}
                description={item.description}
                condition={item.condition}
                conditionSpecificFarmer={item.conditionSpecificFarmer}
                couponConditionRai={item.couponConditionRai}
                couponConditionRaiMin={item.couponConditionRaiMin}
                couponConditionRaiMax={item.couponConditionRaiMax}
                couponConditionService={item.couponConditionService}
                couponConditionServiceMin={item.couponConditionServiceMin}
                couponConditionServiceMax={item.couponConditionServiceMax}
                couponConditionPlant={item.couponConditionPlant}
                couponConditionPlantList={item.couponConditionPlantList}
                couponConditionProvince={item.couponConditionProvince}
                couponConditionProvinceList={item.couponConditionProvinceList}
                keepthis={true}
                disabled={false}
              />
            )}
            keyExtractor={item => item.id}
          />
        </View>
      ) : (
        <View style={styles.empty}>
          <Image
            source={image.empty_coupon}
            style={{ width: 130, height: 122 }}
          />
          <View
            style={{
              alignItems: 'center',
              alignContent: 'center',
              paddingVertical: 10,
            }}>
            <Text style={styles.textEmpty}>ติดตามคูปองและสิทธิพิเศษมากมาย</Text>
            <Text style={styles.textEmpty}>ได้ที่หน้าโปรโมชั่น เร็วๆนี้ </Text>
          </View>
        </View>
      )}
    </View>
  );
};
export default PromotionScreen;

const styles = StyleSheet.create({
  inner: {
    backgroundColor: colors.bgGreen,
    marginTop: normalize(50),
    paddingHorizontal: normalize(17),
  },
  container: {
    flex: 1,
  },
  promotionBg: {
    width: '100%',
    height: normalize(140),
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    display: 'flex',
    paddingVertical: '50%',
  },
  textEmpty: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    paddingVertical: 2,
    color: colors.gray,
    alignItems: 'center',
  },
});
