import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../assets'
import CustomHeader from '../../components/CustomHeader'
import PromotionTabNavigator from '../../navigations/TopTabs/PromotionTabNavigator'
import { stylesCentral } from '../../styles/StylesCentral'
import { normalize } from '../../functions/Normalize'
import { MainButton } from '../../components/Button/MainButton'

const MyCouponScreen: React.FC<any> = ({navigation,route}) => {
  return (
    <>
      <View style={stylesCentral.container}>
        <CustomHeader
          backgroundColor={colors.greenLight}
          titleColor={colors.white}
          title="คูปองของฉัน"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <PromotionTabNavigator />
      </View>
    </>
  )
}

export default MyCouponScreen

const styles = StyleSheet.create({
    appBar : {
        backgroundColor : colors.greenLight
    },
})