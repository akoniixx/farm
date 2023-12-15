import React, { useEffect, useReducer, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Modal,
  Linking,
} from 'react-native';
import { colors, font } from '../../assets';
import { stylesCentral } from '../../styles/StylesCentral';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from '../../assets/icons/icons';

import { normalize } from '../../functions/Normalize';
import image from '../../assets/images/image';
import LinearGradient from 'react-native-linear-gradient';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { initProfileState, profileReducer } from '../../hook/profilefield';

import Text from '../../components/Text/Text';
import MaintenanceHeader from '../MainScreen/MainScreenComponent/MaintenanceHeader';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import Geolocation from 'react-native-geolocation-service';
import { GuruKaset } from '../../datasource/GuruDatasource';
import { useNetwork } from '../../contexts/NetworkContext';
import { MainButton } from '../../components/Button/MainButton';
import ModalRequestPermission from '../../components/Modal/ModalRequestPermission';
import CarouselMainScreen from './AuthMainScreenComponent/CarouselMainScreen';
import { mixpanel } from '../../../mixpanel';
import DronerNearMe from './AuthMainScreenComponent/DronerNearMe';
import { DronerDatasource } from '../../datasource/DronerDatasource';
import { useHighlight } from '../../contexts/HighlightContext';

const AuthMainScreen: React.FC<any> = ({ navigation }) => {
  const { notiMaintenance, maintenanceData } = useMaintenance();
  const { onShow, highlightModal, isHighlightClosed } = useHighlight();
  const { popUpIsClose } = useMaintenance();
  const [loading, setLoading] = useState<boolean>(false);
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [dronerNearMe, setDronerNearMe] = useState<{
    count: number;
    data: any[];
  }>({
    count: 0,
    data: [],
  });
  const [showModalPermission, setShowModalPermission] =
    useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean | null>(null);
  const { height, width } = Dimensions.get('window');
  const [guruKaset, setGuruKaset] = useState<{
    data: any[];
    count: number;
  }>({
    data: [],
    count: 0,
  });
  const [allowLocal, setAllowLocal] = useState<boolean>(false);
  const { appState } = useNetwork();
  const [permission, setPermission] = useState<
    | 'denied'
    | 'granted'
    | 'disabled'
    | 'restricted'
    | 'never_ask_again'
    | undefined
  >();
  const [position, setPosition] = useState<{
    latitude: number | null;
    longitude: number | null;
    latitudeDelta: number;
    longitudeDelta: number;
  }>({
    latitude: null,
    longitude: null,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  const getProfile = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value) {
      const farmer_id = await AsyncStorage.getItem('farmer_id');
      ProfileDatasource.getProfile(farmer_id!)
        .then(async res => {
          await AsyncStorage.setItem('plot_id', `${res.farmerPlot[0].id}`);
          dispatch({
            type: 'InitProfile',
            name: `${res.firstname}`,
            plotItem: res.farmerPlot,
          });
        })
        .catch(err => console.log(err));
    }
  };
  const findAllNews = async () => {
    setLoading(true);
    GuruKaset.findAllNewsPin('ACTIVE', 'FARMER', 5, 0, 'MAIN')
      .then(res => {
        setGuruKaset(res);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const result = await Geolocation.requestAuthorization('always');
      return result;
    } else if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return result;
    }
  };
  const getDronerNearMe = async () => {
    if (position.latitude && position.longitude) {
      DronerDatasource.getDronerNearMe({
        lat: position.latitude,
        long: position.longitude,
      })
        .then(res => {
          setDronerNearMe(res);
        })
        .catch(err => console.log(err));
    }
  };
  const onPressSetting = async () => {
    await Linking.openSettings();
  };

  useEffect(() => {
    getProfile();
    findAllNews();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (highlightModal.isActive) {
      onShow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightModal.isActive]);

  useEffect(() => {
    if (appState === 'active' && isConfirm && isHighlightClosed) {
      requestLocationPermission().then(async result => {
        setPermission(result);
      });
    }
  }, [appState, isConfirm, isHighlightClosed]);

  useEffect(() => {
    if (isConfirm === null && popUpIsClose && isHighlightClosed) {
      setTimeout(() => {
        setShowModalPermission(true);
      }, 1500);
    }
  }, [popUpIsClose, isConfirm, isHighlightClosed]);
  useEffect(() => {
    const getCurrentLocation = async () => {
      if (permission === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            setPosition({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          },
          error => {
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        setAllowLocal(true);
        setPermission(undefined);
      }
    };
    if (permission) {
      getCurrentLocation();
    }
  }, [permission]);
  useEffect(() => {
    if (position.latitude && position.longitude) {
      getDronerNearMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position.latitude, position.longitude]);
  return (
    <View
      style={{
        backgroundColor: colors.white,
        flex: 1,
      }}>
      <ScrollView>
        <View style={[stylesCentral.container]}>
          <View style={{ backgroundColor: colors.white }}>
            <View style={[stylesCentral.container]}>
              <View style={{ flex: 1 }}>
                <View style={{ height: 'auto' }}>
                  <Image
                    source={image.bgHead}
                    style={{
                      width: (width * 380) / 375,
                      height: (height * 280) / 812,
                      position: 'absolute',
                    }}
                  />
                  <SafeAreaView edges={['top']} style={styles.headCard}>
                    <View>
                      <View>
                        <Text
                          style={{
                            fontFamily: font.AnuphanMedium,
                            fontSize: normalize(18),
                            color: colors.fontBlack,
                          }}>
                          ยินดีต้อนรับ
                        </Text>
                        <Text
                          style={{
                            fontFamily: font.AnuphanBold,
                            fontSize: normalize(26),
                            color: colors.orange,
                          }}>
                          ไอคอน
                          <Text
                            style={{
                              fontFamily: font.AnuphanBold,
                              fontSize: normalize(26),
                              color: colors.greenLight,
                            }}>
                            เกษตร
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </SafeAreaView>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingTop: 40,
                      paddingBottom: 10,
                      alignSelf: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('DronerBooking')}>
                      <LinearGradient
                        colors={['#61E097', '#3B996E']}
                        style={{
                          paddingVertical: normalize(10),
                          width: normalize(166),
                          height: normalize(137),
                          borderRadius: 24,
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: colors.greenLight,
                        }}>
                        <Image
                          source={icons.drone}
                          style={{
                            height: normalize(76),
                            width: normalize(105),
                          }}
                        />
                        <Text style={[styles.font, { top: 6 }]}>
                          จ้างโดรนเกษตร
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <View style={{ width: normalize(10) }} />
                    <TouchableOpacity
                      onPress={() => navigation.navigate('MyPlotScreen')}>
                      <LinearGradient
                        colors={['#FFFFFF', '#ECFBF2']}
                        style={{
                          paddingVertical: normalize(10),
                          width: normalize(166),
                          height: normalize(137),
                          borderRadius: 24,
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: colors.greenLight,
                        }}>
                        <Image
                          source={image.plotsNotLogin}
                          style={{
                            height: normalize(76),
                            width: normalize(105),
                          }}
                        />
                        <Text style={[styles.font1, { top: 6 }]}>
                          แปลงของคุณ
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <MaintenanceHeader
                      checkDateNoti={notiMaintenance}
                      end={maintenanceData.dateEnd}
                      start={maintenanceData.dateStart}
                      maintenance={maintenanceData}
                    />
                  </View>

                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 0,
                        paddingTop: 4,
                      }}>
                      <Text
                        style={{
                          fontFamily: font.AnuphanBold,
                          fontSize: normalize(20),
                          color: colors.fontGrey,
                          paddingHorizontal: 20,
                        }}>
                        ข่าวสาร
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          mixpanel.track('MainScreen_ButtonAllGuru_Press', {
                            navigateTo: 'AllNewsScreen',
                          });
                          navigation.navigate('AllNewsScreen');
                        }}>
                        <Text
                          style={{
                            fontFamily: font.SarabunRegular,
                            fontSize: normalize(16),
                            color: colors.fontGrey,
                            height: 30,
                            lineHeight: 32,
                            paddingHorizontal: 10,
                          }}>
                          ดูทั้งหมด
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <CarouselMainScreen
                      data={guruKaset}
                      isLoading={loading}
                      navigation={navigation}
                    />
                  </View>

                  <View style={{ paddingHorizontal: 16 }}>
                    <Text
                      style={{
                        fontFamily: font.AnuphanSemiBold,
                        fontSize: 20,
                      }}>
                      นักบินโดรนใกล้คุณ
                    </Text>
                    {dronerNearMe.data.length > 0 && (
                      <DronerNearMe
                        data={dronerNearMe.data}
                        isLoading={false}
                        navigation={navigation}
                      />
                    )}
                  </View>
                  {permission !== 'granted' && (
                    <View
                      style={{
                        alignItems: 'center',
                        marginTop: 32,
                      }}>
                      <Image
                        source={image.empty_droner}
                        style={{
                          width: normalize(126),
                          height: normalize(120),
                          marginBottom: normalize(32),
                        }}
                      />
                      <Text style={[styles.textEmpty]}>
                        เพื่อให้สามารถจ้างนักบินโดรนใกล้คุณได้
                      </Text>
                      <Text style={[styles.textEmpty]}>
                        กรุณาเปิดการเข้าถึงตำแหน่งในโทรศัพท์
                      </Text>
                      <TouchableOpacity
                        style={{ margin: '3%' }}
                        onPress={onPressSetting}>
                        <Text
                          style={[
                            styles.textEmpty,
                            {
                              color: colors.greenLight,
                              textDecorationLine: 'underline',
                              lineHeight: 28,
                            },
                          ]}>
                          กดเพื่อตั้งค่า
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <ModalRequestPermission
        visible={allowLocal}
        onRequestClose={() => {
          setAllowLocal(false);
        }}
      />
      <Modal visible={showModalPermission} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
          }}>
          <View
            style={{
              backgroundColor: colors.white,
              width: '100%',
              paddingHorizontal: 16,
              paddingTop: 24,
              paddingBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 8,
            }}>
            <Image
              source={image.locationModal}
              style={{
                width: 80,
                height: 80,
              }}
            />
            <View
              style={{
                marginTop: 16,
                width: '100%',
                alignItems: 'center',
              }}>
              <Text style={styles.textTitle}>ยินยอมให้แอปพลิเคชัน</Text>
              <Text style={styles.textTitle}>“เรียกโดรน - ไอคอนเกษตร”</Text>
              <Text style={styles.textTitle}>เข้าถึงตำแหน่งของคุณ</Text>
            </View>
            <View
              style={{
                marginTop: 8,
              }}>
              <MainButton
                color={colors.greenLight}
                style={{
                  width: Dimensions.get('window').width - 64,
                  height: 54,
                }}
                onPress={async () => {
                  setIsConfirm(true);
                  setShowModalPermission(false);
                }}
                label="ยินยอม"
              />
              <MainButton
                color={'transparent'}
                style={{
                  width: Dimensions.get('window').width - 64,
                  height: 54,
                  borderWidth: 1,
                }}
                fontColor={colors.fontBlack}
                onPress={async () => {
                  setIsConfirm(false);
                  setShowModalPermission(false);
                }}
                label="ไม่ยินยอม"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default AuthMainScreen;

const styles = StyleSheet.create({
  textTitle: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(22),
    color: colors.fontBlack,
  },
  textEmpty: {
    fontFamily: font.SarabunRegular,
    fontSize: normalize(18),
    color: colors.gray,
  },
  text: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    left: '5%',
    bottom: '5%',
    color: colors.fontGrey,
  },
  empty: {
    width: '100%',
    height: normalize(260),
    top: '5%',
  },
  headCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: normalize(5),
  },
  activeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayBg,
    padding: normalize(5),
    borderRadius: normalize(12),
    marginTop: normalize(10),
  },
  activeFont: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(14),
    marginLeft: normalize(18),
    color: colors.fontBlack,
  },
  font: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
    color: colors.white,
  },
  font1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
    color: colors.primary,
  },
});
