import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import Geolocation from 'react-native-geolocation-service';

import React, { useEffect, useReducer, useRef, useState } from 'react';
import { colors, font, icons, image } from '../../../assets';
import { normalize } from '../../../functions/Normalize';
import InputTextLabel from '../../../components/InputText/InputTextLabel';
import { mixpanel } from '../../../../mixpanel';
import { MainButton } from '../../../components/Button/MainButton';
import { LocationPermission } from '../../../functions/permissionRequest';
import { LAT_LNG_BANGKOK } from '../../../definitions/location';
import { ProfileDatasource } from '../../../datasource/ProfileDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CropDatasource } from '../../../datasource/CropDatasource';
import fonts from '../../../assets/fonts';
import useTimeSpent from '../../../hook/useTimeSpent';
import { SubmitPlotType } from './AddPlotScreen';
import axios from 'axios';
import { QueryLocation } from '../../../datasource/LocationDatasource';
import { initProfileState, profileReducer } from '../../../hook/profilefield';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ActionSheet from 'react-native-actions-sheet';
import { PlantSelect } from '../../../components/PlantSelect/PlantSelect';
import InfoCircleButton from '../../../components/InfoCircleButton';
import { Modal } from 'react-native-paper';
import ModalMapLocation from '../../../components/Modal/ModalMapLocation';
import Text from '../../../components/Text/Text';
interface PlotArea {
  subdistrictId: number;
  subdistrictName: string;
  districtId: number;
  districtName: string;
  provinceId: number;
  provinceName: string;
  lat: null | string;
  long: null | string;
  postcode: string;
}

interface Plot {
  id: string;
  plotName: string;
  raiAmount: string;
  landmark: string;
  plantName: string;
  plantNature: null | string;
  mapUrl: null | string;
  lat: string;
  long: string;
  locationName: string;
  farmerId: string;
  plotAreaId: number;
  isActive: boolean;
  status: string;
  plotArea: PlotArea;
  comment: null | string;
  reason: null | string;
  plantCharacteristics: null | string;
  dateWaitPending: string;
}

