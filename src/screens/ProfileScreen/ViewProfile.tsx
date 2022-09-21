import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { stylesCentral } from '../../styles/StylesCentral'
import { normalize } from '../../function/Normalize'
import { colors, font, icons } from '../../assets'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ProfileDatasource } from '../../datasource/ProfileDatasource'
import { ScrollView } from 'react-native-gesture-handler'
import { QueryLocation } from '../../datasource/LocationDatasource'

const ViewProfile: React.FC<any> = ({navigation,route})=>{
  const [initProfile,setInitProfile] = useState({
      firstname : "",
      lastname : "",
      birthDate : "",
      telephone : "",
      image : "",
      address1 : "",
      address2 : "",
      province : "",
      district : "",
      subdistrict : "",
      postal : ""
  })
  useEffect(()=>{
    getProfile()
  },[])
  const getProfile = async() =>{
    const droner_id = await AsyncStorage.getItem('droner_id')
    ProfileDatasource.getProfile(droner_id!).then(
      res => {
        const imgPath = res.file.filter((item : any) => {
          if(item.category === "PROFILE_IMAGE"){
            return item
          }
        })
        if(imgPath.length === 0){
          QueryLocation.QueryProfileSubDistrict(res.address.districtId).then(
            resSub => {
                const address = resSub.filter((item : any) =>
                    {if(item.subdistrictId === res.address.subdistrictId){
                      return item;
                    }})
                const datetime = res.birthDate;
                const date = datetime.split("T")[0]
                setInitProfile({
                    firstname : res.firstname,
                    lastname : res.lastname,
                    birthDate : `${date.split("-")[2]}/${date.split("-")[1]}/${parseInt(date.split("-")[0])+543}`,
                    telephone : res.telephoneNo,
                    image : "",
                    address1 : res.address.address1,
                    address2 : res.address.address2,
                    province : address[0].provinceName,
                    district : address[0].districtName,
                    subdistrict : address[0].subdistrictName,
                    postal : res.address.postcode
                })
            }
        )
        }
        else{
          ProfileDatasource.getImgePathProfile(droner_id!,imgPath[0].path).then(
            resImg => {
              QueryLocation.QueryProfileSubDistrict(res.address.districtId).then(
                  resSub => {
                      const address = resSub.filter((item : any) =>
                          {if(item.subdistrictId === res.address.subdistrictId){
                            return item;
                          }})
                      const datetime = res.birthDate;
                      const date = datetime.split("T")[0]
                      setInitProfile({
                          firstname : res.firstname,
                          lastname : res.lastname,
                          birthDate : `${date.split("-")[2]}/${date.split("-")[1]}/${parseInt(date.split("-")[0])+543}`,
                          telephone : res.telephoneNo,
                          image : resImg.url,
                          address1 : res.address.address1,
                          address2 : res.address.address2,
                          province : address[0].provinceName,
                          district : address[0].districtName,
                          subdistrict : address[0].subdistrictName,
                          postal : res.address.postcode
                      })
                  }
              )
            }
          )
          .catch(err => console.log(err))
        }
      }
    ).catch(err => console.log(err))
  }
  return (
    <SafeAreaView style={[stylesCentral.container]}>
        <View style={styles.appBarBack}>
            <TouchableOpacity onPress={()=> navigation.goBack()}>
              <Image source={icons.arrowLeft} style={styles.listTileIcon}/>
            </TouchableOpacity>
            <Text style={[styles.appBarHeader]}>{"ข้อมูลโปรไฟล์"}</Text>
            <View style={styles.listTileIcon}></View>
        </View>
        <View style={styles.body}>
            <ScrollView>
                <View style={{
                   alignItems : 'center',
                   marginBottom : normalize(20)
                }}>
                    <Image source={{uri : initProfile.image}} style={styles.imgProfile}/>
                </View>
                <Text style={styles.title}>ข้อมูลทั่วไป (โปรดระบุ)</Text>
                <TextInput
                  value={initProfile.firstname}
                  style={[styles.input,{backgroundColor : colors.disable}]}
                  editable={false}
                  placeholder={'ชื่อ'}
                  placeholderTextColor={colors.disable}
                />
                <TextInput
                  value={initProfile.lastname}
                  style={[styles.input,{backgroundColor : colors.disable}]}
                  editable={false}
                  placeholder={'นามสกุล'}
                  placeholderTextColor={colors.disable}
                />
                <TextInput
                  value={initProfile.birthDate}
                  style={[styles.input,{backgroundColor : colors.disable}]}
                  editable={false}
                  placeholder={'วัน/เดือน/ปี เกิด'}
                  placeholderTextColor={colors.disable}
                />
                <TextInput
                  value={initProfile.telephone}
                  style={[styles.input,{backgroundColor : colors.disable}]}
                  editable={false}
                  placeholder={'โทรศัพท์'}
                  placeholderTextColor={colors.disable}
                />
                <Text style={styles.title}>ที่อยู่</Text>
                <TextInput
                  value={initProfile.address1}
                  style={[styles.input,{backgroundColor : colors.disable}]}
                  editable={false}
                  placeholder={'บ้านเลขที่'}
                  placeholderTextColor={colors.disable}
                />
                <TextInput
                  value={initProfile.address2}
                  style={[styles.input,{backgroundColor : colors.disable}]}
                  editable={false}
                  placeholder={'รายละเอียดที่ีอยู่ (หมู่ ถนน)'}
                  placeholderTextColor={colors.disable}
                />
                <TextInput
                  value={initProfile.province}
                  style={[styles.input,{backgroundColor : colors.disable}]}
                  editable={false}
                  placeholder={'จังหวัด'}
                  placeholderTextColor={colors.disable}
                />
                <TextInput
                  value={initProfile.district}
                  style={[styles.input,{backgroundColor : colors.disable}]}
                  editable={false}
                  placeholder={'อำเภอ'}
                  placeholderTextColor={colors.disable}
                />
                <TextInput
                  value={initProfile.subdistrict}
                  style={[styles.input,{backgroundColor : colors.disable}]}
                  editable={false}
                  placeholder={'ตำบล'}
                  placeholderTextColor={colors.disable}
                />
                <TextInput
                  value={initProfile.postal}
                  style={[styles.input,{backgroundColor : colors.disable}]}
                  editable={false}
                  placeholder={'เลขไปรษณีย์'}
                  placeholderTextColor={colors.disable}
                />
            </ScrollView>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    imgProfile:{
        width : normalize(120),
        height : normalize(120),
        borderRadius : normalize(60)
    },
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
      paddingHorizontal : normalize(17)
    },
    listTileIcon : {
      width : normalize(24),
      height : normalize(24)
    },
    title:{
        marginVertical : normalize(10),
        fontFamily : font.medium,
        fontSize : normalize(16)
    },
    input: {
        height: normalize(56),
        marginVertical: 12,
        padding: 10,
        borderColor: colors.disable,
        borderWidth: 1,
        borderRadius: normalize(10),
        fontFamily : font.light,
        color : colors.fontBlack,
      },
})

export default ViewProfile