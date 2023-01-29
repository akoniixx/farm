import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  Image,
  View,
  StyleSheet,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Linking,
  Alert,
  PermissionsAndroid,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, image } from '../../../assets';
import { MainButton } from '../../../components/Button/MainButton';
import CustomHeader from '../../../components/CustomHeader';
import { normalize } from '../../../functions/Normalize';
import { initProfileState, profileReducer } from '../../../hook/profilefield';
import { stylesCentral } from '../../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileDatasource } from '../../../datasource/ProfileDatasource';
import PlotsItem from '../../../components/Plots/Plots';
import { useDebounceValue } from '../../../hook/useDebounceValue';
import { plant } from '../../../definitions/plants';
import PredictionType from '../../RegisterScreen/ThirdFormScreen';
import fonts from '../../../assets/fonts';
import icons from '../../../assets/icons/icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ActionSheet from 'react-native-actions-sheet';
import { PlantSelect } from '../../../components/PlantSelect/PlantSelect';
import SearchBarWithAutocomplete from '../../../components/SearchBarWithAutocomplete';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { useDebounce } from '../../../hook/useDebounce';
import { QueryLocation } from '../../../datasource/LocationDatasource';
import { LAT_LNG_BANGKOK } from '../../../definitions/location';
import { PlotDatasource } from '../../../datasource/PlotDatasource';
import Spinner from 'react-native-loading-spinner-overlay/lib';

export type PredictionType = {
  description: string;
  place_id: string;
  reference: string;
  matched_substrings: any[];
  tructured_formatting: Object[];
  terms: Object[];
  types: string[];
};

