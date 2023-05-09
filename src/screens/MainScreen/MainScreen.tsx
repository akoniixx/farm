import React, { useEffect, useReducer, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  TouchableOpacity,
  Platform,
  Linking,
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
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { FCMtokenDatasource } from '../../datasource/FCMDatasource';
import { useAuth } from '../../contexts/AuthContext';
import fonts from '../../assets/fonts';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { mixpanel } from '../../../mixpanel';
import { callcenterNumber } from '../../definitions/callCenterNumber';
import { SafeAreaView } from 'react-native-safe-area-context';
import DronerSugg from '../../components/Carousel/DronerCarousel';
import DronerUsedList from '../../components/Carousel/DronerUsedList';
import { FavoriteDroner } from '../../datasource/FavoriteDroner';
import { SystemMaintenance } from '../../datasource/SystemMaintenanceDatasource';
import { momentExtend } from '../../utils/moment-buddha-year';
import PopUpMaintenance from '../../components/Modal/MaintenanceApp/PopUpMaintenance';
import {
  MaintenanceSystem,
  MaintenanceSystem_INIT,
} from '../../entites/MaintenanceApp';
import { GuruKaset } from '../../datasource/GuruDatasource';
import { CardGuruKaset } from '../../components/Carousel/GuruKaset';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const MainScreen: React.FC<any> = ({ navigation, route }) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const imageWidth = screenWidth / 2;
  const date = new Date();
  const [fcmToken, setFcmToken] = useState('');
  const {
    authContext: { getProfileAuth },
    state: { user },
  } = useAuth();
  const [loading, setLoading] = useState(false);
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
  const screen = Dimensions.get('window');
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
  }>({
    count: 0,
    data: [],
  });
  const [reload, setReload] = useState(false);
  const [statusFav, setStatusFav] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceSystem>(
    MaintenanceSystem_INIT,
  );
  const [index, setIndex] = React.useState(0);
  const isCarousel = React.useRef(null);
  const [popupMaintenance, setPopupMaintenance] = useState<boolean>(true);
  const [end, setEnd] = useState<any>();
  const [start, setStart] = useState<any>();
  const [notiEnd, setNotiEnd] = useState<any>();
  const [notiStart, setNotiStart] = useState<any>();
  const getData = async () => {
    const value = await AsyncStorage.getItem('token');
    const farmerId = await AsyncStorage.getItem('farmer_id');
    if (farmerId) {
      setShowBell(true);
    }
    setFcmToken(value!);
  };
  const getNotificationData = async () => {
    FCMtokenDatasource.getNotificationList()
      .then(res =>
        setNotiData({
          count: res.count,
          data: res.data,
        }),
      )
      .catch(err => console.log(err));
  };
  // useEffect(() => {
  //   const getMaintenance = async () => {
  //     setLoading(true);
  //     const value = await AsyncStorage.getItem('Maintenance');
  //     await SystemMaintenance.Maintenance('FARMER')
  //       .then(res => {
  //         if (res.responseData != null) {
  //           if (value === 'read') {
  //             setMaintenance(res.responseData);
  //           } else {
  //             setMaintenance(res.responseData);
  //             setPopupMaintenance(res.responseData.id ? true : false);
  //           }
  //         }
  //         if (maintenance != null) {
  //           setStart(
  //             momentExtend.toBuddhistYear(
  //               maintenance.dateStart,
  //               'DD MMMM YYYY',
  //             ),
  //           );
  //           setEnd(
  //             momentExtend.toBuddhistYear(
  //               maintenance.dateStart,
  //               'DD MMMM YYYY',
  //             ),
  //           );
  //           setNotiStart(
  //             momentExtend.toBuddhistYear(
  //               maintenance.dateNotiStart,
  //               'DD MMMM YYYY',
  //             ),
  //           );
  //           setNotiEnd(
  //             momentExtend.toBuddhistYear(
  //               maintenance.dateNotiEnd,
  //               'DD MMMM YYYY',
  //             ),
  //           );
  //         }
  //       })
  //       .catch(err => console.log(err))
  //       .finally(() => setLoading(false));
  //   };
  //   getMaintenance();
  // }, [reload]);

  const d = momentExtend.toBuddhistYear(date, 'DD MMMM YYYY');
  const checkDateNoti = d >= notiStart && d <= notiEnd;
  useEffect(() => {
    const getTaskId = async () => {
      const value = await AsyncStorage.getItem('taskId');
      setTaskId(value);
    };
    getTaskId();
    getData();
    getProfile();
    getNotificationData();
    getFavDroner();
  }, [isFocused]);
  const getProfile = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value) {
      const farmer_id = await AsyncStorage.getItem('farmer_id');
      getProfileAuth();
      ProfileDatasource.getProfile(farmer_id!)
        .then(async res => {
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
  useEffect(() => {
    const dronerSug = async () => {
      setLoading(true);
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
          .catch(err => console.log(err))
          .finally(() => setLoading(false));
      }
    };
    const dronerSugUsed = async () => {
      setLoading(true);
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
          .then(res => {
            setTaskSugUsed(res);
          })
          .catch(err => console.log(err))
          .finally(() => setLoading(false));
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
    setLoading(true);
    const farmer_id: any = await AsyncStorage.getItem('farmer_id');
    const plot_id: any = await AsyncStorage.getItem('plot_id');
    FavoriteDroner.findAllFav(farmer_id, plot_id)
      .then(res => {
        if (res != null) {
          setStatusFav(res);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    findAllNews();
  }, [isFocused]);
  const findAllNews = async () => {
    setLoading(true);
    GuruKaset.findAllNews('ACTIVE', 'FARMER', 'created_at', 'DESC', 5, 0)
      .then(res => {
        setGuruKaset(res);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <View
      style={{
        backgroundColor: colors.white,
        flex: 1,
      }}>
      <ScrollView>
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
                    alignItems: 'center'
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('NotificationScreen', {
                        data: notiData?.data,
                      })
                    }>
                    {showBell ? (
                      <Image
                        source={
                          notiData.count != 0
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
                    onPress={() => navigation.navigate('DetailPointScreen')}>
                      <LinearGradient
                        colors={['#41D981', '#26A65C']}
                        start={{ x: 0.85, y: 0.25 }}
                        style={{
                          left:10,
                          padding: 2,
                          flexDirection: 'row',
                          borderRadius: 24,
                          alignItems: 'center',
                          borderColor: colors.greenLight,
                        }}>
                        <Image
                          source={icons.ickPoint}
                          style={{ width: 35, height: 35 }}
                        />
                        <Text
                          style={{
                            alignSelf: 'center',
                            textAlign: 'center',
                            fontFamily: font.AnuphanBold,
                            color: colors.white,
                            fontSize: normalize(16),
                          }}>{`124,500 `}</Text>
                      </LinearGradient>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>

              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 130,
                  paddingBottom: profilestate.status === 'REJECTED' ? 32 : 0,
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    if (disableBooking) {
                      setShowModalCantBooking(true);
                    } else {
                      mixpanel.track('Tab booking with login');
                      navigation.navigate('SelectDateScreen', {
                        isSelectDroner: false,
                        profile: {},
                      });
                    }
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
                <View style={{ width: normalize(10) }}></View>
                <TouchableOpacity
                  onPress={() => {
                    mixpanel.track('Tab your plot with login');
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
                <View>
                  {checkDateNoti === true && (
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                      <View
                        style={{
                          paddingHorizontal: 20,
                          height: 'auto',
                          width: normalize(340),
                          alignSelf: 'center',
                          backgroundColor: '#ECFBF2',
                          borderRadius: 10,
                        }}>
                        <View
                          style={{
                            paddingVertical: 20,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                          }}>
                          <View style={{ marginTop: 15 }}>
                            <Image
                              source={image.maintenance}
                              style={{ width: 58, height: 60 }}
                            />
                          </View>
                          <View style={{ paddingHorizontal: 30 }}>
                            {start != end ? (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: font.AnuphanMedium,
                                    fontSize: normalize(18),
                                    color: colors.fontBlack,
                                    fontWeight: '800',
                                  }}>
                                  {`วันที่ `}
                                  <Text
                                    style={{
                                      color: '#FB8705',
                                    }}>
                                    {momentExtend.toBuddhistYear(
                                      maintenance.dateStart,
                                      'DD MMMM YYYY',
                                    )}
                                  </Text>
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: font.AnuphanMedium,
                                    fontSize: normalize(18),
                                    color: colors.fontBlack,
                                    fontWeight: '800',
                                  }}>
                                  ช่วงเวลา{' '}
                                  {moment(maintenance.dateStart)
                                    .add(543, 'year')
                                    .locale('th')
                                    .format('HH.mm')}
                                  {' - 23:59 น.'}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: font.AnuphanMedium,
                                    fontSize: normalize(18),
                                    color: colors.fontBlack,
                                    fontWeight: '800',
                                  }}>
                                  {`ถึงวันที่ `}
                                  <Text
                                    style={{
                                      color: '#FB8705',
                                    }}>
                                    {momentExtend.toBuddhistYear(
                                      maintenance.dateEnd,
                                      'DD MMMM YYYY',
                                    )}
                                  </Text>
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: font.AnuphanMedium,
                                    fontSize: normalize(18),
                                    color: colors.fontBlack,
                                    fontWeight: '800',
                                  }}>
                                  ช่วงเวลา
                                  {` 00:00 - `}
                                  {moment(maintenance.dateEnd)
                                    .add(543, 'year')
                                    .locale('th')
                                    .format('HH.mm น.')}
                                </Text>
                              </View>
                            ) : (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: font.AnuphanMedium,
                                    fontSize: normalize(18),
                                    color: colors.fontBlack,
                                    fontWeight: '800',
                                  }}>
                                  {`วันที่ `}
                                  <Text
                                    style={{
                                      color: '#FB8705',
                                    }}>
                                    {maintenance != null &&
                                      momentExtend.toBuddhistYear(
                                        maintenance.dateStart,
                                        'DD MMMM YYYY',
                                      )}
                                  </Text>
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: font.AnuphanMedium,
                                    fontSize: normalize(18),
                                    color: colors.fontBlack,
                                    fontWeight: '800',
                                  }}>
                                  ช่วงเวลา{' '}
                                  {moment(maintenance.dateStart)
                                    .add(543, 'year')
                                    .locale('th')
                                    .format('HH.mm')}
                                  {' - '}
                                  {moment(maintenance.dateEnd)
                                    .add(543, 'year')
                                    .locale('th')
                                    .format('HH.mm')}
                                  {' น.'}
                                </Text>
                              </View>
                            )}
                            <Text
                              style={{
                                marginRight: 20,
                                fontFamily: font.SarabunLight,
                                fontSize: normalize(16),
                                color: colors.fontBlack,
                              }}>
                              {maintenance.text}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
                {profilestate.status === 'REJECTED' && (
                  <View>
                    <View
                      style={{
                        paddingHorizontal: 20,
                        height: 176,
                        width: normalize(340),
                        alignSelf: 'center',
                        backgroundColor: '#FFF9F2',
                        borderWidth: 1,
                        borderColor: '#FEDBB4',
                        borderRadius: 10,
                      }}>
                      <View style={{ padding: 15, alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Image
                            source={icons.warning}
                            style={{ width: 20, height: 20, marginRight: 10 }}
                          />
                          <Text style={[styles.textAlert]}>
                            การยืนยันตัวตนไม่สำเร็จ อาจะส่งผลต่อ
                          </Text>
                        </View>
                        <Text style={[styles.textAlert, { marginLeft: 30 }]}>
                          การจ้างงานโดรนเกษตร กรุณาติดต่อ
                        </Text>
                        <Text style={[styles.textAlert, { marginLeft: 30 }]}>
                          เจ้าหน้าที่ เพื่อยืนยันสถานะ
                        </Text>
                      </View>
                      <View style={{ paddingHorizontal: 10 }}>
                        <TouchableOpacity
                          onPress={() => {
                            setShowModalCall(true);
                          }}
                          style={{
                            ...Platform.select({
                              ios: {
                                height: 60,
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                backgroundColor: colors.white,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                width: '100%',
                                borderRadius: 12,
                                marginBottom: 8,
                                borderWidth: 1,
                                borderColor: colors.blueBorder,
                              },
                              android: {
                                height: 60,
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                backgroundColor: colors.white,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                width: '100%',
                                borderRadius: 12,
                                marginBottom: 8,
                                borderWidth: 1,
                                borderColor: colors.blueBorder,
                                bottom: 15,
                              },
                            }),
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              alignSelf: 'center',
                            }}>
                            <Image
                              style={{
                                width: 24,
                                height: 24,
                                marginRight: 16,
                              }}
                              source={icons.calling}
                            />
                            <Text
                              style={{
                                fontFamily: font.AnuphanMedium,
                                color: colors.blueBorder,
                                fontSize: 20,
                              }}>
                              โทรหาเจ้าหน้าที่
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}

                {/* <View
                  style={{

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
                    จ้างนักบินที่เคยจ้าง
                  </Text>
                  <View style={{ paddingHorizontal: 20,}}>
                    <MainButton label={'จ้างนักบินที่เคยจ้าง'} color={'#2EC46D'} onPress={()=>setShowModalCall(true)}/>
                  </View>
                  </View> */}
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
                  {guruKaset != undefined ? (
                    <View>
                      <Carousel
                        autoplay={true}
                        autoplayInterval={7000}
                        autoplayDelay={5000}
                        loop={true}
                        ref={isCarousel}
                        data={guruKaset.data}
                        sliderWidth={screen.width}
                        itemWidth={screen.width}
                        onSnapToItem={index => setIndex(index)}
                        useScrollView={true}
                        vertical={false}
                        renderItem={({ item }: any) => {
                          return (
                            <TouchableOpacity
                              onPress={async () => {
                                await AsyncStorage.setItem(
                                  'guruId',
                                  `${item.id}`,
                                );
                                navigation.push('DetailGuruScreen');
                              }}>
                              <CardGuruKaset background={item.image_path} />
                            </TouchableOpacity>
                          );
                        }}
                      />
                      <View
                        style={{
                          alignItems: 'center',
                          top: -15,
                          marginVertical: -10,
                        }}>
                        <Pagination
                          dotsLength={guruKaset.data.length}
                          activeDotIndex={index}
                          carouselRef={isCarousel}
                          dotStyle={{
                            width: 8,
                            height: 8,
                            borderRadius: 5,
                            backgroundColor: colors.fontGrey,
                          }}
                          inactiveDotOpacity={0.4}
                          inactiveDotScale={0.9}
                          tappableDots={true}
                        />
                      </View>
                    </View>
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
                      navigation.navigate('DronerUsedScreen');
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
                {taskSugUsed.length != 0 ? (
                  <View style={{ height: 'auto' }}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      {taskSugUsed.length != undefined &&
                        taskSugUsed.map((item: any, index: number) => (
                          <TouchableOpacity
                            key={index}
                            onPress={async () => {
                              await AsyncStorage.setItem(
                                'droner_id',
                                `${item.droner_id}`,
                              );
                              navigation.push('DronerDetail');
                            }}>
                            <DronerUsedList
                              key={index}
                              index={index}
                              profile={item.image_droner}
                              background={''}
                              name={item.firstname + ' ' + item.lastname}
                              rate={item.rating_avg}
                              total_task={item.count_rating}
                              province={item.province_name}
                              distance={item.street_distance}
                              status={item.favorite_status}
                              callBack={async () => {
                                setLoading(true);
                                const farmer_id = await AsyncStorage.getItem(
                                  'farmer_id',
                                );
                                const droner_id = taskSugUsed.map(
                                  x => x.droner_id,
                                );
                                await FavoriteDroner.addUnaddFav(
                                  farmer_id !== null ? farmer_id : '',
                                  droner_id[index],
                                )
                                  .then(res => {
                                    setRefresh(!refresh);
                                    let newTaskSugUsed = taskSugUsed.map(
                                      (x, i) => {
                                        let result = {};
                                        if (x.droner_id === item.droner_id) {
                                          let a =
                                            x.favorite_status === 'ACTIVE'
                                              ? 'INACTIVE'
                                              : 'ACTIVE';
                                          result = { ...x, favorite_status: a };
                                        } else {
                                          result = { ...x };
                                        }
                                        return result;
                                      },
                                    );
                                    setTaskSugUsed(newTaskSugUsed);
                                  })
                                  .catch(err => console.log(err))
                                  .finally(() => setLoading(false));
                              }}
                            />
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Image
                      source={image.empty_droner}
                      style={{
                        width: normalize(136),
                        height: normalize(130),
                        top: '16%',
                        marginBottom: normalize(32),
                      }}
                    />
                    <Text
                      style={{
                        top: '10%',
                        fontFamily: font.SarabunBold,
                        fontSize: normalize(16),
                        fontWeight: '300',
                        color: colors.gray,
                      }}>
                      ไม่มีนักบินโดรนที่เคยจ้าง
                    </Text>
                  </View>
                )}
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
                    นักบินโดรนที่แนะนำ
                  </Text>
                </View>
                <View style={{ height: 'auto' }}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {taskSug.length != undefined &&
                      taskSug.map((item: any, index: any) => (
                        <TouchableOpacity
                          key={index}
                          onPress={async () => {
                            await AsyncStorage.setItem(
                              'droner_id',
                              `${item.droner_id}`,
                            );
                            navigation.push('DronerDetail');
                          }}>
                          <DronerSugg
                            key={index}
                            index={index}
                            profile={item.image_droner}
                            background={''}
                            name={item.firstname + ' ' + item.lastname}
                            rate={item.rating_avg}
                            total_task={item.count_rating}
                            province={item.province_name}
                            distance={item.street_distance}
                            status={item.favorite_status}
                            callBack={async () => {
                              setLoading(true);
                              const farmer_id = await AsyncStorage.getItem(
                                'farmer_id',
                              );
                              const droner_id = taskSug.map(x => x.droner_id);
                              await FavoriteDroner.addUnaddFav(
                                farmer_id !== null ? farmer_id : '',
                                droner_id[index],
                              )
                                .then(res => {
                                  setRefresh(!refresh);
                                  let newTaskSug = taskSug.map((x, i) => {
                                    let result = {};
                                    if (x.droner_id === item.droner_id) {
                                      let a =
                                        x.favorite_status === 'ACTIVE'
                                          ? 'INACTIVE'
                                          : 'ACTIVE';
                                      result = { ...x, favorite_status: a };
                                    } else {
                                      result = { ...x };
                                    }
                                    return result;
                                  });
                                  setTaskSug(newTaskSug);
                                })
                                .catch(err => console.log(err))
                                .finally(() => setLoading(false));
                            }}
                          />
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
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
          {checkDateNoti === true && (
            <PopUpMaintenance
              show={popupMaintenance}
              onClose={async () => {
                await AsyncStorage.setItem('Maintenance', 'read');
                setPopupMaintenance(!popupMaintenance);
              }}
              data={maintenance}
            />
          )}
          <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
          />
        </View>
      </ScrollView>
      {showFinding && (
        <TouchableOpacity
          style={styles.footer}
          onPress={() => {
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
              }}>
              <Text
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModalCantBooking}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingBottom: 32,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              marginTop: 10,
              width: '100%',
              paddingVertical: normalize(16),
              borderRadius: 12,
              paddingHorizontal: 16,
            }}>
            <Text
              style={{
                fontFamily: font.AnuphanMedium,
                fontSize: 22,
                textAlign: 'center',
              }}>
              ท่านไม่สามารถจ้าง
            </Text>
            <Text
              style={{
                fontFamily: font.AnuphanMedium,
                fontSize: 22,
                textAlign: 'center',
              }}>
              โดรนเกษตรได้ในขณะนี้ เนื่องจาก
            </Text>
            <Text
              style={{
                fontFamily: font.AnuphanMedium,
                fontSize: 22,
                textAlign: 'center',
              }}>
              ท่านยังยืนยันตัวตนไม่สำเร็จ
            </Text>
            <Text
              style={{
                fontFamily: font.SarabunLight,
                textAlign: 'center',
                fontSize: 20,
                marginVertical: 16,
              }}>
              กรุณาติดต่อเจ้าหน้าที่ เพื่อยืนยันสถานะ
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowModalCantBooking(false);
              }}
              style={{
                height: 60,
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: colors.greenLight,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                borderRadius: 8,
                marginBottom: 8,
              }}>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  color: colors.white,
                  fontSize: 20,
                }}>
                ตกลง
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default MainScreen;

const styles = StyleSheet.create({
  textAlert: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
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
