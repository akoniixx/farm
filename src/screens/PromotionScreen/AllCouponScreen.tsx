import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../components/CustomHeader'
import { getCouponUser } from '../../datasource/PromotionDatasource';
import { colors } from '../../assets';
import { normalize } from '@rneui/themed';
import CouponCard from '../../components/CouponCard/CouponCard';
import { CouponCardEntities } from '../../entites/CouponCard';
import { useFocusEffect } from '@react-navigation/native';

const AllCouponScreen : React.FC<any> = ({navigation,route}) => {
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<CouponCardEntities[]>([]);

  const getData = async (page : number) => {
    getCouponUser(page, 5)
      .then(res => {
        setCount(res.count)
        setData(res.data)
      })
      .catch(err => console.log(err));
  };

  const onScrollEnd = ()=>{
    let pageNow = page
    if(data.length < count){
        getCouponUser(pageNow+1,5).then(res => {
            let Data = res.data
            let newData = data.concat(Data)
            setPage(pageNow+1);
            setData(newData)
       }).catch(err => console.log(err))
    }
  }

  useEffect(() => {
    getData(page);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setPage(1)
      getData(1)
    }, []),
  );

  return (
    <View>
        <CustomHeader
          title="สิทธิพิเศษทั้งหมด"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <View
          style={{
            backgroundColor: colors.bgGreen,
            paddingHorizontal: normalize(17),
          }}>
          <FlatList
            onScrollEndDrag={onScrollEnd}
            ListFooterComponent={<View style={{ height: normalize(450) }} />}
            data={data}
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
    </View>
  )
}

export default AllCouponScreen

const styles = StyleSheet.create({})