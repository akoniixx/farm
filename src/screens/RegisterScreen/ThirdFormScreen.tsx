import React, {useEffect, useReducer, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {font, icons} from '../../assets';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';
import {MainButton} from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import {ProgressBar} from '../../components/ProgressBar';
import {normalize} from '../../functions/Normalize';
import {stylesCentral} from '../../styles/StylesCentral';
import Animated from 'react-native-reanimated';
import {plantList} from '../../definitions/plants';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import ActionSheet from 'react-native-actions-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import {registerReducer} from '../../hook/registerfield';
import Geolocation from 'react-native-geolocation-service';
import DroneBrandingItem from '../../components/Plots/Plots';
import PlotsItem from '../../components/Plots/Plots';
import {QueryLocation} from '../../datasource/LocationDatasource';
import {ButtonGroup} from '@rneui/base';
import {image} from '../../assets/index';
import {PlantSelect} from '../../components/PlantSelect/PlantSelect';

const ThirdFormScreen: React.FC<any> = ({route, navigation}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [position, setPosition] = useState({
    latitude: route.latitude,
    longitude: route.longitude,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [openModal, setOpenModal] = useState(false);
  const [value, setValue] = useState(null);
  const [plants, setPlants] = useState<string[]>([]);
  const [brand, setBrand] = useState<any>(null);
  const [plotCount, setPlotCount] = useState<any>('');
  const [plantListSelect, setPlantListSelect] = useState(plantList);
  const [nearPlot, setNearPlot] = useState<any>('');
  const [landMark, setLandMark] = useState<any>('');
  const [address, setAddress] = useState('');
  const [plotDataUI, setplotDataUI] = useState<any>([]);
  const [plotData, setplotData] = useState<any>([]);
  const [provinceId, setProvinceId] = useState<any>(null);
  const [districtId, setDistrictId] = useState<any>(null);
  const [subdistrictId, setSubdistrictId] = useState<any>(null);
  const [lat, setlat] = useState<any>(null);
  const [long, setlong] = useState<any>(null);
  const [plotName, setplotName] = useState<any>(null);
  const actionSheet = useRef<any>();
  const plantSheet = useRef<any>();
  const deTailPlot = useRef<any>();
  const [selectItem, setSelectItem] = useState<any>([]);

  useEffect(() => {
    getNameFormLat();
  }, [position]);

  useEffect(() => {
    getLocation();
  }, []);
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
        console.log(responseJson);
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
  const addPlots = () => {
    const plots = [...plotData];
    const plotsUI = [...plotDataUI];
    const newPlot = {
      plotCount: plotCount,
      plotName: plotName,
      locations: address,
      nearPlot: nearPlot,
      plants: plants,
      status: 'PENDING',
    };
    const newPlotUI = {
      plotName: plotName,
      plotCount: plotCount,
      plant: plants,
      nearPlot: nearPlot,
      location: address,
    };
    plots.push(newPlot);
    plotsUI.push(newPlotUI);
    setValue(null);
    setplotData(plots);
    setplotDataUI(plotsUI);
    setPlants([]);
    setAddress(address);
    setPlotCount(null);
    setplotName(null);
    setNearPlot(null);
    actionSheet.current.hide();
  };
  const deletePlots = () => {
    deTailPlot.current.hide();
  };
  const selectPlants = (value: any, index: number, label: string) => {
    const data = [...value];
    const resultarray = plants.findIndex(e => e === label);
    if (resultarray === -1) {
      plants.push(label);
    }
    setPlants(plants);
    setPlantListSelect(data);
    console.log(resultarray);
    plantSheet.current.hide();
  };

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลงทะเบียนเกษตรกร"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.inner}>
        <View style={styles.container}>
          <View style={{marginBottom: normalize(10)}}>
            <ProgressBar index={3} />
          </View>
          <Text style={styles.h3}>ขั้นตอนที่ 3 จาก 4</Text>
          <Text style={styles.h1}>สร้างแปลงเกษตร</Text>
          <ScrollView>
            {plotDataUI.length === 0 && plotData.length === 0 ? (
              <>
                <View style={styles.rectangleFixed}>
                  <Image style={styles.rectangle} source={image.rectangle} />
                  <Text style={styles.h2}>กดเพื่อเพิ่มแปลงเกษตรของคุณ</Text>
                </View>
                <View style={styles.btAdd}></View>
              </>
            ) : (
              <View
                style={{
                  marginTop: normalize(10),
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.h1,
                    {color: colors.fontGrey, margin: normalize(10)},
                  ]}>
                  แปลงของคุณ
                </Text>
                {plotDataUI.map((item: any, index: number) => (
                  <TouchableOpacity
                    onPress={() => {
                      deTailPlot.current.show();
                    }}>
                    <PlotsItem
                      key={index}
                      plotName={
                        !item.plotName
                          ? 'แปลงที่' + ' ' + `${index + 1}` + ' ' + item.plant
                          : item.plotName
                      }
                      plotCount={item.plotCount}
                      location={item.location}
                      plants={item.plant}
                      landMark={item.landMark}
                      nearPlot={item.nearPlot}
                      status={item.status}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={[styles.buttonAdd, {top: '2%'}]}>
              <Text
                style={styles.textaddplot}
                onPress={() => {
                  actionSheet.current.show();
                }}>
                + เพิ่มแปลงเกษตร
              </Text>
            </View>
          </ScrollView>
        </View>
        <View style={{backgroundColor: colors.white}}>
          <MainButton
            label="ถัดไป"
            color={colors.greenLight}
            onPress={() => navigation.navigate('FourthFormScreen')}
          />
        </View>
        <ActionSheet ref={actionSheet}>
          <View
            style={{
              backgroundColor: colors.white,
              paddingVertical: normalize(10),
              paddingHorizontal: normalize(15),
              width: windowWidth,
              height: windowHeight,
              borderRadius: normalize(20),
            }}>
            <View style={{marginLeft: normalize(-20)}}>
              <CustomHeader
                title="เพิ่มแปลงเกษตร"
                showBackBtn
                onPressBack={() => actionSheet.current.hide()}
              />
            </View>

            <ScrollView>
              <Text style={[styles.head, {marginTop: normalize(15)}]}>
                ชื่อแปลงเกษตร
              </Text>
              <TextInput
                onChangeText={value => {
                  setplotName(value);
                }}
                value={plotName}
                style={[styles.input, {borderColor: colors.disable}]}
                editable={true}
                placeholder={'ระบุชื่อแปลงเกษตร'}
                placeholderTextColor={colors.disable}
              />
              <Text style={styles.head}>จำนวนไร่</Text>
              <TextInput
                onChangeText={value => {
                  setPlotCount(value);
                }}
                value={plotCount}
                style={[styles.input, {borderColor: colors.disable}]}
                editable={true}
                placeholder={'ระบุจำนวนไร่'}
                placeholderTextColor={colors.disable}
              />

              <Text style={styles.head}>พืชที่ปลูก</Text>
              <TouchableOpacity
                onPress={() => {
                  plantSheet.current.show();
                }}>
                <View
                  style={{
                    borderColor: colors.disable,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 10,
                    marginVertical: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: normalize(55),
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.AnuphanMedium,
                      fontSize: normalize(16),
                      color: colors.gray,
                    }}>
                    {!plants ? (
                      <Text
                        style={{
                          fontFamily: font.SarabunLight,
                          color: colors.disable,
                        }}>
                        เลือกพืช
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontFamily: font.SarabunLight,
                          color: colors.fontGrey,
                        }}>
                        {plants}
                      </Text>
                    )}
                  </Text>
                  <Image
                    source={icons.down}
                    style={{
                      width: normalize(24),
                      height: normalize(22),
                      marginRight: 10,
                      tintColor: colors.disable,
                    }}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.head}>สถานที่ใกล้แปลง</Text>
              <View style={styles.input}>
                <Image source={image.map} style={styles.imageStyle} />
                <TextInput
                  onChangeText={value => {
                    setNearPlot(value);
                  }}
                  value={nearPlot}
                  style={{
                    borderColor: colors.disable,
                    fontFamily: font.SarabunLight,
                    fontSize: normalize(16),
                  }}
                  editable={true}
                  placeholder={'เช่น วัด, โรงเรียน, ร้านค้า'}
                  placeholderTextColor={colors.disable}
                />
              </View>

              <View style={{flex: 1}}>
                <MapView.Animated
                  style={styles.map}
                  mapType="satellite"
                  provider={PROVIDER_GOOGLE}
                  initialRegion={position}
                  showsUserLocation={true}
                  onRegionChangeComplete={region => setPosition(region)}
                  showsMyLocationButton={true}
                />
                {/* <View
                  style={[
                    styles.ButtonLocation,
                    {
                      backgroundColor: colors.white,
                      width: normalize(165),
                      height: normalize(50),
                      borderRadius: normalize(50),
                      display: 'flex',
                      flexDirection: 'row',
                      top: normalize(100),
                      left: normalize(170),
                      position: 'absolute',
                      padding: 10,
                      marginVertical: 20,
                      alignItems: 'center',
                    },
                  ]}>
                  <Image
                    source={icons.locate}
                    style={{
                      width: normalize(17),
                      height: normalize(17),
                      marginRight: 5,
                    }}
                  />
                  <TouchableOpacity onPress={goToUsersLocation}>
                    <Text
                      style={{
                        fontFamily: fonts.AnuphanMedium,
                        fontSize: normalize(15),
                        color: colors.fontBlack,
                      }}>
                      ระบุตำแหน่งของฉัน
                    </Text>
                  </TouchableOpacity>
                </View> */}
                <View style={styles.markerFixed}>
                  <Image style={styles.marker} source={image.mark} />
                </View>
              </View>
              <Text style={styles.head}>จุดสังเกต</Text>
              <TextInput
                onChangeText={value => {
                  setLandMark(value);
                }}
                value={brand}
                style={[styles.input, {borderColor: colors.disable}]}
                editable={true}
                placeholder={'ระบุจุดสังเกต'}
                placeholderTextColor={colors.disable}
              />
            </ScrollView>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <MainButton
                style={styles.button}
                label="ยกเลิก"
                color={colors.white}
                borderColor={colors.gray}
                fontColor={colors.fontBlack}
                onPress={() => {
                  actionSheet.current.hide();
                }}
              />
              <MainButton
                style={styles.button}
                label="บันทึก"
                color={colors.greenLight}
                onPress={addPlots}
              />
            </View>
          </View>
          <ActionSheet ref={plantSheet}>
            <View
              style={{
                backgroundColor: 'white',
                paddingVertical: normalize(30),
                paddingHorizontal: normalize(20),
                width: windowWidth,
                height: windowHeight * 0.8,
                borderRadius: normalize(20),
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.head, {marginBottom: normalize(10)}]}>
                  พืชที่ปลูก
                </Text>
                <Text
                  style={{
                    color: colors.greenLight,
                    fontFamily: font.SarabunMedium,
                    fontSize: normalize(16),
                  }}
                  onPress={() => {
                    plantSheet.current.hide();
                  }}>
                  ยกเลิก
                </Text>
              </View>
              <View style={styles.container}>
                <ScrollView>
                  {plantListSelect.map((v, i) => (
                    <TouchableOpacity>
                      <PlantSelect
                        key={i}
                        label={v.value}
                        id={v.id}
                        onPress={() =>
                          selectPlants(plantListSelect, i, v.value)
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ActionSheet>
        </ActionSheet>
        <ActionSheet ref={deTailPlot}>
          {plotDataUI.map((item: any, index: any) => (
            <View
              style={{
                backgroundColor: colors.white,
                paddingVertical: normalize(10),
                paddingHorizontal: normalize(15),
                width: windowWidth,
                height: windowHeight,
                borderRadius: normalize(20),
              }}>
              <View style={{marginLeft: normalize(-20)}}>
                <CustomHeader
                  title="รายละเอียดแปลง"
                  showBackBtn
                  onPressBack={() => deTailPlot.current.hide()}
                />
              </View>
              <ScrollView>
                <Text style={[styles.head, {marginTop: normalize(15)}]}>
                  ชื่อแปลงเกษตร
                </Text>
                <TextInput
                  onChangeText={value => {
                    setplotName(value);
                  }}
                  value={item.plotName}
                  style={[styles.input, {borderColor: colors.disable}]}
                  editable={true}
                  placeholder={'ระบุชื่อแปลงเกษตร'}
                  placeholderTextColor={colors.disable}
                />
                <Text style={styles.head}>จำนวนไร่</Text>
                <TextInput
                  onChangeText={value => {
                    setPlotCount(value);
                  }}
                  value={item.plotCount}
                  style={[styles.input, {borderColor: colors.disable}]}
                  editable={true}
                  placeholder={'ระบุจำนวนไร่'}
                  placeholderTextColor={colors.disable}
                />

                <Text style={styles.head}>พืชที่ปลูก</Text>
                <TouchableOpacity
                  onPress={() => {
                    plantSheet.current.show();
                  }}>
                  <View
                    style={{
                      borderColor: colors.disable,
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                      marginVertical: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: normalize(55),
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.AnuphanMedium,
                        fontSize: normalize(16),
                        color: colors.gray,
                      }}>
                      {!item.plants ? (
                        <Text
                          style={{
                            fontFamily: font.SarabunLight,
                            color: colors.disable,
                          }}>
                          เลือกพืช
                        </Text>
                      ) : (
                        item.plants
                      )}
                    </Text>
                    <Image
                      source={icons.down}
                      style={{
                        width: normalize(24),
                        height: normalize(22),
                        marginRight: 10,
                        tintColor: colors.disable,
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.head}>สถานที่ใกล้แปลง</Text>
                <View style={styles.input}>
                  <Image source={image.map} style={styles.imageStyle} />
                  <TextInput
                    onChangeText={value => {
                      setNearPlot(value);
                    }}
                    value={item.nearPlot}
                    editable={true}
                    style={{
                      fontFamily: font.SarabunLight,
                      fontSize: normalize(16),
                    }}
                    placeholder={'เช่น วัด, โรงเรียน, ร้านค้า'}
                    placeholderTextColor={colors.disable}
                  />
                </View>
                <View style={{flex: 1}}>
                  <MapView.Animated
                    style={styles.map}
                    mapType="satellite"
                    provider={PROVIDER_GOOGLE}
                    initialRegion={position}
                    showsUserLocation={true}
                    onRegionChangeComplete={region => setPosition(region)}
                    showsMyLocationButton={true}
                  />
                  <View style={styles.markerFixed}>
                    <Image style={styles.marker} source={image.mark} />
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: normalize(15),
                  }}>
                  <Image
                    source={icons.delete}
                    style={{
                      width: normalize(24),
                      height: normalize(24),
                      top: normalize(20),
                    }}
                  />

                  <MainButton
                    style={styles.button}
                    label="ลบแปลงเกษตรนี้"
                    color={colors.white}
                    borderColor={colors.white}
                    fontColor={colors.fontBlack}
                    fontFamily={font.AnuphanBold}
                    onPress={() => setOpenModal(true)}
                  />
                </View>
              </ScrollView>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <MainButton
                  style={styles.button}
                  label="ยกเลิก"
                  color={colors.white}
                  borderColor={colors.gray}
                  fontColor={colors.fontBlack}
                  onPress={() => {
                    deTailPlot.current.hide();
                  }}
                />
                <MainButton
                  style={styles.button}
                  label="บันทึก"
                  color={colors.greenLight}
                  onPress={() => {
                    deTailPlot.current.hide();
                  }}
                />
              </View>
            </View>
          ))}
          <Modal transparent={true} visible={openModal}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  padding: normalize(20),
                  backgroundColor: colors.white,
                  width: normalize(345),
                  height: normalize(141),
                  display: 'flex',
                  justifyContent: 'center',
                  borderRadius: normalize(8),
                }}>
                <Text
                  style={[styles.head, {textAlign: 'center', margin: '5%'}]}>
                  ต้องการลบแปลงนี้
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <MainButton
                    style={{width: normalize(150), height: normalize(52)}}
                    label="ลบ"
                    color={colors.error}
                    fontColor={colors.white}
                    onPress={deletePlots}
                  />
                  <MainButton
                    style={{width: normalize(150), height: normalize(52)}}
                    label="ยกเลิก"
                    color={colors.white}
                    borderColor={colors.gray}
                    fontColor={colors.fontGrey}
                    onPress={() => {
                      setOpenModal(false);
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </ActionSheet>
      </View>
    </SafeAreaView>
  );
};
export default ThirdFormScreen;

const styles = StyleSheet.create({
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: 40,
    borderRadius: 5,
    margin: 10,
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
    tintColor: colors.disable,
  },
  ButtonLocation: {
    left: '50%',
    marginLeft: 5,
    marginTop: 40,
    position: 'absolute',
    top: '50%',
  },
  item: {
    top: normalize(20),
    fontSize: normalize(16),
    height: normalize(63),
    fontFamily: font.SarabunLight,
  },
  head: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
    color: colors.fontGrey,
  },
  first: {
    flex: 1,
    justifyContent: 'space-around',
  },
  button: {
    width: normalize(160),
  },
  inner: {
    paddingHorizontal: normalize(15),
    flex: 1,
    justifyContent: 'space-around',
  },
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
  },
  h2: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
    textAlign: 'center',
  },
  h3: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(14),
    color: colors.gray,
  },
  varidate: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(12),
    color: 'red',
  },
  hSheet: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(14),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },

  rectangleFixed: {
    position: 'relative',
    top: '10%',
  },
  btAdd: {
    top: normalize(100),
    borderRadius: 10,
    height: normalize(80),
    width: normalize(340),
    borderStyle: 'dashed',
    position: 'relative',
  },
  buttonAdd: {
    top: normalize(100),
    borderColor: '#1F8449',
    borderWidth: 1,
    borderRadius: 10,
    height: normalize(80),
    width: normalize(340),
    borderStyle: 'dashed',
    position: 'relative',
  },
  textaddplot: {
    fontFamily: fonts.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
    textAlign: 'center',
    top: '30%',
  },
  rectangle: {
    height: normalize(170),
    width: normalize(375),
    bottom: '15%',
    alignSelf: 'center',
  },
  map: {
    width: normalize(344),
    height: normalize(190),
    borderRadius: normalize(20),
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
    display: 'flex',
    paddingHorizontal: normalize(10),
    alignItems: 'center',
    flexDirection: 'row',
    height: normalize(56),
    marginVertical: 12,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
  },
});
