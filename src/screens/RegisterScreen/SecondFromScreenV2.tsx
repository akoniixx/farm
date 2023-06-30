import {
  Alert,
  Image,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import {normalize} from '../../function/Normalize';
import {colors, font, image} from '../../assets';
import {ProgressBarV2} from '../../components/ProgressBarV2';
import React, {useEffect, useState} from 'react';
import fonts from '../../assets/fonts';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {QueryLocation} from '../../datasource/LocationDatasource';
import {MainButton} from '../../components/Button/MainButton';
import {Register} from '../../datasource/AuthDatasource';
import Lottie from 'lottie-react-native';
import Geolocation from 'react-native-geolocation-service';

const SecondFormScreenV2: React.FC<any> = ({navigation, route}) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [lat, setlat] = useState<any>(null);
  const [long, setlong] = useState<any>(null);
  const [provinceId, setProvinceId] = useState<any>(null);
  const [districtId, setDistrictId] = useState<any>(null);
  const [subdistrictId, setSubdistrictId] = useState<any>(null);
  const [position, setPosition] = useState({
    latitude: route.params.latitude,
    longitude: route.params.longitude,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  useEffect(()=>{
    getLocation()
  },[])

  useEffect(() => {
    getNameFormLat();
  }, [position]);

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
            </ScrollView>
            <View style={{backgroundColor: colors.white, zIndex: 0}}>
              <MainButton
                disable={!address}
                color={colors.orange}
                label="ถัดไป"
                onPress={() => {
                  Register.registerStep2V2(
                    address,
                    lat,
                    long,
                    provinceId,
                    districtId,
                    subdistrictId,
                  )
                    .then(res =>
                      navigation.navigate('SuccessScreen', {
                        tele: route.params.telNumber,
                      }),
                    )
                    .catch(err => console.log(err));
                }}
              />
            </View>
          </View>
        </View>
        <Modal transparent={true} visible={loading}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: colors.white,
                width: normalize(50),
                height: normalize(50),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: normalize(8),
              }}>
              <Lottie
                source={image.loading}
                autoPlay
                loop
                style={{
                  width: normalize(50),
                  height: normalize(50),
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
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
});

export default SecondFormScreenV2;
