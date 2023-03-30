import { Switch } from '@rneui/themed';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons } from '../../assets';
import { stylesCentral } from '../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from '@rneui/base';
import { normalize, width } from '../../functions/Normalize';
import image from '../../assets/images/image';
import CustomHeader from '../../components/CustomHeader';
import { MainButton } from '../../components/Button/MainButton';
import CouponCard from '../../components/CouponCard/CouponCard';
import { getCouponUser } from '../../datasource/PromotionDatasource';
import { CouponCardEntities } from '../../entites/CouponCard';
import { useIsFocused } from '@react-navigation/native';

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
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('SearchCouponScreen')}>
                <Image
                  source={icons.searchPromotion}
                  style={{
                    width: normalize(23),
                    height: normalize(23),
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('MyCouponScreen')}
          style={{
            position: 'absolute',
            top: '82%',
            marginHorizontal: normalize(12.5),
            width: Dimensions.get('screen').width - normalize(25),
            height: normalize(56),
          }}>
          <View
            style={{
              borderRadius: normalize(10),
              borderWidth: normalize(1),
              borderColor: colors.greenLight,
              width: '100%',
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
            <Image
              source={icons.arrowRigth}
              style={{
                width: normalize(20),
                height: normalize(20),
              }}
            />
          </View>
        </TouchableOpacity>
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
          <TouchableOpacity>
            <Text
              style={{
                fontFamily: font.SarabunLight,
                fontSize: normalize(16),
              }}>
              ดูทั้งหมด
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {data.length != 0 ? (
        <View
          style={{
            backgroundColor: colors.bgGreen,
            paddingHorizontal: normalize(17),
          }}>
          <FlatList
            ListFooterComponent={<View style={{ height: normalize(450) }} />}
            data={data}
            renderItem={({ item }) => (
              <CouponCard
                id={item.id}
                couponCode={item.couponCode}
                couponName={item.couponName}
                couponType={item.couponType}
                promotionStatus={item.promotionStatus}
                discountType={item.discountType}
                discount={item.discount}
                count={item.count}
                keep={item.keep}
                used={item.used}
                startDate={item.startDate}
                expiredDate={item.expiredDate}
                description={item.description}
                condition={item.condition}
                specialCondition={item.specialCondition}
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
