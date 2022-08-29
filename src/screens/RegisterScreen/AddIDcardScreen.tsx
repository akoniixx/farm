import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, TextInput } from 'react-native'
import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalize } from '@rneui/themed';
import colors from '../../assets/colors/colors';
import { font, icons } from '../../assets';
import { MainButton } from '../../components/Button/MainButton';
import * as ImagePicker from 'react-native-image-picker';

const width = Dimensions.get('window').width;

const AddIDcardScreen:React.FC<any> = ({navigation}) => {
  const [image,setImage] = useState<any>(null)
  const [idcard,setIdCard] = useState<any>("")

  const onAddImage = useCallback(async()=>{
    const result = await ImagePicker.launchImageLibrary({
        mediaType : 'photo',
    });
    if(!result.didCancel){
        setImage(result)
        console.log(idcard)
    }
  },[image]);
  return (
    <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title="ลงทะเบียนนักบินโดรน"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.inner}>
            <View>
                <View style={styles.page4}>
                    <View style={styles.circle}>
                        <View style={styles.circle2}/>
                    </View>
                    <View style={{
                        paddingLeft : normalize(10)
                    }}>
                        <Text style={[styles.h2,{color : '#9BA1A8'}]}>4/4</Text>
                        <Text style={styles.h1}>ยืนยันเอกสาร</Text>
                    </View>
                </View>
                <View style={{paddingTop : 20}}>
                    <Text style={styles.h2}>รูปถ่ายผู้สมัคร คู่บัตรประชาชน</Text>
                    <TouchableOpacity style={{
                        marginVertical : 20
                    }} onPress={onAddImage}>
                        {
                            (image == null)?
                            <View style={styles.addImage}>
                                <View style={styles.camera}>
                                    <Image source={icons.camera} style={{
                                        width : 19,
                                        height : 16
                                    }}/>
                                </View>
                            </View>:
                            <View style={{
                                width : width*0.9,
                                height : normalize(162),
                                borderRadius : 20,
                                position : 'relative'
                            }}>
                                <View style={{
                                    position : 'absolute',
                                    top : 10,
                                    left : 10,
                                    backgroundColor : colors.white,
                                    borderRadius : 12,
                                    padding : 10,
                                    height : 38,
                                    zIndex : 3
                                }}>
                                    <Text style={styles.h3}>เปลี่ยนรูป</Text>
                                </View>
                                <View style={{
                                        position : 'absolute',
                                        top : 0,
                                        left : 0,
                                        width : width*0.9,
                                        height : normalize(162),
                                        borderRadius : 20,
                                        zIndex : 0
                                    }}>
                                    <Image source={{uri : image.assets[0].uri}} style={{
                                        width : width*0.9,
                                        height : normalize(162),
                                        borderRadius : 20
                                    }}/>
                                </View>
                            </View>
                        }
                    </TouchableOpacity>
                    <TextInput style={styles.input} placeholder="เลขบัตรประชาชน" onChangeText={(value)=>{
                        setIdCard(value)
                    }}/>
                    <Text style={[styles.h3, {color : colors.gray}]}>ใส่เลข 13 หลักโดยไม่ต้องเว้นวรรค</Text>
                </View>
            </View>
            <MainButton label='ยืนยันการสมัคร' color={(idcard.length === 13 && image != null)?colors.orange:colors.disable} disable={(idcard.length === 13 && image != null)?false:true}/>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    inner: {
      flex: 1,
      display : 'flex',
      justifyContent : 'space-between',
      paddingHorizontal : normalize(17),
    },
    page4:{
        width : width*0.9,
        height : normalize(79),
        borderColor : colors.orange,
        borderWidth : 1,
        borderRadius : normalize(16),
        backgroundColor : '#FFFBF7',
        paddingHorizontal : normalize(30),
        display : 'flex',
        flexDirection : 'row',
        alignItems : 'center'
    },
    circle:{
        width : normalize(36),
        height : normalize(36),
        borderRadius : normalize(18),
        backgroundColor : colors.orange,
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center'
    },
    circle2:{
        width : normalize(30),
        height : normalize(30),
        borderRadius : normalize(15),
        backgroundColor : '#FFFBF7',
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
    container: {
      flex: 1,
    },
    addImage : {
        width : width*0.9,
        height : normalize(162),
        borderColor : '#EBEEF0',
        borderWidth : 0.5,
        backgroundColor : '#FAFAFB',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 20
    },
    input: {
      height: normalize(56),
      marginVertical: 12,
      padding: 10,
      borderColor: colors.disable,
      borderWidth: 1,
      borderRadius: normalize(10),
    },
    camera: {
        width : 50,
        height : 50,
        backgroundColor : '#fff',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        borderRadius : 16
    }
  });
export default AddIDcardScreen