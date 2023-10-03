import {
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-native-paper';
import { normalize } from '../../../functions/Normalize';
import { colors, font, icons, image } from '../../../assets';
import InfoCircleButton from '../../InfoCircleButton';
import fonts from '../../../assets/fonts';
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import { MainButton } from '../../Button/MainButton';
import { LocationPermission } from '../../../functions/permissionRequest';
import axios from 'axios';
import { API_KEY } from '../../../screens/ProfileScreen/PlotScreen/PlotForm';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import SearchBarWithAutocomplete from '../../SearchBarWithAutocomplete';
import { useDebounceValue } from '../../../hook/useDebounceValue';
import { mixpanel } from '../../../../mixpanel';
import Text from '../../Text/Text';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  defaultLocation?: {
    latitude: number;
    longitude: number;
  };
  onSubmit: (v: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
    locationName: string;
  }) => void;
}
interface PositionType {
  latitude: number | null;
  longitude: number | null;
  latitudeDelta: number;
  longitudeDelta: number;
}
const initialPosition: PositionType = {
  latitudeDelta: 0.0922,
  longitudeDelta: 0.042,
  latitude: null,
  longitude: null,
};
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const GOOGLE_PACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

type PredictionType = {
  description: string;
  place_id: string;
  reference: string;
  matched_substrings: any[];
  tructured_formatting: Object[];
  terms: Object[];
  types: string[];
};
export default function ModalMapLocation({
  visible,
  setVisible,
  onSubmit,
  defaultLocation,
}: Props) {
  const mapRef = React.useRef<MapView>(null);
  const [heightView, setHeightView] = useState(0);

  const refPress = React.useRef(false);
  const [currentPosition, setCurrentPosition] =
    useState<PositionType>(initialPosition);
  const mapSheet = React.useRef<ActionSheetRef>(null);
  const [search, setSearch] = useState('');
  const [predictions, setPredictions] = useState<PredictionType[]>([]);
  const searchDebounce = useDebounceValue(search, 500);

  useEffect(() => {
    if (defaultLocation?.latitude || defaultLocation?.longitude) {
      setCurrentPosition(prev => ({
        ...prev,
        latitude: defaultLocation.latitude,
        longitude: defaultLocation.longitude,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [currentLocationName, setCurrentLocationName] = useState('');
  const getCurrentLocation = async () => {
    const hasPermission = await LocationPermission.hasLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        async pos => {
          const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}&key=${API_KEY}`;
          const result = await axios.get(apiUrl);
          setCurrentPosition({
            ...initialPosition,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });

          setCurrentLocationName(result.data.results[0].formatted_address);
          mapRef.current?.animateToRegion({
            ...initialPosition,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        error => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
  };
  const onPressMap = async (e: MapPressEvent) => {
    if (refPress.current) {
      return;
    }
    try {
      refPress.current = true;
      setCurrentPosition({
        ...initialPosition,
        latitude: e.nativeEvent?.coordinate?.latitude,
        longitude: e.nativeEvent?.coordinate?.longitude,
      });

      const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.nativeEvent.coordinate.latitude},${e.nativeEvent.coordinate.longitude}&key=${API_KEY}`;
      const result = await axios.get(apiUrl);
      setCurrentLocationName(result.data.results[0].formatted_address);
    } catch (err) {
      console.log(err);
    } finally {
      refPress.current = false;
    }
  };
  const onChangeSearch = async (text: string) => {
    try {
      const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${API_KEY}&input=${text}`;
      const result = await axios.post(apiUrl);
      if (result) {
        const {
          data: { predictions },
        } = result;
        setPredictions(predictions);
      }
    } catch (err) {
      console.log(err);
    }
  };
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
        setCurrentLocationName(description);
        setCurrentPosition(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        mixpanel.track('AddPlotScreen_MapView_tapped', {
          latitude: lat,
          longitude: lng,
        });
        mapRef.current?.animateToRegion({
          ...initialPosition,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        });
        mapSheet?.current?.hide();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (searchDebounce) {
      onChangeSearch(searchDebounce);
    }
  }, [searchDebounce]);
  return (
    <>
      <Modal
        visible={visible}
        style={{
          paddingTop: '10%',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            paddingVertical: normalize(16),
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
                setVisible(false);
              }}>
              <Image
                source={icons.arrowLeft}
                style={{
                  width: normalize(24),
                  height: normalize(24),
                }}
              />
            </TouchableOpacity>
            <Text style={[styles.head]}>ตำแหน่งแปลง</Text>
            <InfoCircleButton sheetId="positionPlot" />
          </View>
          <>
            <View
              onLayout={event => {
                const { height } = event.nativeEvent.layout;
                setHeightView(height);
              }}
              style={[
                {
                  paddingHorizontal: 16,
                  marginBottom: 16,
                  height: 'auto',
                },
              ]}>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: 16,
                  lineHeight: 28,
                }}>
                ขั้นตอนในการหาตำแหน่งแปลง มีดังนี้
              </Text>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: 16,
                  lineHeight: 28,
                }}>
                1. ให้พิมพ์ค้นหาสถานที่ใกล้แปลง (เช่น วัด, โรงเรียน) มีดังนี้
              </Text>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: 16,
                  lineHeight: 28,
                }}>
                2. เลื่อนหมุดแผนที่เพื่อไปหาตำแหน่งแปลง
              </Text>
            </View>
            {currentPosition.latitude && currentPosition.longitude ? (
              <View
                style={{
                  height: Dimensions.get('screen').height - heightView - 280,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    mapSheet?.current?.show();
                  }}
                  style={{
                    position: 'absolute',
                    top: 1,
                    zIndex: 1,
                    width: '100%',
                    paddingHorizontal: 16,
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
                      backgroundColor: colors.white,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 0,
                      },
                      shadowOpacity: 0.34,
                      shadowRadius: 2.27,
                      elevation: 10,
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
                      {!currentLocationName ? (
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
                          {currentLocationName}
                        </Text>
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
                <MapView.Animated
                  ref={mapRef}
                  mapType="satellite"
                  minZoomLevel={14}
                  maxZoomLevel={18}
                  style={styles.mapFullScreen}
                  provider={PROVIDER_GOOGLE}
                  onPress={onPressMap}
                  region={{
                    ...currentPosition,
                    latitude: currentPosition.latitude || 13.736717,
                    longitude: currentPosition.longitude || 100.523186,
                  }}
                  showsUserLocation={true}>
                  <Marker
                    image={image.mark}
                    coordinate={{
                      latitude: currentPosition?.latitude,
                      longitude: currentPosition?.longitude,
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
          </>
          <View
            style={{
              padding: 16,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.34,
              shadowRadius: 2.27,
              elevation: 10,
            }}>
            <MainButton
              color={colors.greenLight}
              label="บันทึก"
              disable={
                !currentLocationName ||
                !currentPosition.latitude ||
                !currentPosition.longitude
              }
              onPress={async () => {
                if (
                  currentLocationName &&
                  currentPosition.latitude &&
                  currentPosition.longitude
                ) {
                  await onSubmit({
                    latitude: currentPosition.latitude,
                    longitude: currentPosition.longitude,
                    latitudeDelta: 0.009757,
                    longitudeDelta: 0.010866,
                    locationName: currentLocationName,
                  });
                  setVisible(false);
                }
              }}
            />
          </View>
        </View>
      </Modal>
      <ActionSheet ref={mapSheet}>
        <View
          style={{
            backgroundColor: 'white',
            width: '100%',
            height: '100%',
            borderRadius: normalize(20),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
            }}>
            <Text style={[styles.head]}>ตำแหน่งแปลง</Text>
            <TouchableOpacity
              onPress={() => {
                mapSheet?.current?.hide();
              }}>
              <Text
                style={{
                  color: colors.fontBlack,
                  fontFamily: font.SarabunMedium,
                  fontSize: normalize(16),
                }}>
                ยกเลิก
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <SearchBarWithAutocomplete
              value={search}
              onChangeText={(text: any) => {
                setSearch(text);
              }}
              predictions={predictions}
              onPredictionTapped={onPredictionTapped}
              //   onPredictionTapped={onPredictionTapped}
            />
          </View>
        </View>
      </ActionSheet>
    </>
  );
}
const styles = StyleSheet.create({
  mapFullScreen: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  currentMyLocation: {
    backgroundColor: colors.white,
    width: 175,
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
  head: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontGrey,
    lineHeight: 35,
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
});
