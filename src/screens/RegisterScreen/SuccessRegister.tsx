import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { normalize } from '@rneui/themed'
import { colors, font, image } from '../../assets'
import { MainButton } from '../../components/Button/MainButton'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SuccessRegister :React.FC<any> = ({navigation}) =>{
  return (
    <View style={{
        flex : 1,
        padding : normalize(30),
        justifyContent : 'space-between',
    }}>
        <View style={{
            marginTop : normalize(60),
            display : 'flex',        
            justifyContent : 'center',
            alignItems : 'center'
        }}>
            <Image source={image.onboard3} style={{
                width : normalize(263),
                height : normalize(371)
            }}/>
            <Text style={[styles.h1,{marginTop : normalize(14)}]}>ยินดีต้อนรับสู่ DnDs</Text>
            <Text style={[styles.label,{marginTop : normalize(10),textAlign : 'center'}]}>คุณลงทะเบียนนักบินโดรนกับเราเรียบร้อยแล้ว
              โปรดรอการยืนยันสถานะนักบินจากระบบ เพื่อรับงาน</Text>
        </View>
        <MainButton label='เริ่มใช้งาน' color={colors.orange} onPress={async()=>{
            await AsyncStorage.clear()
            navigation.navigate('HomeScreen')
        }}/>
    </View>
  )
}

const styles = StyleSheet.create({
    inner: {
        flex: 1,
        display : 'flex',
        justifyContent : 'space-between',
        paddingHorizontal : normalize(17),
    },
    h1: {
      fontFamily: font.medium,
      fontSize: normalize(19),
      color: colors.fontBlack,
    },
    h2: {
      fontFamily: font.medium,
      fontSize: normalize(16),
      color: colors.fontBlack,
    },
    h3:{
        fontFamily: font.medium,
        fontSize: normalize(14),
        color: colors.fontBlack,
    },
    label: {
      fontFamily: font.light,
      fontSize: normalize(14),
      color: colors.gray,
    },
})

export default SuccessRegister