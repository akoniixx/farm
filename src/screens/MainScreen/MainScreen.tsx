import React, { useEffect, useReducer, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { colors, font } from '../../assets';
import { stylesCentral } from '../../styles/StylesCentral';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from '../../assets/icons/icons';
import { normalize } from '../../functions/Normalize';
import image from '../../assets/images/image';
import LinearGradient from 'react-native-linear-gradient';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { initProfileState, profileReducer } from '../../hook/profilefield';
import { TaskSuggestion } from '../../datasource/TaskSuggestion';
import DronerUsed from '../../components/Carousel/DronerUsed';
import DronerSugg from '../../components/Carousel/DronerCarousel';
import { ActivityIndicator } from 'react-native-paper';
import { TaskDatasource } from '../../datasource/TaskDatasource';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';

const MainScreen: React.FC<any> = ({ navigation }) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const imageWidth = screenWidth / 2;
  const date = new Date();
  const [fcmToken, setFcmToken] = useState('');
  const isFocused = useIsFocused();
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [taskSug, setTaskSug] = useState<any[]>([]);
  const [taskId, setTaskId] = useState<any>(null);
  const [taskSugUsed, setTaskSugUsed] = useState<any[]>([]);
  const { height, width } = Dimensions.get('window');
  const [showFinding, setShowFinding] = useState(false);
  const [dataFinding, setDataFinding] = useState({
    id: '',
    taskNo: '',
    farmAreaAmount: '',
    cropName: '',
    purposeSprayName: '',
  });

  const getData = async () => {
    const value = await AsyncStorage.getItem('token');
    setFcmToken(value!);
  };

  useEffect(() => {
    const getTaskId = async () => {
      const value = await AsyncStorage.getItem('taskId');
      setTaskId(value);
    };
    getTaskId();
    getData();
    getProfile();
  }, [isFocused]);
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
            console.log(`length = ${res.length}`);
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
          .then(res => {
            setTaskSugUsed(res);
          })
          .catch(err => console.log(err));
      }
    };
    dronerSug();
    dronerSugUsed();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profilestate.plotItem]);

  useEffect(() => {
    const getTaskByTaskId = async () => {
      try {
        if (!taskId) {
          return setShowFinding(false);
        }
        const res = await TaskDatasource.getTaskByTaskId(taskId || '');
        if (res && res.data) {
          const endTime = await AsyncStorage.getItem('endTime');
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
  return (
    <View
      style={{
        backgroundColor: colors.white,
        flex: 1,
      }}>
      <ScrollView>
        <View style={[stylesCentral.container]}>
          <View style={{ backgroundColor: colors.white }}>
            <View style={{ height: normalize(990) }}>
              <ImageBackground
                source={image.bgHead}
                style={{
                  width: (width * 380) / 375,
                  height: (height * 250) / 812,
                }}>
                <View style={styles.headCard}>
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
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    top: '25%',
                    alignSelf: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('SelectDateScreen')}>
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
                  <TouchableOpacity>
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
              </ImageBackground>
              {/* <View
              style={{
                flexDirection: 'row',
                padding: '5%',
                justifyContent: 'space-between',
                top: '3%',
              }}>
              <Text
                style={{
                  fontFamily: font.AnuphanBold,
                  fontSize: normalize(20),
                  color: colors.fontGrey,
                }}>
                กูรูเกษตร
              </Text>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: normalize(16),
                  color: colors.fontGrey,
                }}>
                ดูทั้งหมด
              </Text>
            </View> */}
              {/* <View
              style={{
                width: '100%',
                height: normalize(60),
                alignItems: 'center',
                top: '2%',
              }}>
              <Image
                source={image.academy}
                style={{
                  width: 360,
                  height: 120,
                  top: -15,
                  borderRadius: 10,
                }}
              />
            </View> */}
              {/*  <View style={[styles.empty]}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: '5%',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontFamily: font.AnuphanBold,
                      fontSize: normalize(20),
                      color: colors.fontGrey,
                    }}>
                    จ้างนักบินที่เคยจ้าง
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('SeeAllDronerUsed');
                    }}>
                    <Text
                      style={{
                        fontFamily: font.SarabunLight,
                        fontSize: normalize(16),
                        color: colors.fontGrey,
                        height: 25,
                      }}>
                      ดูทั้งหมด
                    </Text>
                  </TouchableOpacity>
                </View>
                {taskSugUsed.length != 0 ? (
                  <View style={{ height: '110%' }}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      {taskSugUsed.length != undefined &&
                        taskSugUsed.map((item: any, index: any) => (
                          <TouchableOpacity
                            key={index}
                            onPress={async () => {
                              await AsyncStorage.setItem(
                                'droner_id',
                                `${item.droner_id}`,
                              );
                              navigation.push('DronerDetail');
                            }}>
                            <DronerUsed
                              key={index}
                              index={index}
                              profile={item.image_droner}
                              background={''}
                              name={item.firstname + ' ' + item.lastname}
                              rate={item.rating_avg}
                              total_task={item.total_task}
                              province={item.province_name}
                              distance={item.street_distance}
                            />
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                  </View>
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      width: '100%',
                      height: '100%',
                    }}>
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
              </View> */}
              {/* <View style={[styles.empty]}>
                <Text
                  style={[
                    styles.text,
                    { alignSelf: 'flex-start', top: '15%' },
                  ]}>
                  นักบินโดรนที่แนะนำ
                </Text>
                <View style={{ top: '20%', height: '110%' }}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {taskSug.length != undefined &&
                      taskSug.map((item: any, index: any) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            // deTailPlot.current.show();
                          }}>
                          <DronerSugg
                            index={index}
                            key={index}
                            profile={item.image_droner}
                            background={''}
                            name={item.firstname + ' ' + item.lastname}
                            rate={item.rating_avg}
                            total_task={item.total_task}
                            province={item.province_name}
                            distance={item.street_distance}
                          />
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              </View> */}
            </View>
          </View>
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
    </View>
  );
};
export default MainScreen;

const styles = StyleSheet.create({
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
    top: '15%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(23),
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
    height: 80,
  },
});
