import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomHeader from '../../components/CustomHeader';
import { getCouponUser } from '../../datasource/PromotionDatasource';
import { colors, font, image } from '../../assets';
import { normalize } from '@rneui/themed';
import CouponCard from '../../components/CouponCard/CouponCard';
import { CouponCardEntities } from '../../entites/CouponCard';
import { useFocusEffect } from '@react-navigation/native';
import { mixpanel } from '../../../mixpanel';
import LoadingSkeletonCoupon from './LoadingSkeletonCoupon';

const AllCouponScreen: React.FC<any> = ({ navigation, route }) => {
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<CouponCardEntities[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const limit = 5;

  const getData = async (page: number) => {
    setLoading(true);
    getCouponUser(page, limit)
      .then(res => {
        setCount(res?.count);
        setData(res?.data);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onScrollEnd = () => {
    let pageNow = page;
    if (data.length < count) {
      getCouponUser(pageNow + 1, limit)
        .then(res => {
          let Data = res.data;
          let newData = data.concat(Data);
          setPage(pageNow + 1);
          setData(newData);
        })
        .catch(err => {
          console.log(err.response);
        });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setPage(1);
      getData(1);
    }, []),
  );
  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    getData(1);
    setRefreshing(false);
  };

  return (
    <View>
      <CustomHeader
        title="สิทธิพิเศษทั้งหมด"
        showBackBtn
        onPressBack={() => {
          mixpanel.track('AllCouponScreen_ButtonBack_tapped');
          navigation.goBack();
        }}
      />
      <View
        style={{
          backgroundColor: colors.bgGreen,
          height: '100%',
        }}>
        {loading ? (
          <View
            style={{
              backgroundColor: colors.bgGreen,
              height: '100%',
            }}>
            <LoadingSkeletonCoupon />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{
              padding: 16,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
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
                  <Text style={styles.textEmpty}>
                    ติดตามคูปองและสิทธิพิเศษมากมาย
                  </Text>
                  <Text style={styles.textEmpty}>
                    ได้ที่หน้าโปรโมชั่น เร็วๆนี้{' '}
                  </Text>
                </View>
              </View>
            }
            onScrollEndDrag={onScrollEnd}
            data={data || []}
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
                titleButtonKeep="เก็บไว้"
              />
            )}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    </View>
  );
};

export default AllCouponScreen;

const styles = StyleSheet.create({
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
