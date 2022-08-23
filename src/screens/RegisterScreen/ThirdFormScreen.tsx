import {View, Text, StyleSheet, Image, Platform, PermissionsAndroid, ToastAndroid, Linking, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, image} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {ProgressBar} from '../../components/ProgressBar';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';



const ThirdFormScreen: React.FC<any> = ({navigation}) => {
    const [position, setPosition] = useState({
        latitude: 13.7227798,
      longitude:100.5408628,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      });
    useEffect(() => {
      
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
              { text: 'Go to Settings', onPress: openSetting },
              { text: "Don't Use Location", onPress: () => {} },
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
      
const getLocation =  async() => {
    /* const hasPermission = await hasLocationPermission();
    if (hasPermission) {
        Geolocation.getCurrentPosition(
            (pos) => {
                setPosition({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                })
              console.log(pos);
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } */
      setPosition({
        latitude: 13.7227798,
        longitude: 100.5408628,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })

   
}

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
            <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
    initialRegion={position}
    showsUserLocation={true}
  >
    {/* <Marker
       title='Yor are here'
      //  description='This is a description'
       coordinate={position}/> */}
  </MapView>
           
          </ScrollView>
        </View>

        <View style={{backgroundColor: colors.white}}>
          <MainButton
            label="ถัดไป"
            color={colors.orange}
            onPress={() => getLocation()}
          />
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
 
  map: {
   width: normalize(344),
   height:normalize(190)
  },
});
