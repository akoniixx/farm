import {Switch} from '@rneui/themed';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font} from '../../assets';
import {stylesCentral} from '../../styles/StylesCentral';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar} from '@rneui/base';
import icons from '../../assets/icons/icons';
import {SheetManager} from 'react-native-actions-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {normalize, width} from '../../functions/Normalize';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import image from '../../assets/images/image';
import MainTapNavigator from '../../navigations/BottomTabs/MainTapNavigator';
import {socket} from '../../functions/utility';
import {FCMtokenDatasource} from '../../datasource/FCMDatasource';
import {Authentication} from '../../datasource/AuthDatasource';
import LinearGradient from 'react-native-linear-gradient';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {initProfileState, profileReducer} from '../../hook/profilefield';
import DronerCarousel from '../../components/Carousel/DronerSug';
import {TaskSuggestion} from '../../datasource/TaskSuggestion';
import DronerSugg from '../../components/Carousel/DronerSug';
import DronerUsed from '../../components/Carousel/DronerUsed';
import * as RootNavigation from '../../navigations/RootNavigation';

const MainScreen: React.FC<any> = ({navigation}) => {
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
  const date = new Date().toLocaleDateString();
  const [fcmToken, setFcmToken] = useState('');
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [taskSug, setTaskSug] = useState<any[]>([]);
  const [taskSugUsed, setTaskSugUsed] = useState<any[]>([]);
  const {height, width} = Dimensions.get('window');

  const getData = async () => {
    const value = await AsyncStorage.getItem('token');
    setFcmToken(value!);
  };
  useEffect(() => {
    getData();
    getProfile();
    dronerSug();
    dronerSugUsed();
  }, []);

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
  const dronerSug = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value) {
      const farmer_id = await AsyncStorage.getItem('farmer_id');
      TaskSuggestion.searchDroner(
        farmer_id !== null ? farmer_id : '',
        profilestate.plotItem[0].id,
        date,
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
        date,
        limit,
        offset,
      )
        .then(res => {
          console.log(`length = ${res.length}`);
          setTaskSugUsed(res);
        })
        .catch(err => console.log(err));
    }
  };
  return (
    <View style={[stylesCentral.container]}>
      {fcmToken !== null ? (
          <View style={{backgroundColor: colors.white}}>
            <View style={{height: normalize(990)}}>
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
                    top: '35%',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity>
                    <LinearGradient
                      colors={['#61E097', '#3B996E']}
                      style={{
                        marginHorizontal: 15,
                        paddingVertical: normalize(10),
                        width: 170,
                        height: 130,
                        borderRadius: 24,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: colors.greenLight,
                      }}>
                      <Image source={icons.drone} />
                      <Text style={styles.font}>จ้างโดรนเกษตร</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <LinearGradient
                      colors={['#FFFFFF', '#ECFBF2']}
                      style={{
                        marginHorizontal: 15,
                        paddingVertical: normalize(10),
                        width: 170,
                        height: 130,
                        borderRadius: 24,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: colors.greenLight,
                      }}>
                      <Image source={icons.plots} />
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
              <View style={[styles.empty]}>
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
                {taskSugUsed.length != undefined ? (
                  <View style={{height: '110%'}}>
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
                  <View style={{alignItems: 'center', width: '100%',height: '100%'}}> 
                    <Image
                      source={image.empty_droner}
                      style={{
                        width: normalize(126),
                        height: normalize(120),
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
              </View>
              {/* <View style={[styles.empty]}>
              <Text
                style={[styles.text, {alignSelf: 'flex-start', top: '15%'}]}>
                นักบินโดรนที่แนะนำ
              </Text>
              <View style={{top: '20%', height: '110%'}}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {taskSug.length != undefined && taskSug.map((item: any, index: any) => (
                    <TouchableOpacity
                    key={index}
                      onPress={() => {
                        // deTailPlot.current.show();
                      }}>
                      <DronerSugg
                         index={index}
                      key={index}
                        profile={
                          item.image_droner 
                        }
                        background={''}
                        name={item.firstname + ' ' + item.lastname}
                        rate={
                          item.rating_avg 
                        }
                        total_task={item.total_task}
                        province={item.province_name }
                        distance={
                          item.street_distance 
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View> */}
            </View>
          </View>
      ) : (
        <>
          <View style={{backgroundColor: colors.white, height: screenHeight}}>
            <View style={[stylesCentral.container]}>
              <View style={{flex: 1}}>
                <View>
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
                            color: colors.orange,
                          }}>
                          Icon
                          <Text
                            style={{
                              fontFamily: font.AnuphanBold,
                              fontSize: normalize(26),
                              color: colors.greenLight,
                            }}>
                            Kaset
                          </Text>
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <View style={{flexDirection: 'row', top: '25%'}}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('DronerBooking')}>
                          <LinearGradient
                            colors={['#61E097', '#3B996E']}
                            style={{
                              marginHorizontal: 15,
                              paddingVertical: normalize(10),
                              width: 170,
                              height: 130,
                              borderRadius: 24,
                              alignItems: 'center',
                            }}>
                            <Image source={icons.drone} />
                            <Text style={styles.font}>จ้างโดรนเกษตร</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('MyPlotScreen')}>
                          <LinearGradient
                            colors={['#FFFFFF', '#ECFBF2']}
                            style={{
                              marginHorizontal: 15,
                              paddingVertical: normalize(10),
                              width: 170,
                              height: 130,
                              borderRadius: 24,
                              alignItems: 'center',
                            }}>
                            <Image source={icons.plots} />
                            <Text style={styles.font1}>แปลงของคุณ</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    padding: '5%',
                    justifyContent: 'space-between',
                    top: '10%',
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
                      fontSize: normalize(14),
                      color: colors.gray,
                    }}>
                    ดูทั้งหมด
                  </Text>
                </View> */}
                {/* <View
                  style={{
                    width: '100%',
                    height: normalize(60),
                    alignItems: 'center',
                    top: '5%',
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
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  {/* <Text
                    style={[
                      styles.text,
                      {
                        alignSelf: 'flex-start',
                        top: '15%',
                        paddingVertical: '5%',
                      },
                    ]}>
                    นักบินโดรนที่แนะนำ
                  </Text> */}
                  <Image
                    source={image.empty_droner}
                    style={{
                      width: normalize(126),
                      height: normalize(120),
                      top: '16%',
                      marginBottom: normalize(32),
                    }}
                  />
                  <View style={{height: '20%'}}></View>
                  <Text style={[styles.textEmpty]}>
                    เพื่อให้สามารถจ้างงานนักบินโดรนได้
                  </Text>
                  <Text style={[styles.textEmpty]}>
                    กรุณาลงทะเบียน/เข้าสู่ระบบ
                  </Text>
                  <TouchableOpacity
                    style={{margin: '3%'}}
                    onPress={async () => {
                      const value = await AsyncStorage.getItem('PDPA');
                      if (value === 'read') {
                        navigation.navigate('TelNumScreen');
                      } else {
                        navigation.navigate('ConditionScreen');
                      }
                    }}>
                    <Text
                      style={[
                        styles.textEmpty,
                        {
                          color: colors.greenLight,
                          textDecorationLine: 'underline',
                        },
                      ]}>
                      คลิกเลย!
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </>
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
});
