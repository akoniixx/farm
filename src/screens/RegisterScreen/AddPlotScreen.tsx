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
  Button,
} from 'react-native';
import React, {useEffect, useRef, useState, useReducer} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, image} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {ProgressBar} from '../../components/ProgressBar';
import Geolocation from 'react-native-geolocation-service';
import fonts from '../../assets/fonts';
import ActionSheet from 'react-native-actions-sheet';
import {icons} from '../../assets';
import Animated from 'react-native-reanimated';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'react-native-image-picker';
import {normalize} from '../../functions/Normalize';
import {PlantSelect} from '../../components/PlantSelect';
import {plantList} from '../../definitions/plants';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {registerReducer} from '../../hook/registerfield';

const AddPlotScreen: React.FC<any> = ({route, navigation}) => {
  const initialFormRegisterState = {
    name: '',
    count: '',
    plot: '',
    landmark: '',
  };
  const fall = new Animated.Value(1);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [lat, setlat] = useState<any>(null);
  const [long, setlong] = useState<any>(null);
  const [plantListSelect, setPlantListSelect] = useState(plantList);
  const [result, setResult] = useState<string[]>([]);
  const [addPlant, setAddPlant] = useState<string>('');
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState({
    latitude: route.latitude,
    longitude: route.longitude,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [formState, dispatch] = useReducer(
    registerReducer,
    initialFormRegisterState,
  );
  useEffect(() => {
    getNameFormLat();
  }, [position]);

  useEffect(() => {
    getLocation();
  }, []);
  const handleSelect = (
    value: any,
    index: number,
    label: string,
    status: boolean,
  ) => {
    const data = [...value];
    data[index].active = !status;
    const resultarray = result.findIndex((e: string) => e === label);
    if (resultarray === -1) {
      result.push(label);
    } else {
      result.splice(index, 1);
    }
    setResult(result);
    setPlantListSelect(data);
  };
  const addSelect = (value: string) => {
    const data = [...plantListSelect];
    const resultarray = data.findIndex(e => e.value === value);
    if (resultarray === -1) {
      const newplant = {value: value, active: true};
      data.push(newplant);
      setPlantListSelect(data);
    }
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
        console.log(responseJson)
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
      });
  };

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="เพิ่มแปลงเกษตร"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.first}>
        <View style={styles.inner}>
          <View style={styles.container}>
            <ScrollView>
              <Text style={[styles.h1, {marginTop: normalize(15)}]}>
                ชื่อแปลงเกษตร
              </Text>
              <TextInput
                onChangeText={value => {
                  dispatch({
                    type: 'Handle Input',
                    field: 'name',
                    payload: value,
                  });
                }}
                value={formState.name}
                style={styles.input}
                editable={true}
                placeholder={'ระบุชื่อแปลงเกษตร'}
                placeholderTextColor={colors.disable}
              />
              <Text style={styles.h1}>จำนวนไร่</Text>
              <TextInput
                onChangeText={value => {
                  dispatch({
                    type: 'Handle Input',
                    field: 'count',
                    payload: value,
                  });
                }}
                value={formState.count}
                style={styles.input}
                editable={true}
                placeholder={'ระบุจำนวนไร่'}
                placeholderTextColor={colors.disable}
              />
              <Text style={styles.h1}>พืชที่ปลูก</Text>
              <View
                style={{
                  top: '5%',
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {plantListSelect.map((v, i) => (
                  <PlantSelect
                    key={i}
                    label={v.value}
                    active={v.active}
                    onPress={() =>
                      handleSelect(plantListSelect, i, v.value, v.active)
                    }
                  />
                ))}
              </View>
              <View style={{top: '3%'}}>
                <TextInput
                  placeholder="พืชอื่นๆ"
                  placeholderTextColor={colors.disable}
                  style={[
                    styles.input,
                    {
                      fontSize: normalize(16),
                      fontFamily: font.SarabunLight,
                      display: 'flex',
                      alignItems: 'center',
                      width: addPlant.length != 0 ? '100%' : '100%',
                      color: colors.fontBlack,
                    },
                  ]}
                  onChangeText={value => setAddPlant(value)}
                />
                {addPlant.length != 0 ? (
                  <TouchableOpacity
                    style={{
                      marginBottom: normalize(10),
                      width: normalize(70),
                      height: normalize(40),
                      borderRadius: 6,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.greenLight,
                    }}
                    onPress={() => addSelect(addPlant)}>
                    <Text style={[styles.h2, {color: colors.white}]}>
                      เพิ่ม
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
              </View>

              <Text style={[styles.h1, {marginTop: normalize(39)}]}>
                สถานที่ใกล้แปลง
              </Text>
              <View
                style={{
                  borderColor: colors.disable,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  marginVertical: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: normalize(50),
                }}>
                <Image
                  source={image.map}
                  style={{
                    width: normalize(24),
                    height: normalize(22),
                    marginRight: 10,
                    tintColor: colors.disable,
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.AnuphanMedium,
                    fontSize: normalize(16),
                    color: colors.gray,
                  }}></Text>
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
                  {/* <Image style={styles.marker} source={image.mark} /> */}
                </View>
              </View>
              <Text style={styles.h1}>จุดสังเกต</Text>
              <TextInput
                onChangeText={value => {
                  dispatch({
                    type: 'Handle Input',
                    field: 'landmark',
                    payload: value,
                  });
                }}
                value={formState.landmark}
                style={styles.input}
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
                onPress={() => navigation.navigate('ThirdFormScreen')}
              />
              <MainButton
              disable={
                !formState.name ||
                !formState.count || 
                // !formState.plot ||
                !formState.landmark 
                  ? true
                  : false
              }
                style={styles.button}
                label="บันทึก"
                color={colors.greenLight}
                onPress={() => navigation.navigate('ThirdFormScreen')}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default AddPlotScreen;

const styles = StyleSheet.create({
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  first: {
    flex: 1,
    justifyContent: 'space-around',
  },
  button: {
    width: normalize(160),
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
    color: colors.fontGrey,
  },
  h2: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(16),
    color: colors.fontGrey,
  },
  h3: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
    color: colors.white,
  },
  varidate: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(12),
    color: 'red',
  },
  hSheet: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(16),
    color: colors.fontGrey,
  },
  label: {
    fontFamily: font.AnuphanLight,
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
    fontFamily: font.SarabunLight,
    height: normalize(56),
    marginVertical: 12,
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontGrey,
    fontSize: normalize(16),
  },
});
