import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomHeader from '../../components/CustomHeader'
import { colors } from '../../assets'
import { normalize } from '@rneui/themed'
import fonts from '../../assets/fonts'

const UseCouponScreen : React.FC<any> = ({navigation,route}) => {
  const obj = route.params
  console.log(obj)
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
                data={[]}
                renderItem={()=><></>}
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