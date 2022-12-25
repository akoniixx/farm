import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Button,
    PermissionsAndroid,
    Platform,
    Modal,
    Image,
    Dimensions,
  } from 'react-native';
  import React, {useCallback, useEffect, useReducer, useState} from 'react';
  import {colors, font, icons, image as img} from '../../assets';
  import { QueryLocation } from '../../datasource/LocationDatasource';
  import * as ImagePicker from 'react-native-image-picker';
  import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { registerReducer } from '../../hook/registerfield';
import { normalize } from '../../functions/Normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar } from '@rneui/base';
import DropDownPicker from 'react-native-dropdown-picker';
import { MainButton } from '../../components/Button/MainButton';
import { Register } from '../../datasource/AuthDatasource';
import  Lottie  from 'lottie-react-native';
  
  const EditProfileScreen: React.FC<any> = ({navigation,route}) => {
    const initialFormRegisterState = {
      name : "",
      surname : "",
      birthDate : "",
      tel : "",
      no : "",
      address : "",
      province : "",
      district : "",
      subdistrict : "",
      postal : ""
  }
  
    const windowWidth = Dimensions.get("window").width;
    const [openCalendar,setOpenCalendar] = useState(false);
    const [birthday,setBirthday] = useState("")
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const [openDistrict, setOpenDistrict] = useState(false);
    const [valueDistrict, setValueDistrict] = useState(null);
    const [itemsDistrict,setItemDistrict] = useState([])
    const [openSubDistrict, setOpenSubDistrict] = useState(false);
    const [valueSubDistrict, setSubValueDistrict] = useState(null);
    const [itemsSubDistrict,setItemSubDistrict] = useState([])
    const [province,setProvince] = useState<any>(null)
    const [district,setDistrict] = useState<any>(null)
    const [subdistrict,setSubdistrict] = useState<any>(null)
    const [image,setImage] = useState<any>(null)
    const [imagePreview,setImagePreview] = useState<any>(null)
    const [loading,setLoading] = useState(false);
    const [formState,dispatch] = useReducer(registerReducer,initialFormRegisterState);

    const getProfile = async() =>{
        const droner_id = await AsyncStorage.getItem('droner_id')
        ProfileDatasource.getProfile(droner_id!).then(
          res => {
            ProfileDatasource.getImgePathProfile(droner_id!,res.file[0].path).then(
              resImg => {
                setImagePreview(resImg.url)
                const datetime = res.birthDate;
                const date = datetime.split("T")[0]
                setBirthday(date)
                setValue(res.address.provinceId)
                setProvince(res.address.provinceId)
                // dispatch({
                //     type : "Initial Input",
                //     name : res.firstname,
                //     surname : res.lastname,
                //     birthDate : date,
                //     tel : res.telephoneNo,
                //     no : res.address.address1,
                //     address : res.address.address2,
                //     province : "",
                //     district : "",
                //     subdistrict : "",
                //     postal : ""
                //   })
              }
            )
            .catch(err => console.log(err))
          }
        ).catch(err => console.log(err))
      }
      
    const onAddImage = useCallback(async()=>{
    const result = await ImagePicker.launchImageLibrary({
          mediaType : 'photo',
      });
      if(!result.didCancel){
          setImage(result)
      }
    },[image]);
  
    useEffect(()=>{
      getProfile()
      QueryLocation.QueryProvince().then(res => {
        const Province = res.map((item : any) => {
          return {label : item.provinceName, value : item.provinceId}
        })
        setItems(Province)
      })
    },[])
  
    useEffect(()=>{
      if(province != null){
        QueryLocation.QueryDistrict(province.value).then(res => {
          const District = res.map((item : any) => {
            return {label : item.districtName, value : item.districtId}
          })
          setItemDistrict(District)
        })
      }
    },[province])
  
    useEffect(()=>{
      if(province != null && district != null){
        QueryLocation.QuerySubDistrict(district.value,district.label).then(res =>{
          const SubDistrict = res.map((item : any) => {
            return {label : item.subdistrictName,value : item.subdistrictId, postcode : item.postcode, }
          })
          setItemSubDistrict(SubDistrict)
        })
      }
    },[province,district])

    return (
        <SafeAreaView style={stylesCentral.container}>
          <CustomHeader
            title="แก้ไขโปรไฟล์"
            showBackBtn
            onPressBack={() => navigation.goBack()}
          />
          <View style={styles.inner}>
            <View style={styles.container}>
              <ScrollView>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: normalize(40),
                  }}>
                  <TouchableOpacity onPress={onAddImage}>
                    <View style={{
                      width : normalize(116),
                      height : normalize(116),
                      position : 'relative'
                    }}>
                      <Avatar size={116} rounded source={(!image)?(!imagePreview)?icons.profile:{uri : imagePreview}:{uri : image.assets[0].uri}} />
                      <View style={{
                        position : 'absolute',
                        left : normalize(70.7),
                        top : normalize(70.7),
                        width : normalize(32),
                        height : normalize(32),
                        borderRadius : normalize(16),
                        backgroundColor : colors.white,
                        flex : 1,
                        justifyContent : 'center',
                        alignItems : 'center'
                      }}>
                        <Image source={icons.camera} style={{
                          width : normalize(20),
                          height : normalize(20)
                        }}/>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop: normalize(40)}}>
                    <Text style={styles.h1}>ข้อมูลทั่วไป (โปรดระบุ)</Text>
                </View>
                <TextInput
                  onChangeText={(value)=>{
                    dispatch({
                      type : "Handle Input",
                      field : "name",
                      payload : value
                    })
                  }}
                  value={formState.name}
                  style={styles.input}
                  editable={true}
                  placeholder={'ชื่อ'}
                  placeholderTextColor={colors.disable}
                />
                <TextInput
                  onChangeText={(value)=>{
                    dispatch({
                      type : "Handle Input",
                      field : "surname",
                      payload : value
                    })
                  }}
                  value={formState.surname}
                  style={styles.input}
                  editable={true}
                  placeholder={'นามสกุล'}
                  placeholderTextColor={colors.disable}
                />
                <TouchableOpacity onPress={()=> setOpenCalendar(true)}>
                   <View style={[styles.input,{
                    alignItems : 'center',
                    flexDirection : 'row'
                   }]}>
                    <TextInput
                     value={(birthday != "")?`${birthday.split('-')[2]}/${birthday.split('-')[1]}/${parseInt(birthday.split('-')[0])+543}`:birthday}
                     editable={false} 
                     placeholder={'วัน/เดือน/ปี เกิด'}
                     style={{width : windowWidth*0.78}}
                    />
                    <Image source={icons.calendar} style={{
                      width : normalize(25),
                      height : normalize(30)
                    }}/>
                   </View>
                </TouchableOpacity>
                <TextInput
                  value={formState.tel}
                  style={[styles.input,{backgroundColor : colors.disable}]}
                  editable={false}
                  placeholder={'เบอร์โทรศัพท์'}
                  placeholderTextColor={colors.disable}
                />
                <View style={{marginTop: normalize(40)}}>
                  <Text style={styles.h1}>ที่อยู่</Text>
                </View>
                <TextInput
                  onChangeText={(value)=>{
                    dispatch({
                      type : "Handle Input",
                      field : "no",
                      payload : value
                    })
                  }}
                  value={formState.no}
                  style={styles.input}
                  editable={true}
                  placeholder={'บ้านเลขที่'}
                  placeholderTextColor={colors.disable}
                />
                <TextInput
                  onChangeText={(value)=>{
                    dispatch({
                      type : "Handle Input",
                      field : "address",
                      payload : value
                    })
                  }}
                  value={formState.address}
                  style={styles.input}
                  editable={true}
                  placeholder={'รายละเอียดที่อยู่ (หมู่, ถนน)'}
                  placeholderTextColor={colors.disable}
                />
                  <DropDownPicker
                    listMode='SCROLLVIEW'
                    scrollViewProps={{
                      nestedScrollEnabled : true
                    }}
                    zIndex={3000}
                    zIndexInverse={1000}
                    style={{
                      marginVertical : 10,
                      backgroundColor : colors.white,
                      borderColor: colors.disable,
                    }}
                    placeholder="จังหวัด"
                    placeholderStyle={{
                      color: colors.disable,
                    }}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    onSelectItem={(value)=>{
                      setProvince(value)
                      dispatch({
                        type : "Handle Input",
                        field : "province",
                        payload : value
                      })
                    }}
                    setValue={setValue}
                    dropDownDirection="BOTTOM"
                    dropDownContainerStyle={{
                      borderColor: colors.disable,
                    }}
                  />
                  <DropDownPicker
                    listMode='SCROLLVIEW'
                    scrollViewProps={{
                      nestedScrollEnabled : true
                    }}
                    zIndex={2000}
                    zIndexInverse={2000}
                    disabled={(!province)?true:false}
                    style={{
                      borderColor: colors.disable,
                      marginVertical : 10,
                      backgroundColor : (!province)?colors.disable:colors.white
                    }}
                    placeholder="อำเภอ"
                    placeholderStyle={{
                      color: (!province)?colors.gray:colors.disable,
                    }}
                    open={openDistrict}
                    value={valueDistrict}
                    items={itemsDistrict}
                    setOpen={setOpenDistrict}
                    onSelectItem={(value)=>{
                      setDistrict(value)
                      dispatch({
                        type : "Handle Input",
                        field : "district",
                        payload : value
                      })
                    }}
                    setValue={setValueDistrict}
                    dropDownDirection="BOTTOM"
                    dropDownContainerStyle={{
                      borderColor: colors.disable,
                    }}
                  />
                  <DropDownPicker
                    listMode='SCROLLVIEW'
                    scrollViewProps={{
                      nestedScrollEnabled : true
                    }}
                    zIndex={1000}
                    zIndexInverse={3000}
                    disabled={(!district)?true:false}
                    style={{
                      borderColor: colors.disable,
                      marginVertical : 10,
                      backgroundColor : (!district)?colors.disable:colors.white
                    }}
                    placeholder="ตำบล"
                    placeholderStyle={{
                      color: (!district)?colors.gray:colors.disable,
                    }}
                    open={openSubDistrict}
                    value={valueSubDistrict}
                    items={itemsSubDistrict}
                    setOpen={setOpenSubDistrict}
                    onSelectItem={(value:any)=>{
                      setSubdistrict(value)
                      dispatch({
                        type : "Handle Input",
                        field : "subdistrict",
                        payload : value
                      })
                      dispatch({
                        type : "Handle Input",
                        field : "postal",
                        payload : value.postcode
                      })
                    }}
                    setValue={setSubValueDistrict}
                    dropDownDirection="BOTTOM"
                    dropDownContainerStyle={{
                      borderColor: colors.disable,
                    }}
                  />
                <TextInput
                  value={formState.postal}
                  style={[styles.input,{backgroundColor : colors.disable}]}
                  editable={false}
                  placeholder={'รหัสไปรษณีย์'}
                />
              </ScrollView>
            </View>
    
            <View style={{backgroundColor: colors.white}}>
              <MainButton
                label="ถัดไป"
                disable={(
                  !formState.name || 
                  !formState.surname ||
                  !formState.tel ||
                  !formState.birthDate ||
                  !formState.no || 
                  !formState.address ||
                  !formState.province.value ||
                  !formState.district.value ||
                  !formState.subdistrict.value ||
                  !formState.postal)?true : false
                }
                color={colors.orange}
                onPress={() => {
                  setLoading(true)
                  // Register.register2(
                  //   formState.name,
                  //   formState.surname,
                  //   formState.birthDate,
                  //   formState.tel,
                  //   formState.no,
                  //   formState.address,
                  //   formState.province.value,
                  //   formState.district.value,
                  //   formState.subdistrict.value,
                  //   formState.postal).then(async(res)=>{
                  //     if(!image){
                  //       if (Platform.OS === 'ios') {
                  //         await Geolocation.requestAuthorization('always');
                  //       }
                  //       else if(Platform.OS === 'android'){
                  //         await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                  //       }
                  //       Geolocation.getCurrentPosition(
                  //         (position) => {
                  //           setLoading(false)
                  //           navigation.navigate('ThirdFormScreen',{tele : formState.tel,latitude : position.coords.latitude,longitude : position.coords.longitude});
                  //         },
                  //         (error) => {
                  //           console.log(error.code, error.message);
                  //         },
                  //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                  //       );
                  //     }
                  //     else{
                  //       Register.uploadProfileImage(image).then(
                  //         async(res) => {
                  //           if (Platform.OS === 'ios') {
                  //             await Geolocation.requestAuthorization('always');
                  //           }
                  //           else if(Platform.OS === 'android'){
                  //             await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
                  //           }
                  //           Geolocation.getCurrentPosition(
                  //             (position) => {
                  //               setLoading(false)
                  //               navigation.navigate('ThirdFormScreen',{tele : formState.tel,latitude : position.coords.latitude,longitude : position.coords.longitude});
                  //             },
                  //             (error) => {
                  //               console.log(error.code, error.message);
                  //             },
                  //             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                  //           );
                  //         }
                  //       ).catch(err => console.log(err))
                  //     }
                  //   }).catch(err => console.log(err))
                }}
              />
            </View>
            <Modal 
            transparent={true}
            visible={loading}>
                <View style={{
                    flex : 1,
                    backgroundColor : 'rgba(0,0,0,0.5)',
                    justifyContent : 'center',
                    alignItems : 'center'
                }}>
                    <View style={{
                        backgroundColor : colors.white,
                        width : normalize(50),
                        height : normalize(50),
                        display : 'flex',
                        justifyContent : 'center',
                        alignItems : 'center',
                        borderRadius : normalize(8)
                    }}>
                        <Lottie source={img.loading} autoPlay loop style={{
                            width : normalize(50),
                            height : normalize(50)
                        }}/>
                    </View>
                </View>
            </Modal>
            <Modal transparent={true}
            visible={openCalendar}>
                <View style={{
                    flex : 1,
                    backgroundColor : 'rgba(0,0,0,0.5)',
                    justifyContent : 'center',
                    alignItems : 'center'
                }}>
                  <View style={{
                    borderRadius : normalize(8),
                    backgroundColor : colors.white,
                    width : windowWidth*0.9,
                    padding : normalize(20)
                  }}>
                    {/* <CalendarCustom value={birthday} onHandleChange={(day)=> {
                      setBirthday(day.dateString)
                      setOpenCalendar(false)
                      dispatch({
                        type : "Handle Input",
                        field : "birthDate",
                        payload : new Date(day.timestamp)
                      })
                    }}/> */}
                  </View>
                </View>
            </Modal>
          </View>
        </SafeAreaView>
      );
     
  };
  export default EditProfileScreen;
  
  const styles = StyleSheet.create({
    inner: {
      paddingHorizontal: normalize(17),
      flex: 1,
      justifyContent: 'space-around',
    },
    h1: {
      fontFamily: font.SarabunLight,
      fontSize: normalize(19),
      color: colors.fontBlack,
    },
    h2: {
      fontFamily: font.SarabunLight,
      fontSize: normalize(16),
      color: colors.fontBlack,
      marginTop: normalize(24),
    },
    label: {
      fontFamily: font.SarabunLight,
      fontSize: normalize(14),
      color: colors.gray,
    },
    container: {
      flex: 1,
    },
    input: {
      height: normalize(56),
      marginVertical: 12,
      padding: 10,
      borderColor: colors.disable,
      borderWidth: 1,
      borderRadius: normalize(10),
      color : colors.fontBlack
    },
  });
  