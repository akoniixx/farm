import React, { useEffect, useReducer, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Modal,
  TouchableOpacity,
  Platform,
  Linking,
  RefreshControl,
} from 'react-native';

import { colors, font } from '../../assets';
import { stylesCentral } from '../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from '../../assets/icons/icons';
import { normalize } from '../../functions/Normalize';
import image from '../../assets/images/image';
import LinearGradient from 'react-native-linear-gradient';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { initProfileState, profileReducer } from '../../hook/profilefield';
import { TaskSuggestion } from '../../datasource/TaskSuggestion';
import { ActivityIndicator } from 'react-native-paper';
import { TaskDatasource } from '../../datasource/TaskDatasource';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { FCMtokenDatasource } from '../../datasource/FCMDatasource';
import { useAuth } from '../../contexts/AuthContext';
import { mixpanel, mixpanel_token } from '../../../mixpanel';
import { callcenterNumber } from '../../definitions/callCenterNumber';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FavoriteDroner } from '../../datasource/FavoriteDroner';

import { GuruKaset } from '../../datasource/GuruDatasource';
import { historyPoint } from '../../datasource/HistoryPointDatasource';
import { formatNumberWithComma } from '../../utils/ formatNumberWithComma';
import VerifyStatus from '../../components/Modal/VerifyStatus';
import Text from '../../components/Text/Text';
import MaintenanceHeader from './MainScreenComponent/MaintenanceHeader';
import ProfileRenderByStatus from './MainScreenComponent/ProfileRenderByStatus';
import CarouselMainScreen from './MainScreenComponent/CarouselMainScreen';
import BookedDroner from './MainScreenComponent/BookedDroner';
import DronerSuggestion from './MainScreenComponent/DronerSuggestion';
import { useMaintenance } from '../../contexts/MaintenanceContext';
import ModalSelectHiring from '../../components/Modal/ModalSelectHiring';

