import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  Linking,
  Alert,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, image} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {ProgressBar} from '../../components/ProgressBar';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import fonts from '../../assets/fonts';
import {plantList} from '../../definitions/plants';
import {PlantSelect} from '../../components/PlantSelect';
import BottomSheet from 'reanimated-bottom-sheet';
import { icons } from "../../assets"
import Animated from 'react-native-reanimated';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker, { types } from 'react-native-document-picker';
import { Register } from '../../datasource/TaskDatasource';
import * as ImagePicker from 'react-native-image-picker';
import { QueryLocation } from '../../datasource/LocationDatasource';
import Lottie from 'lottie-react-native';

const ThirdFormScreen: React.FC<any> = ({route, navigation}) => {
  const fall = new Animated.Value(1)
  const windowWidth = Dimensions.get('window').width;
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const telNo = route.params
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState<any>([]);
  const [opentype, setOpentype] = useState(false);
  const [valuetype, setValuetype] = useState(null);
  const [brand,setBrand] = useState<any>(null)
  const [brandtype,setBrandType] = useState<any>(null)
  const [itemstype, setItemstype] = useState<any>([]);
  const [address, setAddress] = useState('');
  const [plantListSelect, setPlantListSelect] = useState(plantList);
  const [result,setResult] = useState<string[]>([])
  const [addPlant,setAddPlant] = useState<string>("");
  const sheetRef = useRef<any>(null)
  const [dronedataUI,setDronedataUI] = useState<any>([]);
  const [dronedata,setDronedata] = useState<any>([]);
  const [droneno,setdroneno] = useState<any>(null)
  const [provinceId,setProvinceId] = useState<any>(null)
  const [districtId,setDistrictId] = useState<any>(null)
  const [subdistrictId,setSubdistrictId] = useState<any>(null)
  const [lat,setlat] = useState<any>(null)
  const [long,setlong] = useState<any>(null)
  const [image1,setImage1] = useState<any>(null)
  const [image2,setImage2] = useState<any>(null)
  const [popupPage,setpopupPage] = useState(1)
  const [loading,setLoading] = useState(false);
  
  useEffect(() => {
    getNameFormLat();
  }, [position]);
  useEffect(() => {
    getLocation();
    Register.getDroneBrand(1,14).then(
      (result)=> {
        const data = result.data.map((item: any)=>{
          return {label : item.name , value : item.id, image : item.logoImagePath, icon : ()=> (item.logoImagePath != null)?<Image source={{uri : item.logoImagePath}} style={{width : 30, height : 30, borderRadius : 15}}/>:<></>}
        })
        setItems(data)
      })
      .catch(err => console.log(err))
  }, []);
  useEffect(() => {
    if(brand != null){
      Register.getDroneBrandType(brand.value).then(
        (result) => {
          const data = result.drone.map((item : any)=>{
            return {label : item.series, value: item.id}
          })
          setItemstype(data)
        }
      ).catch(err => console.log(err))
    }
  }, [brand]);
  const uploadFile1 = async()=>{
    const result = await ImagePicker.launchImageLibrary({
      mediaType : 'photo',
    });
    if(!result.didCancel){
        setImage1(result)
    }
  }
  const uploadFile2 = async()=>{
    const result = await ImagePicker.launchImageLibrary({
      mediaType : 'photo',
    });
    if(!result.didCancel){
        console.log(result);
        setImage2(result)
    }
  }

  const handleSelect = (value:any,index:number,label:string,status:boolean) => {
    const data = [...value];
    data[index].active = !status;
    const resultarray = result.findIndex(e => e === label)
    if(resultarray === -1){
      result.push(label);
    }
    else{
      result.splice(index,1)
    }
    setResult(result);
    setPlantListSelect(data)
  };

  const addSelect = (value:string) =>{
    const data = [...plantListSelect];
    const resultarray = data.findIndex(e => e.value === value)
    if(resultarray === -1){
      const newplant = {value: value, active: true};
      data.push(newplant);
      setPlantListSelect(data);
    }
  }

  const getNameFormLat = () => {
    let myApiKey = 'AIzaSyDg4BI3Opn-Bo2Pnr40Z7PKlC6MOv8T598';
    let myLat = position.latitude;
    let myLon = position.longitude;
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        myLat +
        ',' +
        myLon +
        '&key=' +
        myApiKey,
    )
      .then(response => response.json())
      .then(responseJson => {
        setlat(responseJson.results[0].geometry.location.lat)
        setlong(responseJson.results[0].geometry.location.lng)
        setAddress(
          responseJson.results[0].address_components[0].long_name +
            ' ' +
            responseJson.results[0].address_components[2].long_name +
            ' ' +
            responseJson.results[0].address_components[3].long_name +
            ' ' +
            responseJson.results[0].address_components[4].long_name,
        );
        QueryLocation.QueryProvince().then(
          (item)=>{
            item.map((Province: any)=>{
              if(Province.provinceName == `จังหวัด${responseJson.results[0].address_components[3].long_name}`){
                // console.log(Province.provinceName)
                setProvinceId(Province.provinceId)
                QueryLocation.QueryDistrict(Province.provinceId).then(
                  (itemDistrict : any)=>{
                    itemDistrict.map((District: any)=>{
                      if(District.districtName === `${responseJson.results[0].address_components[2].long_name.split(" ")[0]}${responseJson.results[0].address_components[2].long_name.split(" ")[1]}`){
                        setDistrictId(District.districtId)
                        QueryLocation.QuerySubDistrict(District.districtId,District.districtName).then(
                          (itemSubDistrict)=>{
                              itemSubDistrict.map((SubDistrict : any)=>{
                                if(SubDistrict.districtName === `${responseJson.results[0].address_components[2].long_name.split(" ")[0]}${responseJson.results[0].address_components[2].long_name.split(" ")[1]}`){
                                  setSubdistrictId(SubDistrict.subdistrictId);
                                }
                              })
                          }
                        ).catch(err => console.log(err))
                      }
                    })
                  }
                ).catch(err => console.log(err))
              }
            })
          }
        ).catch(err => console.log(err))
      });
  };

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow  to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        pos => {
          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  const addDrone = ()=>{
    const drones = [...dronedata];
    const dronesUI = [...dronedataUI]
    const newDrone = {
      droneId : brandtype.value,
      serialNo : droneno,
      status : "PENDING",
    }
    const newDroneUI = {
      img : brand.image,
      droneBrand : brandtype.label,
      serialBrand : droneno,
    }
    drones.push(newDrone);
    dronesUI.push(newDroneUI)
    Register.uploadDronerdrone(drones).then((res)=>{
      setDronedata(drones);
      setDronedataUI(dronesUI)
      setBrand(null)
      setBrandType(null)
      setdroneno(null)
      setpopupPage(2)
    }).catch(err => console.log(err))
    // sheetRef.current.snapTo(1)
  }

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลงทะเบียนนักบินโดรน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />

      <View style={styles.first}>
        <View style={styles.inner}>
          <View style={styles.container}>
            <View style={{marginBottom: normalize(10)}}>
              <ProgressBar index={3} />
            </View>
            <Text style={styles.label}>ขั้นตอนที่ 3 จาก 4</Text>
            <Text style={styles.h1}>กรอกข้อมูลการบินโดรน</Text>
            <ScrollView>
              <Text style={[styles.h1, {marginTop: normalize(39)}]}>
                พื้นที่ให้บริการหลัก
              </Text>
              <View
                style={{
                  borderColor: colors.gray,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  marginVertical: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={image.map}
                  style={{
                    width: normalize(24),
                    height: normalize(22),
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: normalize(16),
                    color: colors.gray,
                  }}>
                  {address}
                </Text>
              </View>

              <View style={{flex: 1}}>
                <MapView.Animated
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={position}
                  showsUserLocation={true}
                  onRegionChangeComplete={region => setPosition(region)}
                  showsMyLocationButton={true}
                />
                <View style={styles.markerFixed}>
                  <Image style={styles.marker} source={image.marker} />
                </View>
              </View>

              <View
                style={{
                  marginTop: normalize(39),
                  marginBottom: normalize(20),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={[styles.h1]}>พืชที่เคยฉีดพ่น</Text>
                <Text style={[styles.h2, {color: colors.gray}]}>
                  (กรุณาเลือกอย่างน้อย 1 อย่าง)
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {plantListSelect.map((v, i) => (
                  <PlantSelect
                    key={i}
                    label={v.value}
                    active={v.active}
                    onPress={() => handleSelect(plantListSelect,i,v.value,v.active)}
                  />
                ))}
              </View>
              <View style={styles.input}>
                <TextInput placeholder='พืชอื่นๆ'
                 placeholderTextColor={colors.disable}
                 style={{
                  width : '100%',
                  color : colors.fontBlack
                }} onChangeText={(value)=> setAddPlant(value)}/>
                {
                  (addPlant.length != 0)?
                  <TouchableOpacity style={{ 
                    marginBottom : normalize(10),
                    width : normalize(60),
                    height : normalize(30),
                    borderRadius : 6,
                    display : 'flex',
                    justifyContent : 'center',
                    alignItems : 'center',
                    backgroundColor : '#2BB0ED'
                  }} onPress={()=>addSelect(addPlant)}>
                    <Text style={[styles.h2,{color : colors.white}]}>เพิ่ม</Text>
                  </TouchableOpacity>:<></>
                }
              </View>
              {
                (dronedataUI.length === 0 && dronedata.length === 0) ? <>
                </>:<View style={{
                  marginTop: normalize(20),
                  display : 'flex',
                  justifyContent : 'center'
                }}>
                  {
                    dronedataUI.map((item : any)=>(
                      <View style={{
                        height : normalize(104),
                        borderWidth : 0.5,
                        borderColor : colors.disable,
                        borderRadius : normalize(20),
                        paddingVertical : normalize(10),
                        paddingHorizontal : normalize(20),
                        display : 'flex',
                        flexDirection : 'row',
                        justifyContent : 'space-between',
                        alignItems : 'center',
                        marginBottom: normalize(10),
                      }}>
                        <View style={{
                          display : 'flex',
                          justifyContent : 'space-between'
                        }}>
                          <View>
                            <Text style={[styles.h1,{fontSize : normalize(17)}]}>
                              {item.droneBrand}
                            </Text>
                            <Text style={styles.label}>
                              {item.serialBrand}
                            </Text>
                          </View>
                          <View style={{
                            width : normalize(109),
                            height : normalize(24),
                            borderRadius : normalize(12),
                            display : 'flex',
                            justifyContent : 'center',
                            alignItems : 'center',
                            backgroundColor : '#FDF0E3'
                            }}>
                              <Text style={[styles.label,{color: '#AE5700'}]}>รอการตรวจสอบ</Text>
                          </View>
                        </View>
                        <Image source={{uri : item.img}} style={{
                          width : normalize(60),
                          height : normalize(60)
                        }}/>
                      </View>
                    ))
                  }
                </View>
              }
              <View>
                <View
                  style={{
                    marginTop: normalize(39),
                    marginBottom: normalize(20),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.h2 , {paddingRight : 3}]}>โดรนฉีดพ่นของคุณ</Text>
                  <Text style={[styles.h2, {color: colors.gray}]}>
                    (เพิ่มได้ภายหลัง)
                  </Text>
                </View>
                <View style={{backgroundColor: colors.white}}>
                  <MainButton label="+ เพิ่มโดรน" fontColor={colors.orange} color={'#FFEAD1'} onPress={()=>{
                    sheetRef.current.snapTo(0)
                  }}/>
                </View>
              </View>
            </ScrollView>
          </View>
          <View style={{backgroundColor: colors.white}}>
            <MainButton label="ถัดไป" color={colors.orange} onPress={()=>{
              let plant : string[] = [];
               plantListSelect.map((item) => {
                if(item.active)
                { 
                  plant.push(item.value)
                }
              })
              Register.registerStep3(
                telNo.tele,
                provinceId,
                districtId,
                subdistrictId,
                address,
                plant,
                lat,
                long
              ).then((res)=>{
                navigation.navigate('FourthFormScreen',{tele : telNo.tele});
              }).catch(err => {
                console.log(err)
              })
            }}/>
          </View>
        </View>
        <BottomSheet
          callbackNode={fall}
          enabledGestureInteraction={true}
          initialSnap={1}
          ref={sheetRef}
          snapPoints={[750,0]}
          borderRadius={8}
          renderHeader={()=>(<></>)}
          renderContent={()=>(<View
            style={{
              backgroundColor: 'white',
              paddingVertical: 30,
              paddingHorizontal : 20,
              width: windowWidth,
              height: 750,
            }}
          >
            <View style={{
              flex : 1,
              display : 'flex',
              flexDirection : 'column',
              justifyContent : 'space-between'
            }}>
              {
                (popupPage == 1)?
                (<><View>
                    <View style={{
                      padding: 8,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <TouchableOpacity onPress={() => {
                        sheetRef.current.snapTo(1);
                      } }>
                        <Image source={icons.close} style={{
                          width: normalize(14),
                          height: normalize(14)
                        }} />
                      </TouchableOpacity>
                      <Text style={styles.hSheet}>
                        เพิ่มโดรน
                      </Text>
                      <View></View>
                    </View>
                    <View style={{
                      paddingHorizontal: 8,
                      paddingVertical: 16
                    }}>
                      <View style={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}>
                        <Text style={styles.h2}>
                          ยี่ห้อโดรนฉีดพ่น
                        </Text>
                        <Text style={[styles.h2, { color: colors.gray, paddingLeft: 4 }]}>
                          (กรุณาเพิ่มอย่างน้อย 1 รุ่น)
                        </Text>
                      </View>
                      <View style={{
                        paddingTop: 12
                      }}>
                        <DropDownPicker
                          zIndex={3000}
                          zIndexInverse={1000}
                          style={{
                            marginVertical: 10,
                            backgroundColor: colors.white,
                            borderColor: colors.gray,
                          }}
                          placeholder="เลือกยี่ห้อโดรน"
                          placeholderStyle={{
                            color: colors.gray,
                          }}
                          open={open}
                          value={value}
                          items={items}
                          setOpen={setOpen}
                          onSelectItem={(value) => {
                            setBrand(value);
                          } }
                          setValue={setValue}
                          dropDownDirection="BOTTOM"
                          dropDownContainerStyle={{
                            borderColor: colors.disable,
                          }} />
                        <DropDownPicker
                          zIndex={2000}
                          zIndexInverse={2000}
                          style={{
                            marginVertical: 10,
                            backgroundColor: colors.white,
                            borderColor: colors.gray,
                          }}
                          placeholder="รุ่น"
                          placeholderStyle={{
                            color: colors.gray,
                          }}
                          open={opentype}
                          value={valuetype}
                          items={itemstype}
                          setOpen={setOpentype}
                          onSelectItem={(value) => {
                            setBrandType(value);
                          } }
                          setValue={setValuetype}
                          dropDownDirection="BOTTOM"
                          dropDownContainerStyle={{
                            borderColor: colors.disable,
                          }} />
                        <TextInput
                          placeholderTextColor={colors.gray}
                          onChangeText={(value) => {
                            setdroneno(value);
                          } }
                          value={droneno}
                          style={styles.input}
                          editable={true}
                          placeholder={'เลขตัวถังโดรน'} />
                      </View>
                    </View>
                  </View>
                  <MainButton disable={(!brand || !brandtype || !droneno) ? true : false} label='ถัดไป' color={colors.orange} onPress={addDrone} />
                  </>):
                  (
                  <View style={{
                    flex : 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <View>
                    <View>
                    <View style={{
                      padding: 8,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <TouchableOpacity onPress={() => {
                        sheetRef.current.snapTo(1);
                      } }>
                        <Image source={icons.close} style={{
                          width: normalize(14),
                          height: normalize(14)
                        }} />
                      </TouchableOpacity>
                      <Text style={styles.hSheet}>
                        เพิ่มเอกสาร
                      </Text>
                      <View></View>
                    </View>
                    <Text style={[styles.h2, {paddingTop : 12}]}>อัพโหลดใบอนุญาตนักบิน</Text>
                      <View style={{
                        display : 'flex',
                        flexDirection : 'row',
                        justifyContent : 'space-between',
                        alignItems : 'center'
                      }}>
                        <View>
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
                          <View>
                            {
                              (image1 != null)?
                              <View style={{
                                display : 'flex',
                                flexDirection : 'row',
                                alignItems : 'center',
                                paddingVertical : 5,
                                width : windowWidth*0.5,
                              }}>
                                <Text numberOfLines={1} style={[styles.label,{paddingLeft : 4,color : colors.orange}]}>
                                  {image1.assets[0].fileName}
                                </Text>
                                <TouchableOpacity onPress={()=>{
                                  setImage1(null)
                                }}>
                                  <View style={{
                                    width : normalize(16),
                                    height : normalize(16),
                                    marginLeft : normalize(8),
                                    borderRadius : normalize(8),
                                    backgroundColor : colors.fontBlack,
                                    display : 'flex',
                                    justifyContent :'center',
                                    alignItems : 'center'
                                  }}>
                                    <Text style={{
                                      fontSize : 10,
                                      color : colors.white
                                    }}>x</Text>
                                  </View>
                                </TouchableOpacity>
                              </View>:<></>
                            }
                          </View>
                        </View>
                        <MainButton fontSize={normalize(14)} label="เพิ่มเอกสาร" color={colors.orange} onPress={uploadFile1}/>
                      </View>
                      <View
                        style={{
                          borderBottomColor: colors.gray,
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          marginVertical : 10
                        }}
                      />
                      <Text style={[styles.h2, {paddingTop : 12}]}>อัพโหลดใบอนุญาตโดรนจาก กสทช.</Text>
                        <View style={{
                          display : 'flex',
                          flexDirection : 'row',
                          justifyContent : 'space-between',
                          alignItems : 'center'
                        }}>
                          <View>
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
                            <View>
                              {
                                (image2 != null)?
                                <View style={{
                                  display : 'flex',
                                  flexDirection : 'row',
                                  alignItems : 'center',
                                  paddingVertical : 5,
                                  width : windowWidth*0.5,
                                }}>
                                  <Text numberOfLines={1} style={[styles.label,{paddingLeft : 4,color : colors.orange}]}>
                                    {image2.assets[0].fileName}
                                  </Text>
                                  <TouchableOpacity onPress={()=>{
                                    setImage2(null)
                                  }}>
                                    <View style={{
                                      width : normalize(16),
                                      height : normalize(16),
                                      marginLeft : normalize(8),
                                      borderRadius : normalize(8),
                                      backgroundColor : colors.fontBlack,
                                      display : 'flex',
                                      justifyContent :'center',
                                      alignItems : 'center'
                                    }}>
                                      <Text style={{
                                        fontSize : 10,
                                        color : colors.white
                                      }}>x</Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>:<></>
                              }
                            </View>
                          </View>
                        <MainButton fontSize={normalize(14)} label="เพิ่มเอกสาร" color={colors.orange} onPress={uploadFile2}/>
                      </View>
                    </View>
                    </View>
                    <View>
                    <MainButton disable={(!image1 || !image2)?true : false} label='ถัดไป' color={colors.orange} onPress={()=>{
                          setLoading(true)
                          Register.uploadDronerLicense(image1).then(
                            (res) => {
                              console.log(res)
                              Register.uploadDroneLicense(image2).then(
                                (res) => {
                                  setLoading(false)
                                  sheetRef.current.snapTo(1)
                                }
                              ).catch(
                                err => console.log(err)
                              )
                            }
                          ).catch(
                            err => console.log(err)
                          )
                      }} />
                    </View>
                  </View>)
              }
            </View>
          </View>)}
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
                        <Lottie source={image.loading} autoPlay loop style={{
                            width : normalize(50),
                            height : normalize(50)
                        }}/>
                    </View>
                </View>
            </Modal>
    </SafeAreaView>
  );
};
export default ThirdFormScreen;

const styles = StyleSheet.create({
  first:{
    flex : 1,
    justifyContent : "space-around"
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
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
  varidate : {
    fontFamily: font.medium,
    fontSize: normalize(12),
    color : 'red'
  },
  hSheet:{
    fontFamily: font.bold,
    fontSize: normalize(16),
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

  map: {
    width: normalize(344),
    height: normalize(190),
  },
  markerFixed: {
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: normalize(31),
    width: normalize(26),
  },
  input: {
    display : 'flex',
    paddingHorizontal : normalize(10),
    justifyContent : 'space-between',
    alignItems : 'center',
    flexDirection : 'row',
    height: normalize(56),
    marginVertical: 12,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: normalize(10),
    color : colors.fontBlack
  }
});
function useCallback(arg0: () => Promise<void>, arg1: { onboard1: any; onboard2: any; onboard3: any; blankNewTask: any; blankTask: any; idcard: any; pirotcer: any; dronecer: any; marker: any; map: any; }[]) {
  throw new Error('Function not implemented.');
}

