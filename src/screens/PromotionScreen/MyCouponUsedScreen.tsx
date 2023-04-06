import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { normalize } from '@rneui/themed';
import { useIsFocused } from '@react-navigation/native';
import { MyCouponCardEntities } from '../../entites/CouponCard';
import { getMyCoupon } from '../../datasource/PromotionDatasource';
import { colors, font, image } from '../../assets';
import CouponCard from '../../components/CouponCard/CouponCard';

const MyCouponUsedScreen: React.FC<any> = () => {
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<MyCouponCardEntities[]>([]);
  const isFocused = useIsFocused();
  const getData = (page: number, take: number, used?: boolean) => {
    getMyCoupon(page, take, used).then(res => {
      setCount(res.count);
      setData(res.data);
    });
  };
  useEffect(() => {
    getData(page, 5, true);
  }, []);

  const onScrollEnd = ()=>{
    let pageNow = page
    if(data.length < count){
      getMyCoupon(pageNow+1, 5, true).then(res => {
        let newData = data.concat(res.data)
        setPage(pageNow+1)
        setData(newData)
      })
    }
  }
  return (
    <>
      {data.length != 0 ? (
        <View
          style={{
            padding: normalize(17),
            backgroundColor : colors.bgGreen
          }}>
          <FlatList
            onScrollEndDrag={onScrollEnd}
            data={data}
            renderItem={({ item }) => (
              <CouponCard
                id={item.promotion.id}
                couponCode={item.promotion.couponCode}
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
                specialCondition={item.promotion.specialCondition}
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
                couponConditionProvince={item.promotion.couponConditionProvince}
                couponConditionProvinceList={
                  item.promotion.couponConditionProvinceList
                }
                keepthis={false}
                disabled={true}
              />
            )}
            keyExtractor={item => item.promotion.id}
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
            <Text style={styles.textEmpty}>ไม่มีคูปองที่ใช้แล้ว</Text>
            <Text style={styles.textEmpty}>ติดตามคูปองและสิทธิพิเศษมากมาย</Text>
            <Text style={styles.textEmpty}>ได้ที่หน้าโปรโมชั่น เร็วๆนี้ </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default MyCouponUsedScreen;

const styles = StyleSheet.create({
  main: {
    padding: normalize(17),
  },
  empty: {
    width : '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    display: 'flex',
    paddingVertical: '50%',
    backgroundColor : colors.bgGreen,
    height : '100%'
  },
  textEmpty: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    paddingVertical: 2,
    color: colors.gray,
    alignItems: 'center',
  },
});