const MainScreen: React.FC<any> = ({ navigation, route }) => {
  const date = new Date();
  const [fcmToken, setFcmToken] = useState('');
  const {
    authContext: { getProfileAuth },
    state: { user },
  } = useAuth();
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [taskSug, setTaskSug] = useState<any[]>([]);
  const [taskId, setTaskId] = useState<any>(null);
  const [taskSugUsed, setTaskSugUsed] = useState<any[]>([]);
  const [disableBooking, setDisableBooking] = useState(false);
  const [showModalCantBooking, setShowModalCantBooking] = useState(false);
  const { height, width } = Dimensions.get('window');
  const [showFinding, setShowFinding] = useState(false);
  const [showModalCall, setShowModalCall] = useState(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [guruKaset, setGuruKaset] = useState<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [visibleSelectHire, setVisibleSelectHire] = useState(false);
  const [dataFinding, setDataFinding] = useState({
    id: '',
    taskNo: '',
    farmAreaAmount: '',
    cropName: '',
    purposeSprayName: '',
  });
  const [showBell, setShowBell] = useState(false);
  const [notiData, setNotiData] = useState<{
    count: Number;
    data: any;
    isUnread: boolean;
  }>({
    count: 0,
    data: [],
    isUnread: false,
  });
  const [reload, setReload] = useState(false);
  const [statusFav, setStatusFav] = useState<any[]>([]);

  const [reason, setReason] = useState<any>('');
  const [point, setPoint] = useState<any>();
  const { notiMaintenance, maintenanceData } = useMaintenance();

  const getData = async () => {
    const value = await AsyncStorage.getItem('token');
    const farmerId = await AsyncStorage.getItem('farmer_id');
    if (farmerId) {
      setShowBell(true);
    }
    setFcmToken(value!);
  };

  const getNotificationData = async () => {
    FCMtokenDatasource.getNotificationList({
      page: 1,
      take: 5,
    })
      .then(res => {
        setNotiData({
          count: res.count,
          data: res.data,
          isUnread: res.countUnRead > 0,
        });
      })
      .catch(err => console.log(err));
  };

  const getProfile = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value) {
      const farmer_id = await AsyncStorage.getItem('farmer_id');
      getProfileAuth();
      ProfileDatasource.getProfile(farmer_id!)
        .then(async res => {
          setReason(res.reason);
          await sendProfilesToMixpanel(res);
          await AsyncStorage.setItem('plot_id', `${res.farmerPlot[0].id}`);
          dispatch({
            type: 'InitProfile',
            name: `${res.firstname}`,
            plotItem: res.farmerPlot,
            status: res.status,
          });
          setReload(!reload);
        })
        .catch(err => console.log(err));
    }
  };
  const onPressAutoBooking = async () => {
    if (disableBooking) {
      setVisibleSelectHire(false);
      setTimeout(() => {
        setShowModalCantBooking(true);
      }, 200);
    } else {
      mixpanel.track('MainScreen_ButtonBookingTask_Press', {
        navigateTo: 'SelectDateScreen',
        type: 'auto-booking',
      });
      setVisibleSelectHire(false);
      setTimeout(() => {
        navigation.navigate('SelectDateScreen', {
          isSelectDroner: false,
          profile: {},
        });
      }, 200);
    }
  };

  const getInitialData = async () => {
    const getTaskId = async () => {
      const value = await AsyncStorage.getItem('taskId');
      setTaskId(value);
    };
    try {
      setLoading(true);
      await Promise.all([
        getTaskId(),
        getData(),
        getProfile(),
        getNotificationData(),
        getFavDroner(),
        findAllNews(),
      ]);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getInitialData();
    setRefreshing(false);
  };

  useEffect(() => {
    const dronerSug = async () => {
      const value = await AsyncStorage.getItem('token');
      if (value) {
        const farmer_id = await AsyncStorage.getItem('farmer_id');
        TaskSuggestion.searchDroner(
          farmer_id !== null ? farmer_id : '',
          profilestate.plotItem[0].id,
          date.toDateString(),
        )
          .then(res => {
            setTaskSug(res);
          })
          .catch(err => console.log(err));
      }
    };
    const dronerSugUsed = async () => {
      const value = await AsyncStorage.getItem('token');
      if (value) {
        const farmer_id = await AsyncStorage.getItem('farmer_id');
        const limit = 8;
        const offset = 0;
        TaskSuggestion.DronerUsed(
          farmer_id !== null ? farmer_id : '',
          profilestate.plotItem[0].id,
          date.toDateString(),
          limit,
          offset,
        )
          .then(async res => {
            setTaskSugUsed(res);
            await AsyncStorage.setItem('taskSugUsed', JSON.stringify(res));
          })
          .catch(err => console.log(err));
      }
    };
    dronerSug();
    dronerSugUsed();
    if (user) {
      setDisableBooking(user.status === 'ACTIVE' ? false : true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profilestate.plotItem, isFocused, refresh]);
  useEffect(() => {
    const getTaskByTaskId = async () => {
      try {
        if (!taskId) {
          return setShowFinding(false);
        }
        const res = await TaskDatasource.getTaskByTaskId(taskId || '');
        if (res && res.data) {
          const limitTime = moment(res.data.updatedAt).add(90, 'minutes');
          if (moment().isAfter(limitTime)) {
            await AsyncStorage.removeItem('taskId');
            return setShowFinding(false);
          }
          const endTime = moment(res.data.updatedAt)
            .add(30, 'minutes')
            .toISOString();
          const isAfter = moment(endTime).isAfter(moment());

          setDataFinding({
            id: res.data.id,
            taskNo: res.data.taskNo,
            farmAreaAmount: res.data.farmAreaAmount,
            cropName: res.data.purposeSpray.crop.cropName,
            purposeSprayName: res.data.purposeSpray.purposeSprayName,
          });
          setShowFinding(true);
          if (!isAfter) {
            navigation.navigate('SlipWaitingScreen', {
              taskId: res.data.id,
            });
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    getTaskByTaskId();
  }, [taskId, navigation]);
  const getFavDroner = async () => {
    const farmer_id: any = await AsyncStorage.getItem('farmer_id');
    const plot_id: any = await AsyncStorage.getItem('plot_id');
    FavoriteDroner.findAllFav(farmer_id, plot_id)
      .then(res => {
        if (res != null) {
          setStatusFav(res);
        }
      })
      .catch(err => console.log(err));
  };

  const findAllNews = async () => {
    GuruKaset.findAllNewsPin('ACTIVE', 'FARMER', 5, 0, 'MAIN')
      .then(res => {
        setGuruKaset(res);
      })
      .catch(err => console.log(err));
  };

  useFocusEffect(() => {
    const getPointFarmer = async () => {
      const farmer_id: any = await AsyncStorage.getItem('farmer_id');
      await historyPoint
        .getPoint(farmer_id)
        .then(res => {
          setPoint(res.balance);
        })
        .catch(err => console.log(err));
    };
    getPointFarmer();
  });

  const sendProfilesToMixpanel = async (profiles: any) => {
    const options = {
      method: 'POST',
      headers: { accept: 'text/plain', 'content-type': 'application/json' },
      body: JSON.stringify({
        $token: mixpanel_token,
        $distinct_id: await mixpanel.getDistinctId(),
        $set: profiles,
        $name: `${profiles.firstname} ${profiles.lastname}`,
        $telephoneNo: profiles.telephoneNo,
        $farmerId: profiles.id,
        $email: profiles.email ? profiles.email : 'NONE',
      }),
    };

    fetch('https://api.mixpanel.com/engage#profile-set', options)
      .then(response => response.json())

      .catch(err => console.error(err));
  };
  const onPressManualBooking = async () => {
    setVisibleSelectHire(false);
    navigation.navigate('DronerHiredScreen');
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={{
        backgroundColor: colors.white,
        flex: 1,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }>
        <View
          style={[stylesCentral.container, { paddingBottom: normalize(30) }]}>
          <View style={{ backgroundColor: colors.white }}>
            <View style={{ height: 'auto' }}>
              <Image
                source={image.bgHead}
                style={{
                  width: (width * 380) / 375,
                  height: (height * 350) / 812,
                  position: 'absolute',
                }}
              />
              <SafeAreaView edges={['top']} style={styles.headCard}>
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
                      color: colors.fontBlack,
                    }}>
                    {profilestate.name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      mixpanel.track('MainScreen_ButtonNotification_Press', {
                        navigateTo: 'NotificationScreen',
                      });
                      navigation.navigate('NotificationScreen', {
                        data: [],
                      });
                    }}>
                    {showBell ? (
                      <Image
                        source={
                          notiData.isUnread
                            ? icons.newnotification
                            : icons.notification
                        }
                        style={{
                          width: normalize(28),
                          height: normalize(28),
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                    }}
                    onPress={() => {
                      mixpanel.track('MainScreen_ButtonPoint_Press', {
                        navigateTo: 'DetailPointScreen',
                      });
                      navigation.navigate('DetailPointScreen');
                    }}>
                    <LinearGradient
                      colors={['#41D981', '#26A65C']}
                      start={{ x: 0.85, y: 0.25 }}
                      style={{
                        paddingVertical: 2,
                        paddingHorizontal: 6,
                        flexDirection: 'row',
                        borderRadius: 24,
                        alignItems: 'center',
                        borderColor: colors.greenLight,
                      }}>
                      <Image
                        source={icons.ICKPoint}
                        style={{ width: 35, height: 35 }}
                      />
                      <Text
                        style={{
                          alignSelf: 'center',
                          textAlign: 'center',
                          fontFamily: font.AnuphanBold,
                          color: colors.white,
                          fontSize: normalize(16),
                          paddingHorizontal: 8,
                        }}>
                        {formatNumberWithComma(point)}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>

              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 130,
                  paddingHorizontal: 16,
                  paddingBottom:
                    profilestate.status === 'REJECTED' ||
                    profilestate.status === 'INACTIVE' ||
                    profilestate.status === 'PENDING'
                      ? 32
                      : 0,
                  alignItems: 'center',

                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    mixpanel.track('MainScreen_ButtonHireDroner_Press', {
                      navigateTo: 'HireDronerScreen',
                    });
                    setVisibleSelectHire(true);
                  }}>
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
                      style={{ height: normalize(76), width: normalize(105) }}
                    />
                    <Text style={styles.font}>จ้างโดรนเกษตร</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    mixpanel.track('MainScreen_ButtonMyPlot_Press', {
                      navigateTo: 'AllPlotScreen',
                    });
                    navigation.navigate('AllPlotScreen');
                  }}>
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
                      source={icons.plots}
                      style={{ height: normalize(76), width: normalize(105) }}
                    />
                    <Text style={styles.font1}>แปลงของคุณ</Text>
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
                <ProfileRenderByStatus
                  reason={reason}
                  setShowModalCall={setShowModalCall}
                  status={profilestate.status}
                />

                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 16,
                      paddingVertical: 10,
                    }}>
                    <Text
                      style={{
                        fontFamily: font.AnuphanBold,
                        fontSize: normalize(20),
                        color: colors.fontGrey,
                        paddingHorizontal: 20,
                      }}>
                      กูรูเกษตร
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        mixpanel.track('MainScreen_ButtonAllGuru_Press', {
                          navigateTo: 'AllGuruScreen',
                        });
                        navigation.navigate('AllGuruScreen');
                      }}>
                      <Text
                        style={{
                          fontFamily: font.SarabunLight,
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
                  {guruKaset !== undefined ? (
                    <CarouselMainScreen
                      navigation={navigation}
                      data={guruKaset}
                      isLoading={loading}
                    />
                  ) : null}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: font.AnuphanBold,
                      fontSize: normalize(20),
                      color: colors.fontGrey,
                      paddingHorizontal: 20,
                    }}>
                    จ้างนักบินที่เคยจ้าง
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('DronerHiredScreen');
                    }}>
                    <Text
                      style={{
                        fontFamily: font.SarabunLight,
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
                <BookedDroner
                  taskSugUsed={taskSugUsed}
                  setTaskSugUsed={setTaskSugUsed}
                  navigation={navigation}
                  isLoading={loading}
                  setRefresh={setRefresh}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 16,
                    paddingVertical: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: font.AnuphanBold,
                      fontSize: normalize(20),
                      color: colors.fontGrey,
                      paddingHorizontal: 20,
                    }}>
                    นักบินโดรนที่ใกล้คุณ
                  </Text>
                </View>
                <DronerSuggestion
                  taskSug={taskSug}
                  setTaskSug={setTaskSug}
                  navigation={navigation}
                  isLoading={loading}
                  setRefresh={setRefresh}
                />
              </View>
            </View>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={showModalCall}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingBottom: 32,
              }}>
              <TouchableOpacity
                onPress={() => {
                  mixpanel.track('MainScreen_ButtonCallCenter_Press', {
                    callcenterNumber: callcenterNumber,
                  });
                  Linking.openURL(`tel:${callcenterNumber}`);
                }}
                style={{
                  height: 60,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: colors.white,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  width: '100%',
                  borderRadius: 12,
                  marginBottom: 8,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 16,
                    }}
                    source={icons.callBlue}
                  />
                  <Text
                    style={{
                      fontFamily: font.AnuphanMedium,
                      color: '#007AFF',
                      fontSize: 20,
                    }}>
                    {`โทร +66 2-233-9000`}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowModalCall(false);
                }}
                style={{
                  height: 60,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor: colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  borderRadius: 12,
                  marginBottom: 8,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: font.AnuphanMedium,
                      color: '#007AFF',
                      fontSize: 20,
                    }}>
                    ยกเลิก
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ScrollView>
      {showFinding && (
        <TouchableOpacity
          style={styles.footer}
          onPress={() => {
            mixpanel.track('MainScreen_ButtonSlipWaiting_Press', {
              taskId: dataFinding.id,
              navigateTo: 'SlipWaitingScreen',
            });
            navigation.navigate('SlipWaitingScreen', {
              taskId: dataFinding.id,
            });
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <ActivityIndicator animating color={'#BAC7D5'} />
            <View
              style={{
                marginLeft: 16,
                alignSelf: 'flex-start',
                width: Dimensions.get('window').width - 100,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: colors.primary,
                  fontSize: normalize(20),
                  fontFamily: font.SarabunMedium,
                }}>
                {`${dataFinding.cropName} (${dataFinding.purposeSprayName}) |  ${dataFinding.farmAreaAmount} ไร่`}
              </Text>
              <Text
                style={{
                  color: colors.orangeLight,
                  fontSize: normalize(18),
                }}>
                ระบบกำลังรอนักบินโดรนรับงาน
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
            <Image
              source={icons.arrowUp}
              style={{
                width: 28,
                height: 28,
              }}
            />
          </View>
        </TouchableOpacity>
      )}
      <Modal transparent={true} visible={showModalCantBooking}>
        <VerifyStatus
          text={profilestate.status}
          show={showModalCantBooking}
          onClose={() => {
            mixpanel.track('MainScreen_ModalButton_Press', {
              event: 'close',
              description: 'alert cant booking',
            });
            setShowModalCantBooking(false);
          }}
          onMainClick={() => {
            mixpanel.track('MainScreen_ModalButton_Press', {
              event: 'close',
              description: 'alert cant booking',
            });
            setShowModalCantBooking(false);
          }}
        />
      </Modal>
      <ModalSelectHiring
        visible={visibleSelectHire}
        taskSugUsed={taskSugUsed}
        setVisible={setVisibleSelectHire}
        onPressAutoBooking={onPressAutoBooking}
        onPressManualBooking={onPressManualBooking}
      />
    </SafeAreaView>
  );
};
export default MainScreen;

const styles = StyleSheet.create({
  textAlert: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
    lineHeight: 26,
  },
  textEmpty: {
    fontFamily: font.SarabunLight,
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
    top: '7%',
  },
  headCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(23),
    top: '5%',
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
    color: colors.greenDark,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    padding: normalize(10),
    justifyContent: 'space-between',
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: colors.primary,
    borderTopRightRadius: normalize(30),
    borderTopLeftRadius: normalize(30),
    height: Platform.OS === 'ios' ? normalize(80) : normalize(90),
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});
