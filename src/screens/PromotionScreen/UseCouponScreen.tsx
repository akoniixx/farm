import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../components/CustomHeader'
import { colors, icons } from '../../assets'
import { normalize } from '@rneui/themed'
import fonts from '../../assets/fonts'
import { getMyCoupon } from '../../datasource/PromotionDatasource'
import { MyCouponCardEntities } from '../../entites/CouponCard'
import CouponCardUsed from '../../components/CouponCard/CouponCardUsed'
import { Image } from '@rneui/base'
import { useRecoilState } from 'recoil'
import { couponState } from '../../recoil/CouponAtom'
import { PlotDatasource } from '../../datasource/PlotDatasource'

const UseCouponScreen : React.FC<any> = ({navigation,route}) => {
  const conditionCheck = route.params
  const [coupon,setCoupon] = useRecoilState(couponState);
  const [count,setCount] = useState<number>(0)
  const [page,setPage] = useState<number>(1);
  const [data,setData] = useState<MyCouponCardEntities[]>([])
  const getData = (page : number,take : number,used? : boolean)=>{
    getMyCoupon(page,take,used).then(
        res => {
            setCount(res.count)
            let Data = res.data
            Data.map((item : any,index : number)=>{
                Data[index].passCondition = checkCouponCondition( 
                    item.promotion.couponConditionRai,
                    item.promotion.couponConditionRaiMax,
                    item.promotion.couponConditionRaiMin,
                    item.promotion.couponConditionService,
                    item.promotion.couponConditionServiceMax,
                    item.promotion.couponConditionServiceMin,
                    item.promotion.couponConditionPlant,
                    item.promotion.couponConditionPlantList,
                    item.promotion.couponConditionProvince,
                    item.promotion.couponConditionProvinceList
                )
            })
            setData(Data.sort((a : any,b : any)=> a.passCondition-b.passCondition))
        }
    )
  }
  const checkCouponCondition = (
    conditionRai : boolean,
    conditionRaiMax : number,
    conditionRaiMin : number,
    conditionService : boolean,
    conditionServiceMax : number,
    conditionServiceMin : number,
    conditionPlant : boolean,
    conditionPlantList : any[],
    conditionProvince : boolean,
    conditionProvinceList : string[]
  ) : boolean => {
    let raiCheck = conditionRai;
    let serviceCheck = conditionService;
    let plantCheck = conditionPlant;
    let provinceCheck = conditionProvince;
    if(raiCheck){
        if(conditionCheck.farmAreaAmount < conditionRaiMax){
            if(conditionCheck.farmAreaAmount < conditionRaiMin){
                raiCheck = true
            }
            else{
                raiCheck = false
            }
        }
    }
    if(serviceCheck){
        if(conditionCheck.price < conditionServiceMax){
            if(conditionCheck.price < conditionServiceMin){
                serviceCheck = true
            }
            else{
                serviceCheck = false
            }
        }
    }
    if(plantCheck){
        plantCheck = !conditionPlantList.some((item : any)=> (item.plantName === conditionCheck.plantName)&&(item.injectionTiming.includes(conditionCheck.purposeSprayName)))
    }
    if(provinceCheck){
        provinceCheck = !conditionProvinceList.includes(conditionCheck.province)
    }
    let result = raiCheck||serviceCheck||plantCheck||provinceCheck;
    return result;
  }

  const onScrollEnd = ()=>{
    let pageNow = page
    if(data.length < count){
       getMyCoupon(pageNow+1,5,false).then(res => {
            let Data = res.data
            Data.map((item : any,index : number)=>{
                Data[index].passCondition = checkCouponCondition( 
                    item.promotion.couponConditionRai,
                    item.promotion.couponConditionRaiMax,
                    item.promotion.couponConditionRaiMin,
                    item.promotion.couponConditionService,
                    item.promotion.couponConditionServiceMax,
                    item.promotion.couponConditionServiceMin,
                    item.promotion.couponConditionPlant,
                    item.promotion.couponConditionPlantList,
                    item.promotion.couponConditionProvince,
                    item.promotion.couponConditionProvinceList
                )
            })
            let newData = data.concat(Data)
            setPage(pageNow+1);
            setData(newData.sort((a : any,b : any)=> a.passCondition-b.passCondition))
       }).catch(err => console.log(err))
    }
  }

  useEffect(()=>{
    getData(page,5,false)
  },[])

  return (
    <>
        <CustomHeader 
            showBackBtn
            onPressBack={()=> navigation.goBack()}
            title="คูปองส่วนลด"
        />
        <View style={styles.searchCode}>
            <TextInput 
                keyboardType="numeric" 
                placeholder='ระบุรหัสคูปองส่วนลด'
                placeholderTextColor={colors.gray}
                style={styles.searchInput}
            />
            <TouchableOpacity>
                <View style={styles.searchButton}>
                    <Text style={styles.textButton}>ยืนยัน</Text>
                </View>
            </TouchableOpacity>
        </View>
        <View style={{
            height : '100%',
            padding : normalize(17),
            backgroundColor : colors.bgGreen
        }}>
            <FlatList 
                data={data}
                onScrollEndDrag={onScrollEnd}
                renderItem={({item})=> 
                    item.passCondition!?
                    <View style={{
                        paddingBottom : normalize(10)
                    }}>
                        <CouponCardUsed 
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
                            couponConditionServiceMin={item.promotion.couponConditionServiceMin}
                            couponConditionServiceMax={item.promotion.couponConditionServiceMax}
                            couponConditionPlant={item.promotion.couponConditionPlant}
                            couponConditionPlantList={item.promotion.couponConditionPlantList}
                            couponConditionProvince={item.promotion.couponConditionProvince}
                            couponConditionProvinceList={item.promotion.couponConditionProvinceList}
                            disabled={true}
                         />
                        <View style={{
                            flexDirection : 'row',
                            alignItems : 'center'
                        }}>
                            <Image source={icons.dangercirclered} style={{
                                width : normalize(20),
                                height : normalize(20),
                                marginRight : normalize(8)
                            }} />
                        <Text style={{
                            fontFamily : fonts.SarabunMedium,
                            color : '#DE350B',
                            fontSize : normalize(16)
                        }}>ไม่ตรงตามเงื่อนไขที่สามารถใช้คูปองได้</Text>
                        </View>
                    </View>:
                    <CouponCardUsed 
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
                        couponConditionServiceMin={item.promotion.couponConditionServiceMin}
                        couponConditionServiceMax={item.promotion.couponConditionServiceMax}
                        couponConditionPlant={item.promotion.couponConditionPlant}
                        couponConditionPlantList={item.promotion.couponConditionPlantList}
                        couponConditionProvince={item.promotion.couponConditionProvince}
                        couponConditionProvinceList={item.promotion.couponConditionProvinceList}
                        disabled={false}
                        callback={async()=>{
                            PlotDatasource.getCalculatePrice({
                                farmerPlotId: conditionCheck.farmerPlotId,
                                couponCode: item.promotion.promotionType === "ONLINE" ? item.promotion.couponCode:item.offlineCode!,
                                cropName: conditionCheck.cropName,
                                raiAmount: conditionCheck.raiAmount
                            }).then(res => {
                                console.log(res)
                                setCoupon({
                                    id : item.id,
                                    promotionId : item.promotionId,
                                    couponCode : item.promotion.promotionType === "ONLINE" ? item.promotion.couponCode:item.offlineCode!,
                                    promotionType : item.promotion.promotionType,
                                    name : item.promotion.couponName,
                                    discountType : item.promotion.discountType,
                                    discount : res.responseData.priceCouponDiscount,
                                    netPrice : res.responseData.netPrice,
                                    err : ""
                                })
                                navigation.goBack()
                            })

                        }}
                     />
                }
                keyExtractor={item => item.id}
            />
        </View>
    </>
  )
}

export default UseCouponScreen

const styles = StyleSheet.create({
    searchCode : {
        backgroundColor : colors.white,
        paddingHorizontal : normalize(17),
        paddingVertical : normalize(10),
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center'
    },
    searchInput : {
        paddingVertical : normalize(15),
        paddingHorizontal : normalize(10),
        fontFamily : fonts.SarabunMedium,
        backgroundColor : colors.disable,
        fontSize : normalize(16),
        borderRadius : normalize(8),
        width : '80%'
    },
    searchButton : {
        paddingHorizontal : normalize(15),
        backgroundColor : colors.disable,
        borderRadius : normalize(8)
    },
    textButton : {
        fontFamily : fonts.SarabunMedium,
        fontSize : normalize(16),
        paddingVertical : normalize(16),
        color : colors.white
    }
})