import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import {normalize} from '../../function/Normalize';
import {colors, font, icons, image} from '../../assets';
import {ProgressBarV2} from '../../components/ProgressBarV2';
import React, {useEffect, useState} from 'react';
import fonts from '../../assets/fonts';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {QueryLocation} from '../../datasource/LocationDatasource';
import {MainButton} from '../../components/Button/MainButton';
import {Register} from '../../datasource/AuthDatasource';
import Lottie from 'lottie-react-native';
import Geolocation from 'react-native-geolocation-service';

interface AreaServiceEntity {
  area: string;
  latitude: number;
  longitude: number;
  provinceId: number;
  districtId: number;
  subdistrictId: number;
  locationName: string;
}

const SecondFormScreenV2: React.FC<any> = ({navigation, route}) => {
  const [address, setAddress] = useState('');
  const [searchActive, setSearchActive] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [lat, setlat] = useState<any>(null);
  const [long, setlong] = useState<any>(null);
  const [provinceId, setProvinceId] = useState<any>(null);
  const [districtId, setDistrictId] = useState<any>(null);
  const [subdistrictId, setSubdistrictId] = useState<any>(null);
  const [edit,setEdit] = useState<boolean>(false)
  const [data, setData] = useState<AreaServiceEntity[]>([]);
  const [dataStore, setDataStore] = useState<AreaServiceEntity[]>([]);
  const [dataRender, setDataRender] = useState<AreaServiceEntity[]>([]);
  const [page, setPage] = useState<number>(0);
  const [searchResult, setSearchResult] = useState<string>("");
  const [position, setPosition] = useState({
    latitude: route.params.latitude,
    longitude: route.params.longitude,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  const [positionForm, setPositionForm] = useState<AreaServiceEntity>({
    area: "",
    latitude: route.params.latitude,
    longitude: route.params.longitude,
    provinceId: 0,
    districtId: 0,
    subdistrictId: 0,
    locationName: "",
  });

  useEffect(()=>{
    // getLocation()
  },[])

  useEffect(() => {
    // getNameFormLat();
  }, [position]);

  useEffect(() => {
    QueryLocation.getSubdistrictArea(0, '').then(res => {
      let all = res.map((item: any) => {
        return {
          area: `${item.subdistrictName}/${item.districtName}/${item.provinceName}`,
          latitude: item.lat,
          longitude: item.long,
          provinceId: item.provinceId,
          districtId: item.districtId,
          subdistrictId: item.subdistrictId,
        };
      });
      setData(all);
    })
  }, []);

  const onChangeText = (text: string) => {
    setSearchActive(text);
  };

  useEffect(() => {
    setPage(0);
    let filter = data.filter(str => str.area.includes(searchActive));
    let arr = [];
    for (let i = 0; i < 20; i++) {
      if (!!filter[i]) {
        arr.push(filter[i]);
      }
    }
    setDataStore(filter);
    setDataRender(arr);
  }, [searchActive]);

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
        'Turn on Location Services to allow  to determine your location.',
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
        setlat(responseJson.results[0].geometry.location.lat);
        setlong(responseJson.results[0].geometry.location.lng);
        setAddress(
          responseJson.results[0].address_components[0].long_name +
            ' ' +
            responseJson.results[0].address_components[2].long_name +
            ' ' +
            responseJson.results[0].address_components[3].long_name +
            ' ' +
            responseJson.results[0].address_components[4].long_name,
        );
        QueryLocation.QueryProvince()
          .then(item => {
            item.map((Province: any) => {
              if (
                Province.provinceName ==
                `จังหวัด${responseJson.results[0].address_components[3].long_name}`
              ) {
                setProvinceId(Province.provinceId);
                QueryLocation.QueryDistrict(Province.provinceId)
                  .then((itemDistrict: any) => {
                    itemDistrict.map((District: any) => {
                      if (
                        District.districtName ===
                        `${
                          responseJson.results[0].address_components[2].long_name.split(
                            ' ',
                          )[0]
                        }${
                          responseJson.results[0].address_components[2].long_name.split(
                            ' ',
                          )[1]
                        }`
                      ) {
                        setDistrictId(District.districtId);
                        QueryLocation.QuerySubDistrict(
                          District.districtId,
                          District.districtName,
                        )
                          .then(itemSubDistrict => {
                            itemSubDistrict.map((SubDistrict: any) => {
                              if (
                                SubDistrict.districtName ===
                                `${
                                  responseJson.results[0].address_components[2].long_name.split(
                                    ' ',
                                  )[0]
                                }${
                                  responseJson.results[0].address_components[2].long_name.split(
                                    ' ',
                                  )[1]
                                }`
                              ) {
                                setSubdistrictId(SubDistrict.subdistrictId);
                              }
                            });
                          })
                          .catch(err => console.log(err));
                      }
                    });
                  })
                  .catch(err => console.log(err));
              }
            });
          })
          .catch(err => console.log(err));
      });
  };
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
                  <ProgressBarV2 index={2} />
               </View>
               <Text style={styles.label}>ขั้นตอนที่ 2 จาก 2</Text>
               <Text style={styles.h1}>กรอกข้อมูลการบินโดรน</Text>
               {edit ? (
              <View
              style={{
                flex: 1,
                // paddingTop: normalize(10),
              }}>
              <View style={{}}>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: normalize(16),
                    color: colors.fontBlack,
                  }}>
                  ค้นหาพื้นที่ให้บริการของคุณด้วยชื่อ ตำบล /อำเภอ /จังหวัด
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: normalize(16),
                    color: colors.darkOrange,
                  }}>
                  โดยไม่ต้องพิมพ์คำนำหน้าด้วยคำว่า ต., ตำบล, อ., อำเภอ, จ.,
                  จังหวัด
                </Text>
                <TextInput
                  clearButtonMode={'always'}
                  style={[
                    styles.inputvalue,
                    {
                      marginTop: normalize(20),
                      borderWidth: normalize(1),
                      paddingVertical: normalize(15),
                      paddingHorizontal: normalize(10),
                      borderColor: colors.gray,
                      borderRadius: normalize(12),
                    },
                  ]}
                  value={searchActive}
                  onChangeText={val => onChangeText(val)}
                  placeholder="ระบุชื่อตำบล หรือ ชื่ออำเภอ หรือ ชื่อจังหวัด"
                  placeholderTextColor={colors.gray}
                />
              </View>
              {searchActive.length != 0 ? (
                <View
                  style={{
                    height: '70%',
                  }}>
                  {dataRender.length != 0 ? (
                    <FlatList
                      onScrollEndDrag={() => {
                        if (dataStore.length > dataRender.length) {
                          setPage(page + 1);
                        }
                      }}
                      data={dataRender}
                      renderItem={({item}) => (
                        <Pressable
                          onPress={() => {
                            setEdit(false);
                            setPage(0);
                            setSearchResult(item.area);
                            setSearchActive('');
                            setPosition({
                              ...position,
                              latitude: parseFloat(item.latitude.toString()),
                              longitude: parseFloat(item.longitude.toString()),
                            });
                            setPositionForm({
                              ...positionForm,
                              area: item.area,
                              latitude: parseFloat(item.latitude.toString()),
                              longitude: parseFloat(item.longitude.toString()),
                              provinceId: item.provinceId,
                              districtId: item.districtId,
                              subdistrictId: item.subdistrictId,
                            });
                          }}>
                          <View
                            style={{
                              padding: normalize(15),
                              borderBottomColor: colors.disable,
                              borderBottomWidth: normalize(0.5),
                            }}>
                            <Text
                              style={{
                                fontFamily: fonts.medium,
                                fontSize: normalize(16),
                                color : colors.fontBlack
                              }}>
                              {item.area}
                            </Text>
                          </View>
                        </Pressable>
                      )}
                      keyExtractor={item => item.area}
                    />
                  ) : (
                    <View
                      style={{
                        flex: 7,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={image.emptyareaservice}
                        style={{
                          width: normalize(137),
                          height: normalize(119),
                          marginBottom: normalize(20),
                        }}
                      />
                      <Text style={styles.inputvalue}>
                        ไม่พบพื้นที่ดังกล่าว
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <View
                  style={{
                    height: '60%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={image.emptyareaservice}
                    style={{
                      width: normalize(137),
                      height: normalize(119),
                      marginBottom: normalize(20),
                    }}
                  />
                  <Text style={styles.inputvalue}>
                    กรุณาค้นหาพื้นที่ให้บริการหลัก
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={{}}>
              <View
                style={{
                  marginTop : normalize(20)
                  // padding: normalize(17),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.servicearea}
                    style={{
                      width: normalize(24),
                      height: normalize(24),
                    }}
                  />
                  <Text
                    style={{
                      paddingLeft: normalize(10),
                      fontFamily: font.medium,
                      fontSize: normalize(16),
                    }}>
                    พื้นที่ให้บริการหลัก
                  </Text>
                </View>
                <Pressable onPress={() => setEdit(true)}>
                  <View style={[styles.input, {marginVertical: normalize(20)}]}>
                    <Text style={styles.label}>ตำบล/ อำเภอ/ จังหวัด</Text>
                    <TextInput
                      value={searchResult}
                      style={styles.inputvalue}
                      editable={false}
                      placeholderTextColor={colors.disable}
                    />
                  </View>
                </Pressable>
                <Text style={styles.inputvalue}>
                  ระยะทางพื้นที่ให้บริการหลักระหว่าง 50-100 กม.
                </Text>
                <View style={{position: 'relative'}}>
                  <MapView.Animated
                    mapType={'satellite'}
                    zoomEnabled={true}
                    minZoomLevel={14}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    region={position}
                    showsUserLocation={true}
                    onRegionChangeComplete={region => {
                      setPosition(region);
                      setPositionForm({
                        ...positionForm,
                        latitude: parseFloat(region.latitude.toString()),
                        longitude: parseFloat(region.longitude.toString()),
                      });
                    }}
                  />
                  <View style={styles.markerFixed}>
                    <Image style={styles.marker} source={image.marker} />
                  </View>
                </View>
              </View>
            </View>
          )}
              </View>
              {
                edit ? <></>:
                <View style={{
                  marginBottom : normalize(20)
                }}>
                <MainButton
                  disable={positionForm.provinceId === 0}
                  onPress={() => {
                    Register.registerStep2V2(
                      positionForm.latitude.toString(),
                      positionForm.longitude.toString(),
                      positionForm.provinceId,
                      positionForm.districtId,
                      positionForm.subdistrictId
                    ).then(res =>
                      navigation.navigate('SuccessScreen', {
                        tele: route.params.telNumber,
                      }),
                    )
                    .catch(err => console.log(err));
                  }}
                  label="ถัดไป"
                  color={colors.orange}
                />
              </View>
              }
          </View>
        </View>
    </SafeAreaView>
  );
  // return (
  //   <SafeAreaView style={stylesCentral.container}>
  //     <CustomHeader
  //       title="ลงทะเบียนนักบินโดรน"
  //       showBackBtn
  //       onPressBack={() => navigation.goBack()}
  //     />
  //     <View style={styles.first}>
  //       <View style={styles.inner}>
  //         <View style={styles.container}>
  //           <View style={{marginBottom: normalize(10)}}>
  //             <ProgressBarV2 index={2} />
  //           </View>
  //           <Text style={styles.label}>ขั้นตอนที่ 2 จาก 2</Text>
  //           <Text style={styles.h1}>กรอกข้อมูลการบินโดรน</Text>
  //           <ScrollView>
  //             <Text style={[styles.h1, {marginTop: normalize(39)}]}>
  //               พื้นที่ให้บริการหลัก
  //             </Text>
  //             <View
  //               style={{
  //                 borderColor: colors.gray,
  //                 borderWidth: 1,
  //                 padding: 10,
  //                 borderRadius: 10,
  //                 marginVertical: 20,
  //                 flexDirection: 'row',
  //                 alignItems: 'center',
  //               }}>
  //               <Image
  //                 source={image.map}
  //                 style={{
  //                   width: normalize(24),
  //                   height: normalize(22),
  //                   marginRight: 10,
  //                 }}
  //               />
  //               <Text
  //                 style={{
  //                   fontFamily: fonts.medium,
  //                   fontSize: normalize(16),
  //                   color: colors.gray,
  //                 }}>
  //                 {address}
  //               </Text>
  //             </View>
  //             <View style={{flex: 1}}>
  //               <MapView.Animated
  //                 style={styles.map}
  //                 provider={PROVIDER_GOOGLE}
  //                 initialRegion={position}
  //                 showsUserLocation={true}
  //                 onRegionChangeComplete={region => setPosition(region)}
  //                 showsMyLocationButton={true}
  //               />
  //               <View style={styles.markerFixed}>
  //                 <Image style={styles.marker} source={image.marker} />
  //               </View>
  //             </View>
  //           </ScrollView>
  //           <View style={{backgroundColor: colors.white, zIndex: 0}}>
  //             <MainButton
  //               disable={!address}
  //               color={colors.orange}
  //               label="ถัดไป"
  //               onPress={() => {
                  // Register.registerStep2V2(
  //                   address,
  //                   lat,
  //                   long,
  //                   provinceId,
  //                   districtId,
  //                   subdistrictId,
  //                 )
  //                   .then(res =>
  //                     navigation.navigate('SuccessScreen', {
  //                       tele: route.params.telNumber,
  //                     }),
  //                   )
  //                   .catch(err => console.log(err));
  //               }}
  //             />
  //           </View>
  //         </View>
  //       </View>
  //       <Modal transparent={true} visible={loading}>
  //         <View
  //           style={{
  //             flex: 1,
  //             backgroundColor: 'rgba(0,0,0,0.5)',
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //           }}>
  //           <View
  //             style={{
  //               backgroundColor: colors.white,
  //               width: normalize(50),
  //               height: normalize(50),
  //               display: 'flex',
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //               borderRadius: normalize(8),
  //             }}>
  //             <Lottie
  //               source={image.loading}
  //               autoPlay
  //               loop
  //               style={{
  //                 width: normalize(50),
  //                 height: normalize(50),
  //               }}
  //             />
  //           </View>
  //         </View>
  //       </Modal>
  //     </View>
  //   </SafeAreaView>
  // );
};

const styles = StyleSheet.create({
  first: {
    flex: 1,
    justifyContent: 'space-around',
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
    marginTop: normalize(24),
  },
  label: {
    fontFamily: font.light,
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
    color: colors.fontBlack,
  },
  map: {
    width: "100%",
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
  inputvalue: {
    fontFamily: font.light,
    color: colors.fontBlack,
    fontSize: normalize(16),
  },
});

export default SecondFormScreenV2;
