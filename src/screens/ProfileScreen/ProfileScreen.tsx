import {View, Text, StyleSheet, Image, ScrollView, Dimensions, TextInput, Modal, TouchableOpacity} from 'react-native';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {MainButton} from '../../components/Button/MainButton';
import {colors, font, icons, image} from '../../assets';
import {normalize} from '../../function/Normalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Authentication} from '../../datasource/AuthDatasource';
import * as RootNavigation from '../../navigations/RootNavigation';
import { Avatar } from '@rneui/base';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { initProfileState, profileReducer } from '../../hooks/profilefield';
import DroneBrandingItem, { StatusObject } from '../../components/Drone/DroneBranding';
import * as ImagePicker from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import Lottie from 'lottie-react-native';
import { numberWithCommas } from '../../function/utility';

const ProfileScreen: React.FC<any> = ({navigation,route}) => {
  const [profilestate,dispatch] = useReducer(profileReducer,initProfileState)
  const backbotton = (!route.params)?true:route.params.navbar
  const windowWidth = Dimensions.get('screen').width
  const windowHeight = Dimensions.get('screen').height
  const [items, setItems] = useState<any>([]);
  const [brand,setBrand] = useState<any>(null)
  const [brandtype,setBrandType] = useState<any>(null)
  const [itemstype, setItemstype] = useState<any>([]);
  const [image1,setImage1] = useState<any>(null)
  const [image2,setImage2] = useState<any>(null)
  const [open, setOpen] = useState(false);
  const [opentype, setOpentype] = useState(false);
  const [value, setValue] = useState(null);
  const [valuetype, setValuetype] = useState(null);
  const [droneno,setdroneno] = useState<any>(null)
  const [popupPage,setpopupPage] = useState(1)
  const actionSheet = useRef<any>(null)
  const [reload,setReload] = useState(false)
  const [loading,setLoading] = useState(false)
  
  const showActionSheet = () =>{
    actionSheet.current.show()
  }
  useEffect(()=>{
    getProfile()
    ProfileDatasource.getDroneBrand(1,14).then(
      (result)=> {
        const data = result.data.map((item: any)=>{
          return {label : item.name , value : item.id, image : item.logoImagePath, icon : ()=> (item.logoImagePath != null)?<Image source={{uri : item.logoImagePath}} style={{width : 30, height : 30, borderRadius : 15}}/>:<></>}
        })
        setItems(data)
      })
      .catch(err => console.log(err))
  },[reload])

const onLogout = () =>{
  navigation.reset({
    index: 0,
    routes: [{ name: 'Main' }],
  });
  setTimeout(() =>  Authentication.logout(), 500);
 
}

  useEffect(() => {
    if(brand != null){
      ProfileDatasource.getDroneBrandType(brand.value).then(
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
        setImage2(result)
    }
  }

  const addDrone = async()=>{
    const droner_id = await AsyncStorage.getItem('droner_id')
    const newDrone = {
      dronerId : droner_id,
      droneId : brandtype.value,
      serialNo : droneno,
      status : "PENDING",
    }
    setLoading(true)
    ProfileDatasource.addDronerDrone(newDrone).then(
      res =>{
        setImage1(null)
        setImage2(null)
        setBrand(null)
        setBrandType(null)
        setpopupPage(1)
        setdroneno(null);
        setValue(null)
        setValuetype(null)
        setLoading(false)
        actionSheet.current.hide()
        setReload(!reload)
      }
    ).catch(err => console.log(err))
  }

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
          ProfileDatasource.getTaskrevenuedroner().then(
            resRev =>{
              dispatch({
                type : "InitProfile",
                name : `${res.firstname} ${res.lastname}`,
                id : res.dronerCode,
                image : "",
                droneitem : res.dronerDrone,
                status : res.status,
                totalRevenue : resRev.totalRevenue,
                rating : (!resRev.ratingAvg)?"0.00":((parseFloat(resRev.ratingAvg)).toFixed(2)).toString()
              })
            }
          ).catch(err => console.log(err))
        }
        else{
          ProfileDatasource.getImgePathProfile(droner_id!,imgPath[0].path).then(
            resImg => {
              ProfileDatasource.getTaskrevenuedroner().then(
                resRev =>{
                  dispatch({
                    type : "InitProfile",
                    name : `${res.firstname} ${res.lastname}`,
                    id : res.dronerCode,
                    image : resImg.url,
                    droneitem : res.dronerDrone,
                    status : res.status,
                    totalRevenue : resRev.totalRevenue,
                    rating : (!resRev.ratingAvg)?"0.00":((parseFloat(resRev.ratingAvg)).toFixed(2)).toString()
                  })
                }
              ).catch(err => console.log(err))
            }
          )
          .catch(err => console.log(err))
        }
      }
    ).catch(err => console.log(err))
  }
  return (
    <SafeAreaView style={[stylesCentral.container]}>
      {
        (backbotton)?
        <View style={styles.appBar}>
          <Text style={styles.appBarHeader}>โปรไฟล์ของฉัน</Text>
        </View>:
        <View style={styles.appBarBack}>
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Image source={icons.arrowLeft} style={styles.listTileIcon}/>
          </TouchableOpacity>
          <Text style={[styles.appBarHeader]}>โปรไฟล์ของฉัน</Text>
          <View style={styles.listTileIcon}></View>
        </View>
      }
      <View style={[styles.body]}>
        <ScrollView>
        <View style={styles.profile}>
            <View style={styles.profileDescription}>
                <Avatar size={normalize(80)} source={(profilestate.image === "")?icons.account:{uri : profilestate.image}} avatarStyle={{
                  borderRadius : normalize(40)
                }}/>
                <View style={styles.profileName}>
                    <Text style={{
                      fontFamily : font.medium,
                      fontSize : normalize(14),
                      paddingBottom : normalize(2),
                      color : colors.fontBlack
                    }}>{profilestate.name}</Text>
                    <Text style={{
                      fontFamily : font.light,
                      fontSize : normalize(12),
                      color : colors.gray,
                      paddingBottom : normalize(5)
                    }}>{profilestate.id}</Text>
                    <View style={styles.review}>
                        <Text style={{
                          fontFamily : font.medium,
                          color : colors.white,
                          fontSize : normalize(11)
                        }}>{profilestate.rating}</Text>
                        <Image source={icons.review} style={{
                          width : normalize(12),
                          height : normalize(12)
                        }}/>
                    </View>
                    <View style={{
                      marginTop : normalize(10),
                      width : normalize(109),
                      height : normalize(24),
                      borderRadius : normalize(12),
                      display : 'flex',
                      justifyContent : 'center',
                      alignItems : 'center',
                      backgroundColor : StatusObject(profilestate.status).colorBg
                    }}>
                      <Text style={{color: StatusObject(profilestate.status).fontColor,fontFamily : font.light,fontSize : normalize(14)}}>{(StatusObject(profilestate.status).status === "ตรวจสอบแล้ว")?"ยืนยันตัวตนแล้ว":"รอการตรวจสอบ"}</Text>
                    </View>
                </View>
            </View>
            {
              (profilestate.status != "ACTIVE")?
              <TouchableOpacity onPress={()=>{
                navigation.navigate("ViewProfile")
              }}>
                <Text style={{
                fontFamily : font.medium,
                fontSize : normalize(14),
                paddingTop : normalize(8),
                color : colors.fontBlack
              }}>ดูข้อมูล</Text>
              </TouchableOpacity>:
              <TouchableOpacity onPress={()=>{
                navigation.navigate("ViewProfile")
              }}>
              <Text style={{
                fontFamily : font.medium,
                fontSize : normalize(14),
                paddingTop : normalize(8),
                color : colors.fontBlack
              }}>ดูข้อมูล</Text>
              </TouchableOpacity>
            }
        </View>
        <View style={{
          paddingVertical : normalize(15)
        }}>
          <Text style={{
            fontFamily : font.medium,
            fontSize : normalize(16)
          }}>โดรนฉีดพ่นของคุณ</Text>
        </View>
        {
          profilestate.droneitem.map((item :any,index : number)=>(
            <DroneBrandingItem 
              key={index}
              dronebrand={item.drone.series} 
              serialbrand={item.serialNo} 
              status={item.status} 
              image={item.drone.droneBrand.logoImagePath} />
          ))
        }
        <MainButton label="+ เพิ่มโดรน" fontColor={colors.orange} color={'#FFEAD1'} onPress={showActionSheet}/>
        <View style={styles.listTile}>
          <View style={{
            flexDirection : 'row',
            alignItems : 'center'
          }}>
             <Image source={icons.pocket} style={styles.listTileIcon}/>
             <Text style={styles.listTileTitle}>รายได้</Text>
          </View>
          <Text style={styles.revenue}>{`฿${numberWithCommas(profilestate.totalRevenue)}`}</Text>
        </View>
        {
          (profilestate.status !== "ACTIVE")?
          <TouchableOpacity onPress={()=>{
            navigation.navigate("ProfileDocument",{
              tele : profilestate.id
            })
          }}>
            <View style={styles.listTile}>
              <View style={{
                flexDirection : 'row',
                alignItems : 'center'
              }}>
                 <Image source={icons.task} style={styles.listTileIcon}/>
                 <Text style={styles.listTileTitle}>ส่งเอกสารเพิ่มเติม</Text>
              </View>
              <TouchableOpacity onPress={()=>{
                navigation.navigate("ProfileDocument",{
                  tele : profilestate.id
                })
              }}>
                <Image source={icons.arrowRight} style={styles.listTileIcon}/>
              </TouchableOpacity>
            </View>
        </TouchableOpacity>:<></>
        }
        <TouchableOpacity onPress={async()=>{
            await onLogout();
            RootNavigation.navigate('Auth', {
              screen: 'HomeScreen',
            });
          }}>
          <View style={styles.listTile}>
            <View style={{
              flexDirection : 'row',
              alignItems : 'center'
            }}>
               <Image source={icons.logout} style={styles.listTileIcon}/>
               <Text style={styles.listTileTitle}>ออกจากระบบ</Text>
            </View>
            <TouchableOpacity onPress={async()=>{
              await Authentication.logout();
              RootNavigation.navigate('Auth', {
                screen: 'HomeScreen',
              });
            }}>
              <Image source={icons.arrowRight} style={styles.listTileIcon}/>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        </ScrollView>
      </View>
      <ActionSheet 
        ref={actionSheet}
      >
      <View
            style={{
              backgroundColor: 'white',
              paddingVertical: normalize(30),
              paddingHorizontal : normalize(20),
              width: windowWidth,
              height: (windowHeight*0.85),
              borderRadius : normalize(20)
            }}
          >
            <View style={[stylesCentral.container,{
              flex : 1,
              display : 'flex',
              flexDirection : 'column',
              justifyContent : 'space-between'
            }]}>
              {
                (popupPage == 1)?
                (<View style={{
                  flex : 1,
                  justifyContent: 'space-between',
                }}>
                  <ScrollView>
                  <View style={{
                      padding: normalize(8),
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <TouchableOpacity onPress={() => {
                            actionSheet.current.hide()
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
                          listMode='SCROLLVIEW'
                          scrollViewProps={{
                            nestedScrollEnabled : true
                          }}
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
                          }}
                          setValue={setValue}
                          dropDownDirection="BOTTOM"
                          dropDownContainerStyle={{
                            borderColor: colors.disable,
                          }} />
                        <DropDownPicker
                          listMode='SCROLLVIEW'
                          scrollViewProps={{
                            nestedScrollEnabled : true
                          }}
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
                  </ScrollView>
                  <MainButton disable={(!brand || !brandtype || !droneno) ? true : false} label='ถัดไป' color={colors.orange} onPress={addDrone} />
                  </View>):
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
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
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
                        <MainButton fontSize={normalize(14)} label={(!image1)?"เพิ่มเอกสาร":"เปลี่ยน"} color={(!image1)?colors.orange:colors.gray} onPress={uploadFile1}/>
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
                        <MainButton fontSize={normalize(14)} label={(!image2)?"เพิ่มเอกสาร":"เปลี่ยน"} color={(!image2)?colors.orange:colors.gray} onPress={uploadFile2}/>
                      </View>
                    </View>
                    </View>
                    <View>
                    <MainButton disable={(!image2)?true : false} label='ถัดไป' color={colors.orange} onPress={()=>{
                      }} />
                    </View>
                  </View>)
              }
            </View>
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
      </ActionSheet>
    </SafeAreaView>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  btnContainer: {
    width: normalize(343),
    marginVertical: normalize(10),
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  appBar:{
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center'
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
    fontSize : normalize(19),
    color : colors.fontBlack
  },
  body:{
    flex : 9,
    paddingTop : normalize(10),
    paddingHorizontal : normalize(17),
    color : colors.fontBlack
  },
  profile:{
    display : 'flex',
    flexDirection : 'row',
    justifyContent : 'space-between',
    color : colors.fontBlack
  },
  profileDescription:{
    display : 'flex',
    flexDirection : 'row',
    justifyContent : 'center',
    color : colors.fontBlack
  },
  profileName:{
    padding : normalize(10),
    color : colors.fontBlack
  },
  review: {
    width : normalize(52),
    height : normalize(20),
    borderRadius : normalize(10),
    backgroundColor : colors.fontBlack,
    display : 'flex',
    justifyContent : 'space-evenly',
    alignItems : 'center',
    flexDirection : 'row'
  },
  listTile : {
    paddingVertical : normalize(20),
    paddingHorizontal : normalize(10),
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center',
    borderBottomWidth : normalize(0.5),
    borderBottomColor : colors.disable
  },
  listTileIcon : {
    width : normalize(24),
    height : normalize(24)
   },
  listTileTitle : {
    fontFamily: font.medium,
    paddingLeft : normalize(15),
    fontSize : normalize(15),
    color : colors.fontBlack
  },
  h2: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.light,
    fontSize: normalize(14),
    color: colors.gray,
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
  },
  hSheet:{
    fontFamily: font.bold,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  revenue:{
    fontFamily : font.medium,
    fontSize: normalize(16),
    color : '#2EC66E',
    paddingEnd : normalize(8)
  }
});