const EditPlotScreen: React.FC<any> = ({ navigation, route }) => {
  const [data, setData] = useState<any>();
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({
    latitude: LAT_LNG_BANGKOK.lat,
    longitude: LAT_LNG_BANGKOK.lng,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.042,
  });
  const telNo = route.params;
  const [location, setLocation] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const debounceValue = useDebounceValue(searchValue, 800);
  const [searchLocation] = useState('');
  const [selectPlot, setSelectPlot] = useState<any>();
  const [count, setCount] = useState(1);
  const [plotIndex, setPlotIndex] = useState(1);
  const [value, setValue] = useState(null);
  const [plantName, setPlantName] = useState<any>();
  const [raiAmount, setraiAmount] = useState<any>();
  const [plantListSelect, setPlantListSelect] = useState(plant);
  const [landmark, setlandmark] = useState<any>('');
  const [plotDataUI, setplotDataUI] = useState<any>([]);
  const [plotData, setplotData] = useState<any>([]);
  const [lat, setlat] = useState<any>();
  const [long, setlong] = useState<any>();
  const [plotName, setplotName] = useState<any>(null);
  const actionSheet = useRef<any>();
  const plantSheet = useRef<any>();
  const deTailPlot = useRef<any>();
  const mapSheet = useRef<any>();
  const plotArea = useRef<any>();
  const [plotAreas, setPlotAreas] = useState<any>([]);
  const [search, setSearch] = useState<any>({
    term: '',
    fetchPredictions: false,
  });
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictions, setPredictions] = useState<PredictionType[]>([]);
  const GOOGLE_PACES_API_BASE_URL =
    'https://maps.googleapis.com/maps/api/place';
  const API_KEY = 'AIzaSyAymsbEe0NVhDL8iHd8oabbr5xG0TFn8Jc';

  useEffect(() => {
    getFarmerPlot();
  }, []);
  const getFarmerPlot = async () => {
    setLoading(true);
    const plotId = await AsyncStorage.getItem('plot_id');
    PlotDatasource.getFarmerPlotById(plotId!)
      .then(res => {
        setData(res);
        setplotName(res.plotName);
        setPlantName(res.plantName);
        setraiAmount(res.raiAmount);
        setlandmark(res.landmark);
        setSelectPlot(res.plotArea);
        // setlat(res.lat);
        // setlong(res.long);
        setPosition(prev => ({
          ...prev,
          latitude: parseFloat(res.lat),
          longitude: parseFloat(res.long),
        }));
        setSearch({ term: res.locationName });
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getLocation();
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        'Turn on Location Services to allow  to determine your location.',
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
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };
  const incrementCount = () => {
    setCount(count + 1);
    setPlotIndex(plotIndex + 1);
  };

  const selectPlants = (value: any) => {
    setPlantName(value);
    plantSheet.current.hide();
  };
  const selectPlotArea = (value: any) => {
    console.log(value);
    setSelectPlot(value);
    plotArea.current.hide();
  };

  const onChangeText = async () => {
    if (!search.fetchPredictions) return;
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${API_KEY}&input=${search.term}`;
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });
      if (result) {
        const {
          data: { predictions },
        } = result;
        setPredictions(predictions);
        setShowPredictions(true);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useDebounce(onChangeText, 0, [search.term]);
  const onPredictionTapped = async (placeId: string, description: string) => {
    const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/details/json?key=${API_KEY}&place_id=${placeId}`;
    try {
      const result = await axios.request({
        method: 'post',
        url: apiUrl,
      });
      if (result) {
        const {
          data: {
            result: {
              geometry: { location },
            },
          },
        } = result;
        const { lat, lng } = location;
        setlat(lat);
        setlong(lng);
        setPosition(prev => ({
          ...prev,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        }));
        setShowPredictions(false);
        setSearch({ term: description, fetchPredictions: false });
        mapSheet.current.hide();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchLocation = async (text?: string) => {
    await QueryLocation.getSubdistrictIdCreateNewPlot().then(res => {
      setLocation(res);
    });
  };

  useEffect(() => {
    const filterBySearchText = () => {
      if (!!debounceValue && location) {
        const words: {
          districtName: string;
          provinceName: string;
          subdistrictName: string;
        }[] = location;
        const result = words
          .filter(word => {
            return (
              word.districtName.includes(debounceValue) ||
              word.subdistrictName.includes(debounceValue) ||
              word.provinceName.includes(debounceValue)
            );
          })
          .slice(0, 10);
        setPlotAreas(result);
      }
    };
    filterBySearchText();
  }, [debounceValue, location]);

  const searchPlotArea = (value: string) => {
    setSearchValue(value);
  };
  const deletePlot = (value: any) => {
    let someArray = plotData;
    someArray = someArray.filter((x: any) => x != value);
    setplotData(someArray);
    setplotDataUI(someArray);
    deTailPlot.current.hide();
  };

  return (
    <>
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title="แก้ไขแปลงเกษตร"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.inner}>
          <View style={styles.container}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View style={{ justifyContent: 'space-around' }}>
                <View style={styles.inner}>
                  <View style={styles.container}></View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={[styles.head, { marginTop: normalize(15) }]}>
                    ชื่อแปลงเกษตร
                  </Text>
                  <TextInput
                    clearTextOnFocus={true}
                    onChangeText={value => {
                      setplotName(value);
                    }}
                    defaultValue={plotName}
                    style={[styles.input, { borderColor: colors.disable }]}
                    editable={true}
                    placeholder={
                      !plotName
                        ? `แปลงที่ ${profilestate.plotItem.length + 1} ${
                            plantName !== null && plantName !== undefined
                              ? plantName
                              : ''
                          }`
                        : plotName
                    }
                    placeholderTextColor={colors.fontGrey}
                  />
                  <Text style={styles.head}>
                    จำนวนไร่{' '}
                    <Text style={{ fontSize: normalize(16) }}>(โดยประมาณ)</Text>
                  </Text>
                  <TextInput
                    onChangeText={value => {
                      const newNumber = value.replace(/[^0-9]/g, '');
                      setraiAmount(newNumber);
                    }}
                    keyboardType={'numeric'}
                    value={raiAmount}
                    style={[styles.input, { borderColor: colors.disable }]}
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
                        {!plantName ? (
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
                            {plantName}
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
                  <Text style={styles.head}>พื้นที่แปลงเกษตร</Text>
                  <TouchableOpacity
                    onPress={() => {
                      plotArea.current.show();
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
                      }}>
                      <Image
                        source={icons.search}
                        style={{
                          width: normalize(22),
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
                        }}>
                        {!selectPlot ? (
                          <Text
                            style={{
                              fontFamily: font.SarabunLight,
                              color: colors.disable,
                            }}>
                            ระบุตำบล / อำเภอ / จังหวัด
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontFamily: font.SarabunLight,
                              color: colors.fontGrey,
                            }}>
                            {selectPlot.subdistrictName +
                              '/' +
                              selectPlot.districtName +
                              '/' +
                              selectPlot.provinceName}
                          </Text>
                        )}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.head}>สถานที่ใกล้แปลง</Text>
                  <TouchableOpacity
                    onPress={() => {
                      mapSheet.current.show();
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
                      }}>
                      <Image source={image.map} style={styles.imageStyle} />
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: fonts.AnuphanMedium,
                          fontSize: normalize(16),
                          color: colors.gray,
                        }}>
                        {!search.term ? (
                          <Text
                            style={{
                              fontFamily: font.SarabunLight,
                              color: colors.disable,
                            }}>
                            เช่น วัด, โรงเรียน, ร้านค้า
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontFamily: font.SarabunLight,
                              color: colors.fontGrey,
                            }}>
                            {search.term}
                          </Text>
                        )}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {position.latitude && position.longitude ? (
                    <View style={{ flex: 1 }}>
                      <MapView.Animated
                        mapType="satellite"
                        minZoomLevel={14}
                        maxZoomLevel={18}
                        style={styles.map}
                        onPress={e => {
                          setPosition({
                            ...position,
                            latitude: e.nativeEvent.coordinate.latitude,
                            longitude: e.nativeEvent.coordinate.longitude,
                          });
                        }}
                        provider={PROVIDER_GOOGLE}
                        region={{
                          latitude: position.latitude,
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.042,
                          longitude: position.longitude,
                        }}
                        showsUserLocation={true}
                        showsMyLocationButton={true}>
                        <Marker
                          image={image.mark}
                          coordinate={{
                            latitude: position?.latitude,
                            longitude: position?.longitude,
                          }}
                        />
                      </MapView.Animated>
                    </View>
                  ) : (
                    <View />
                  )}
                  <Text style={styles.head}>จุดสังเกต</Text>
                  <TextInput
                    onChangeText={value => {
                      setlandmark(value);
                    }}
                    value={landmark}
                    style={[styles.input, { borderColor: colors.disable }]}
                    editable={true}
                    placeholder={'ระบุจุดสังเกต'}
                    placeholderTextColor={colors.disable}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <MainButton
                      style={styles.button}
                      label="ยกเลิก"
                      color={colors.white}
                      borderColor={colors.gray}
                      fontColor={colors.fontBlack}
                      onPress={() => {
                        navigation.navigate('AllPlotScreen');
                      }}
                    />
                    <MainButton
                      style={styles.button}
                      label="บันทึก"
                      disable={
                        !raiAmount ||
                        !plantName ||
                        !lat ||
                        !long ||
                        !search.term ||
                        !landmark ||
                        !selectPlot.subdistrictId
                          ? true
                          : false
                      }
                      color={colors.greenLight}
                      onPress={() => {
                        setLoading(true);
                        PlotDatasource.updateFarmerPlot(
                          plotName,
                          raiAmount,
                          landmark,
                          plantName,
                          lat,
                          long,
                          search.term,
                          selectPlot.subdistrictId,
                        )
                          .then(res => {
                            setLoading(false);
                            navigation.navigate('AllPlotScreen');
                          })
                          .catch(err => {
                            setLoading(false);
                            console.log(err);
                          });
                      }}
                    />
                  </View>
                  <View style={{ height: normalize(10) }}></View>
                </ScrollView>
              </View>
              <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: '#FFF' }}
              />
            </KeyboardAvoidingView>

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
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.head, { marginBottom: normalize(10) }]}>
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
                          label={v}
                          id={v}
                          onPress={() => selectPlants(v)}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </ActionSheet>

            <ActionSheet ref={plotArea}>
              <View
                style={{
                  backgroundColor: 'white',
                  paddingVertical: normalize(30),
                  paddingHorizontal: normalize(20),
                  width: windowWidth,
                  height: windowHeight,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.head, { marginBottom: normalize(10) }]}>
                    พื้นที่แปลงเกษตร
                  </Text>
                  <Text
                    style={{
                      color: colors.greenLight,
                      fontFamily: font.SarabunMedium,
                      fontSize: normalize(16),
                    }}
                    onPress={() => {
                      plotArea.current.hide();
                    }}>
                    ยกเลิก
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      marginBottom: normalize(10),
                      fontFamily: fonts.SarabunLight,
                      fontSize: normalize(16),
                      color: colors.gray,
                    }}>
                    {`กรุณาพิมพ์ค้นหาพื้นที่แปลงเกษตรของคุณ
ด้วยชื่อ ตำบล / อำเภอ / จังหวัด`}
                  </Text>
                </View>
                <View style={styles.container}>
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
                    <TextInput
                      onChangeText={searchPlotArea}
                      value={searchValue}
                      defaultValue={searchValue}
                      style={[
                        {
                          marginLeft: 5,
                          height: 60,
                          justifyContent: 'center',
                          lineHeight: 19,
                          fontSize: 19,
                          flex: 1,
                          width: '100%',
                          color: colors.fontBlack,
                          fontFamily: font.SarabunLight,
                        },
                      ]}
                      editable={true}
                      placeholder={'ระบุพื้นที่แปลงเกษตร'}
                      placeholderTextColor={colors.disable}
                    />

                    {searchValue ? (
                      <TouchableOpacity
                        style={styles.clearBtn}
                        onPress={() => setSearchValue('')}>
                        <Icon name="close" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <ScrollView>
                    {plotAreas !== undefined &&
                      plotAreas.map((v: any, i: any) => (
                        <TouchableOpacity>
                          <PlantSelect
                            key={i}
                            label={
                              v.subdistrictName +
                              '/' +
                              v.districtName +
                              '/' +
                              v.provinceName
                            }
                            id={v}
                            onPress={() => {
                              selectPlotArea(v);
                              setPosition(prev => ({
                                ...prev,
                                latitude: parseFloat(v.lat),
                                longitude: parseFloat(v.long),
                              }));
                            }}
                          />
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              </View>
            </ActionSheet>

            <ActionSheet ref={mapSheet}>
              <View
                style={{
                  backgroundColor: 'white',
                  paddingVertical: normalize(30),
                  paddingHorizontal: normalize(20),
                  width: windowWidth,
                  height: windowHeight * 0.7,
                  borderRadius: normalize(20),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.head, { marginBottom: normalize(10) }]}>
                    สถานที่ใกล้แปลง
                  </Text>
                  <Text
                    style={{
                      color: colors.greenLight,
                      fontFamily: font.SarabunMedium,
                      fontSize: normalize(16),
                    }}
                    onPress={() => {
                      mapSheet.current.hide();
                    }}>
                    ยกเลิก
                  </Text>
                </View>
                <View style={styles.container}>
                  <SearchBarWithAutocomplete
                    value={search.term}
                    onChangeText={(text: any) => {
                      setSearch({ term: text, fetchPredictions: true });
                    }}
                    showPredictions={showPredictions}
                    predictions={predictions}
                    onPredictionTapped={onPredictionTapped}
                  />
                </View>
              </View>
            </ActionSheet>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
export default EditPlotScreen;
const styles = StyleSheet.create({
  empty_state: {
    alignSelf: 'center',
    top: '10%',
  },
  list: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.fontGrey,
  },
  textPending: {
    width: normalize(350),
    height: normalize(70),
    backgroundColor: '#FFF9F2',
    borderRadius: normalize(12),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  search: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    alignItems: 'flex-end',
    tintColor: colors.fontGrey,
  },
  body: {
    paddingHorizontal: 20,
  },
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
  clearBtn: {
    flex: 0.1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    top: normalize(40),
    borderColor: '#1F8449',
    borderWidth: 1,
    borderRadius: 10,
    height: normalize(80),
    width: normalize(330),
    borderStyle: 'dashed',
    position: 'relative',
    alignSelf: 'center',
  },
  textaddplot: {
    fontFamily: font.AnuphanBold,
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
    alignSelf: 'center',
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
