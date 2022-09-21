import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { normalize } from '@rneui/themed'
import { font, icons } from '../../assets'
import { stylesCentral } from '../../styles/StylesCentral'
import colors from '../../assets/colors/colors'
import { MainButton } from '../../components/Button/MainButton'

const ProfileDocument : React.FC<any> = ({navigation,route}) =>{
  const telephone = route.params.tele
  return (
    <SafeAreaView style={[stylesCentral.container]}>
        <View style={styles.appBarBack}>
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Image source={icons.arrowLeft} style={styles.listTileIcon}/>
          </TouchableOpacity>
          <Text style={[styles.appBarHeader]}>โปรไฟล์ของฉัน</Text>
          <View style={styles.listTileIcon}></View>
        </View>
        <View style={styles.body}>
            <View style={styles.content}>
                <Text style={styles.header}>สถานะบัญชีนักบินโดรน</Text>
                <Text style={styles.idcardheader}>รูปถ่ายผู้สมัคร คู่บัตรประชาชน</Text>
                    <View style={{
                      display : 'flex',
                      flexDirection : 'row',
                      justifyContent : 'space-between',
                      alignItems : 'center',
                      paddingTop : normalize(10)
                    }}>
                    <View style={{
                        display : 'flex',
                        flexDirection : 'row',
                        alignItems : 'center',
                        paddingVertical : 10
                    }}>
                        <Image source={icons.register} style={{
                            width : normalize(12),
                            height : normalize(15)
                          }}/>
                          <Text style={[styles.label,{paddingLeft : 4}]}>
                            เพิ่มเอกสารด้วย ไฟล์รูป หรือ PDF
                          </Text>
                    </View>
                    <MainButton fontSize={normalize(14)} label={"เพิ่มเอกสาร"} color={colors.orange} onPress={()=>{
                      navigation.navigate("FourthFormScreen",{
                        tele : telephone,
                        profile : true
                      })
                    }}/>
                </View>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default ProfileDocument;

const styles = StyleSheet.create({
    appBarBack:{
      flex : 1,
      flexDirection : 'row',
      justifyContent : 'space-between',
      paddingHorizontal : normalize(12),
      alignItems : 'center'
    },
    appBarHeader : {
      fontFamily: font.bold,
      fontSize : normalize(19)
    },
    body:{
      flex : 9,
      paddingTop : normalize(10),
      backgroundColor : colors.disable,
    },
    content:{
        backgroundColor : colors.white,
        padding : normalize(17)
    },
    listTileIcon : {
      width : normalize(24),
      height : normalize(24)
    },
    header :{
        fontFamily : font.bold,
        paddingVertical : normalize(10),
        paddingHorizontal : normalize(5),
        fontSize : normalize(18)
    },
    idcardheader:{
        fontFamily : font.medium,
        fontSize : normalize(14),
        paddingTop : normalize(20)
    },
    label: {
        fontFamily: font.light,
        fontSize: normalize(14),
        color: colors.gray,
      },
})