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
} from 'react-native';
import React, {useEffect, useState} from 'react';
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

const ThirdFormScreen: React.FC<any> = ({navigation}) => {
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [address, setAddress] = useState('');
  const [plantListSelect, setPlantListSelect] = useState(plantList);
  useEffect(() => {
    getNameFormLat();
  }, [position]);
  useEffect(() => {
    getLocation();
  }, []);

  const handleSelect = (value:any) => {
    console.log(value)
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
        setAddress(
          responseJson.results[0].address_components[0].long_name +
            ' ' +
            responseJson.results[0].address_components[2].long_name +
            ' ' +
            responseJson.results[0].address_components[3].long_name +
            ' ' +
            responseJson.results[0].address_components[4].long_name,
        );
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

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลงทะเบียนนักบินโดรน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />

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
                height: normalize(140),
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignContent: 'space-between',
              }}>
              {plantListSelect.map((v, i) => (
                <PlantSelect
                  key={i}
                  label={v.value}
                  active={v.active}
                  onPress={() => handleSelect(v)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={{backgroundColor: colors.white}}>
          <MainButton label="ถัดไป" color={colors.orange} />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ThirdFormScreen;

const styles = StyleSheet.create({
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
});