interface AreaServiceEntity {
  area: string;
  latitude: number;
  longitude: number;
  provinceId: number;
  districtId: number;
  subdistrictId: number;
  locationName: string;
}
interface Props {
  navigation: any;
  fromRegister?: boolean;
  onSubmitCreatePlot: (payload: SubmitPlotType) => Promise<void>;
  setLoading: (value: boolean) => void;
  initialData?: Plot;
}
export const API_KEY = 'AIzaSyAymsbEe0NVhDL8iHd8oabbr5xG0TFn8Jc';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function PlotForm({
  navigation,
  fromRegister = false,
  setLoading,
  onSubmitCreatePlot,
  initialData,
}: Props) {
  const [position, setPosition] = useState({
    latitude: LAT_LNG_BANGKOK.lat,
    longitude: LAT_LNG_BANGKOK.lng,
    latitudeDelta: 0.004757,
    longitudeDelta: 0.006866,
  });
  const mapRef = useRef<MapView>(null);

  const timeSpent = useTimeSpent();
  const [location, setLocation] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>();
  const [selectPlot, setSelectPlot] = useState<any>();
  const [plantName, setPlantName] = useState<any>();
  const [raiAmount, setRaiAmount] = useState<any>();
  const [plantListSelect, setPlantListSelect] = useState<
    { id: string; cropName: string }[]
  >([]);
  const [page, setPage] = useState<number>(0);
  const [dataStore, setDataStore] = useState<AreaServiceEntity[]>([]);
  const [dataRender, setDataRender] = useState<AreaServiceEntity[]>([]);
  const [search, setSearch] = useState<any>({
    term: '',
    fetchPredictions: false,
  });
  const [landmark, setlandmark] = useState<any>('');
  const [lat, setLat] = useState<any>();
  const [long, setLng] = useState<any>();
  const [plotName, setPlotName] = useState<any>(null);

  const plantSheet = useRef<any>();
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [visiblePlot, setVisiblePlot] = useState(false);
  const [visibleMap, setVisibleMap] = useState(false);
  const [defaultNamePlot, setDefaultNamePlot] = useState(
    'แปลงที่ ' + (profilestate.plotItem.length + 1),
  );

  const searchPlotArea = (value: string) => {
    setSearchValue(value);
  };

  const selectPlants = (value: any) => {
    setPlantName(value);
    plantSheet.current.hide();
  };
  const selectPlotArea = (value: any) => {
    setSelectPlot(value);
    setVisiblePlot(false);
  };

  useEffect(() => {
    let arr = [];
    let skip = dataStore.length;
    for (
      let i = 10 * page;
      i < (10 + 10 * page > skip ? skip : 10 + 10 * page);
      i++
    ) {
      arr.push(dataStore[i]);
    }
    let newarr = dataRender.concat(arr);
    setDataRender(newarr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const filterLocation = () => {
      setPage(0);
      let filter = location.filter(str => str.area.includes(searchValue));
      let arr = [];
      for (let i = 0; i < 10; i++) {
        if (filter[i]) {
          arr.push(filter[i]);
        }
      }
      setDataStore(filter);
      setDataRender(arr);
    };
    if (searchValue && location.length > 0) {
      filterLocation();
    }
  }, [searchValue, location]);
  // console.log('dataRender', dataRender.length, searchValue, location.length);
  useEffect(() => {
    const getDistrict = async () => {
      QueryLocation.getSubdistrict(0, '')
        .then(res => {
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
          setLocation(all);
        })
        .catch(err => console.log(err));
    };
    const getLocation = async () => {
      const hasPermission = await LocationPermission.hasLocationPermission();
      if (hasPermission) {
        Geolocation.getCurrentPosition(
          pos => {
            setPosition({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              latitudeDelta: 0.004757,
              longitudeDelta: 0.006866,
            });
          },
          error => {
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    };
    const getProfile = async () => {
      setLoading(true);
      const farmer_id = await AsyncStorage.getItem('farmer_id');
      if (!farmer_id) {
        setLoading(false);
        return;
      }
      ProfileDatasource.getProfile(farmer_id!)
        .then(res => {
          const imgPath = res.file.filter((item: any) => {
            if (item.category === 'PROFILE_IMAGE') {
              return item;
            }
          });
          if (imgPath.length === 0) {
            dispatch({
              type: 'InitProfile',
              name: `${res.firstname} ${res.lastname}`,
              id: res.farmerCode,
              image: '',
              plotItem: res.farmerPlot,
              status: res.status,
            });
            setDefaultNamePlot('แปลงที่ ' + (res.farmerPlot.length + 1));
            setLoading(false);
          } else {
            ProfileDatasource.getImgePathProfile(farmer_id!, imgPath[0].path)
              .then(resImg => {
                dispatch({
                  type: 'InitProfile',
                  name: `${res.firstname} ${res.lastname}`,
                  id: res.farmerCode,
                  image: resImg.url,
                  plotItem: res.farmerPlot,
                  status: res.status,
                });
                setDefaultNamePlot('แปลงที่ ' + (res.farmerPlot.length + 1));
              })
              .catch(err => console.log(err))
              .finally(() => setLoading(false));
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => setLoading(false));
    };
    const getAllCropName = async () => {
      try {
        const result = await CropDatasource.getAllCrop();
        setPlantListSelect(result);
      } catch (e) {
        console.log(e);
      }
    };

    const initilize = async () => {
      try {
        await Promise.all([
          getDistrict(),
          getLocation(),
          getProfile(),
          getAllCropName(),
        ]);
      } catch (e) {
        console.log(e);
      }
    };
    initilize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialData) {
      setLat(parseFloat(initialData.lat));
      setLng(parseFloat(initialData.long));
      setlandmark(initialData.landmark);
      setPlantName(initialData.plantName);
      setRaiAmount(initialData.raiAmount);
      setPlotName(initialData.plotName);
      setSelectPlot({
        ...initialData.plotArea,
        area: `${initialData.plotArea.subdistrictName}/${initialData.plotArea.districtName}/${initialData.plotArea.provinceName}`,
      });
      setSearch({ term: initialData.locationName, fetchPredictions: true });
      setPosition(prev => ({
        ...prev,
        latitude: parseFloat(initialData.lat),
        longitude: parseFloat(initialData.long),
      }));
    }
  }, [initialData]);

  const getCurrentLocation = async () => {
    const hasPermission = await LocationPermission.hasLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        async pos => {
          const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}&key=${API_KEY}`;
          const result = await axios.get(apiUrl);

          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.004757,
            longitudeDelta: 0.006866,
          });
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setSearch({
            term: result.data.results[0].formatted_address,
            fetchPredictions: true,
          });
          mapRef.current?.animateToRegion({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.009757,
            longitudeDelta: 0.010866,
          });
        },
        error => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };
  const onSubmitLocation = async (location: {
    latitude: number;
    longitude: number;
    locationName: string;
  }) => {
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.009757,
      longitudeDelta: 0.010866,
    });
    setPosition(prev => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
    setSearch({ term: location.locationName, fetchPredictions: true });
  };
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}>
        <View style={{ justifyContent: 'space-around' }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <InputTextLabel
              label="ชื่อแปลงเกษตร"
              required
              onChangeText={value => {
                setPlotName(value);
              }}
              onBlur={() => {
                mixpanel.track('AddPlotScreen_InputPlotName_typed', {
                  plotName: plotName,
                  timeSpent,
                });
              }}
              defaultValue={
                !plotName
                  ? `${defaultNamePlot} ${plantName ? plantName : ''}`
                  : plotName
              }
              style={[styles.input, { borderColor: colors.disable }]}
              editable={true}
              placeholder={defaultNamePlot}
              placeholderTextColor={colors.fontGrey}
            />
            <InputTextLabel
              label="จำนวนไร่"
              required
              onChangeText={value => {
                const cleaned = value.replace(/[^0-9.]/g, '');
                const newNumberWithDot = (
                  cleaned.match(/(\d+)(\.\d{0,1})?|./)?.[0] ?? ''
                ).toString();

                setRaiAmount(newNumberWithDot);
              }}
              onBlur={() => {
                mixpanel.track('AddPlotScreen_InputRaiAmount_typed', {
                  raiAmount: raiAmount,
                  timeSpent,
                });
              }}
              allowFontScaling={false}
              keyboardType={'numeric'}
              value={raiAmount}
              style={[styles.input, { borderColor: colors.disable }]}
              editable={true}
              placeholder={'ระบุจำนวนไร่'}
              placeholderTextColor={colors.disable}
            />

            <Text style={styles.head}>
              พืชที่ปลูก
              <Text style={{ color: colors.errorText, fontSize: 26 }}> *</Text>
            </Text>
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
                  marginBottom: 20,
                  marginTop: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: normalize(55),
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: fonts.AnuphanMedium,
                    fontSize: normalize(20),
                    color: colors.gray,
                  }}>
                  {!plantName ? (
                    <Text
                      style={{
                        fontFamily: font.SarabunLight,
                        color: colors.disable,
                        fontSize: normalize(20),
                      }}>
                      เลือกพืช
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: font.SarabunLight,
                        color: colors.fontGrey,
                        fontSize: normalize(20),
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

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.head}>
                พื้นที่แปลงเกษตร
                <Text style={{ color: colors.errorText, fontSize: 26 }}>
                  {' '}
                  *
                </Text>
              </Text>
              <InfoCircleButton sheetId="placePlot" />
            </View>
            <TouchableOpacity
              onPress={() => {
                setVisiblePlot(true);
              }}>
              <View
                style={{
                  borderColor: colors.disable,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 16,
                  marginTop: 8,
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
                  numberOfLines={1}
                  style={{
                    fontFamily: fonts.AnuphanMedium,
                    fontSize: normalize(20),
                    color: colors.gray,
                    lineHeight: 35,
                    width: '90%',
                  }}>
                  {!selectPlot ? (
                    <Text
                      style={{
                        fontFamily: font.SarabunLight,
                        color: colors.disable,
                        fontSize: normalize(20),
                      }}>
                      ระบุตำบล / อำเภอ / จังหวัด
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: font.SarabunLight,
                        color: colors.fontGrey,
                        fontSize: normalize(20),
                      }}>
                      {selectPlot.area}
                    </Text>
                  )}
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.head}>
                ตำแหน่งแปลง
                <Text style={{ color: colors.errorText, fontSize: 26 }}>
                  {' '}
                  *
                </Text>
              </Text>
              <InfoCircleButton sheetId="positionPlot" />
            </View>
            <TouchableOpacity
              onPress={() => {
                setVisibleMap(true);
              }}>
              <View
                style={{
                  borderColor: colors.disable,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 8,
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: normalize(55),
                }}>
                <Image source={image.map} style={styles.imageStyle} />
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: fonts.AnuphanMedium,
                    fontSize: normalize(20),
                    color: colors.gray,
                    lineHeight: 35,
                    width: '80%',
                  }}>
                  {!search.term ? (
                    <Text
                      style={{
                        fontFamily: font.SarabunLight,
                        color: colors.disable,
                        fontSize: normalize(20),
                      }}>
                      เช่น วัด, โรงเรียน, ร้านค้า
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: font.SarabunLight,
                        color: colors.fontGrey,
                        fontSize: normalize(20),
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
                  ref={mapRef}
                  mapType="satellite"
                  minZoomLevel={14}
                  maxZoomLevel={18}
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  region={{
                    latitude: position.latitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.042,
                    longitude: position.longitude,
                  }}
                  showsUserLocation={true}>
                  <Marker
                    image={image.mark}
                    coordinate={{
                      latitude: position?.latitude,
                      longitude: position?.longitude,
                    }}
                  />
                </MapView.Animated>
                <TouchableOpacity
                  onPress={getCurrentLocation}
                  style={styles.currentMyLocation}>
                  <Image
                    source={icons.myLocationGreen}
                    style={{
                      width: normalize(24),
                      height: normalize(24),
                    }}
                  />

                  <Text
                    style={{
                      fontFamily: font.AnuphanSemiBold,
                      fontSize: normalize(14),
                      color: colors.fontBlack,
                      lineHeight: 24,
                    }}>
                    ระบุตำแหน่งที่ฉันอยู่
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )}

            <View
              style={{
                marginTop: 16,
              }}>
              <InputTextLabel
                optional
                label="จุดสังเกต"
                onChangeText={value => {
                  setlandmark(value);
                }}
                onBlur={() => {
                  mixpanel.track('AddPlotScreen_InputLandmark_typed', {
                    landmark: landmark,
                    timeSpent,
                  });
                }}
                allowFontScaling={false}
                value={landmark}
                style={[styles.input, { borderColor: colors.disable }]}
                editable={true}
                placeholder={'ระบุจุดสังเกต'}
                placeholderTextColor={colors.disable}
              />
            </View>

            <View style={{ height: normalize(10) }} />
          </ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 16,
            }}>
            <MainButton
              style={styles.button}
              label="ยกเลิก"
              color={colors.white}
              borderColor={colors.gray}
              fontColor={colors.fontBlack}
              onPress={() => {
                fromRegister
                  ? navigation.goBack()
                  : navigation.navigate('AllPlotScreen');
              }}
            />
            <MainButton
              style={styles.button}
              label="บันทึก"
              disable={
                !raiAmount ||
                !plantName ||
                !position.latitude ||
                !position.longitude ||
                !search.term ||
                !selectPlot.subdistrictId
              }
              color={colors.greenLight}
              onPress={async () => {
                const payload = {
                  landmark,
                  lat,
                  long,
                  plantName,
                  plotLength: profilestate.plotItem.length,
                  plotName,
                  position,
                  raiAmount,
                  search,
                  selectPlot,
                  timeSpent,
                };
                await onSubmitCreatePlot(payload);
              }}
            />
          </View>
        </View>
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
            <Text style={[styles.head, { marginBottom: normalize(6) }]}>
              พืชที่ปลูก
            </Text>
            <Text
              style={{
                color: colors.greenLight,
                fontFamily: font.SarabunMedium,
                fontSize: normalize(18),
              }}
              onPress={() => {
                plantSheet.current.hide();
              }}>
              ยกเลิก
            </Text>
          </View>
          <View style={styles.container}>
            <ScrollView>
              <View
                style={{
                  marginTop: 8,
                }}>
                {plantListSelect.map((v, i) => (
                  <TouchableOpacity>
                    <PlantSelect
                      key={i}
                      label={v.cropName}
                      id={v.id}
                      onPress={() => {
                        selectPlants(v.cropName);
                        mixpanel.track('AddPlotScreen_SelectPlant_tapped', {
                          plantName: v.cropName,
                        });
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ActionSheet>

      <Modal
        visible={visiblePlot}
        style={{
          paddingTop: '10%',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            paddingBottom: normalize(30),
            width: windowWidth,
            height: windowHeight,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              height: normalize(60),
            }}>
            <TouchableOpacity
              onPress={() => {
                setVisiblePlot(false);
              }}>
              <Image
                source={icons.arrowLeft}
                style={{
                  width: normalize(24),
                  height: normalize(24),
                }}
              />
            </TouchableOpacity>
            <Text style={[styles.head, {}]}>พื้นที่แปลงเกษตร</Text>
            <InfoCircleButton sheetId="placePlot" />
          </View>
          <View>
            <View style={{ overflow: 'hidden', paddingBottom: 5 }}>
              <View
                style={{
                  paddingHorizontal: 16,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 2.27,
                  elevation: 10,
                  backgroundColor: 'white',
                }}>
                <Text
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.gray,
                  }}>
                  กรุณาพิมพ์ชื่อตำบลแปลงเกษตรของคุณ
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    marginBottom: normalize(10),
                    fontSize: normalize(16),
                    color: colors.darkOrange,
                  }}>
                  ไม่ต้องพิมพ์คำนำหน้าชื่อคำว่า ต. หรือ ตำบล
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
                    height: normalize(55),
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    allowFontScaling={false}
                    onChangeText={searchPlotArea}
                    value={searchValue}
                    defaultValue={searchValue}
                    style={[
                      {
                        marginLeft: 5,
                        height: 60,
                        justifyContent: 'center',
                        lineHeight: 25,
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
              </View>
            </View>
            <View style={styles.container}>
              <View
                style={{
                  height: windowHeight * 0.6,
                  paddingHorizontal: dataRender.length < 1 ? 0 : 16,
                  marginTop: dataRender.length < 1 ? 0 : 10,
                }}>
                {dataRender.length < 1 ? (
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.grayBg,
                    }}>
                    <Image
                      source={image.emptyPlacePlot}
                      style={{
                        width: 160,
                        height: 160,
                      }}
                    />
                  </View>
                ) : (
                  <ScrollView
                    onScrollEndDrag={() => {
                      if (dataStore.length > dataRender.length) {
                        setPage(page + 1);
                      }
                    }}>
                    {dataRender.length > 0 &&
                      dataRender.map((v: any, i: any) => (
                        <TouchableOpacity>
                          <PlantSelect
                            key={i}
                            label={v.area}
                            id={v}
                            onPress={() => {
                              mixpanel.track(
                                'AddPlotScreen_SelectPlotArea_tapped',
                                {
                                  plotArea: v.area,
                                  timeSpent,
                                },
                              );
                              selectPlotArea(v);
                            }}
                          />
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <ModalMapLocation
        visible={visibleMap}
        setVisible={setVisibleMap}
        defaultLocation={{
          latitude: position.latitude,
          longitude: position.longitude,
        }}
        onSubmit={onSubmitLocation}
      />
    </>
  );
}
const styles = StyleSheet.create({
  clearBtn: {
    flex: 0.1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 10,
    color: colors.fontBlack,
    fontSize: 18,
    fontFamily: font.SarabunLight,
    borderWidth: 1,
    borderColor: colors.disable,
  },
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
    fontSize: normalize(20),
    color: colors.fontGrey,
    lineHeight: 35,
  },
  first: {
    flex: 1,
    justifyContent: 'space-around',
  },
  button: {
    width: normalize(160),
  },
  inner: {
    paddingHorizontal: 16,
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
    marginTop: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontFamily: font.SarabunLight,
    fontSize: normalize(20),
    marginBottom: 20,
  },
  currentMyLocation: {
    backgroundColor: colors.white,
    minWidth: 175,
    minHeight: 40,
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 10,
    shadowOpacity: 0.34,
    shadowRadius: 1.27,
  },
});
