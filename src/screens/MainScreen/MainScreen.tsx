import {Switch} from '@rneui/themed';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
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
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar} from '@rneui/base';
import icons from '../../assets/icons/icons';
import {SheetManager} from 'react-native-actions-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {normalize, width} from '../../functions/Normalize';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import image from '../../assets/images/image';
import MainTapNavigator from '../../navigations/Bottom/MainTapNavigator';
import {socket} from '../../functions/utility';
import {FCMtokenDatasource} from '../../datasource/FCMDatasource';
import {Authentication} from '../../datasource/AuthDatasource';
import LinearGradient from 'react-native-linear-gradient';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {initProfileState, profileReducer} from '../../hook/profilefield';
import DronerCarousel from '../../components/Carousel/DronerCarousel';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const imageWidth = screenWidth / 2;

const MainScreen: React.FC<any> = ({navigation, route}) => {
  const [fcmToken, setFcmToken] = useState('');
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);

  const getData = async () => {
    const value = await AsyncStorage.getItem('token');
    setFcmToken(value!);
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getProfile();
    }, []),
  );

  const getProfile = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    ProfileDatasource.getProfile(farmer_id!)
      .then(res => {
        dispatch({
          type: 'InitProfile',
          name: `${res.firstname}`,
        });
      })
      .catch(err => console.log(err));
  };

  return (
    <ScrollView>
      {fcmToken !== null ? (
        <View style={[stylesCentral.container]}>
          <View style={{flex: 1}}>
            <View>
              <ImageBackground
                source={image.bgHead}
                style={{
                  width: (windowWidth * 380) / 375,
                  height: (windowHeight * 300) / 812,
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
                <View style={{flexDirection: 'row', top: '30%', justifyContent: 'center'}}>
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
                      }}>
                      <Image source={icons.plots} />
                      <Text style={styles.font1}>แปลงของคุณ</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
              <View
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
              </View>
              <View
                style={{
                  width: '100%',
                  height: normalize(60),
                  alignItems: 'center',
                  top: '%',
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
              </View>
              <View style={[styles.empty]}>
                <Text
                  style={[styles.text, {alignSelf: 'flex-start', top: '20%'}]}>
                  นักบินโดรนที่แนะนำ
                </Text>
                <View style={{ top: '10%'}}>
                  <DronerCarousel />
                </View>
              </View>
            </View>
            <View style={{height: 150}}></View>
          </View>
        </View>
      ) : (
        <>
          <ScrollView style={{backgroundColor: colors.white, height: screenHeight}}>
            <View style={[stylesCentral.container]}>
              <View style={{flex: 1}}>
                <View>
                  <ImageBackground
                    source={image.bgHead}
                    style={{
                      width: (windowWidth * 380) / 375,
                      height: (windowHeight * 250) / 812,
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
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                      <View style={{flexDirection: 'row', top: '20%'}}>
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
                <View
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
                </View>
                <View
                  style={{
                    width: '100%',
                    height: normalize(60),
                    alignItems: 'center',
                    top: '6%',
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
                </View>
                <View style={[styles.empty]}>
                  <Text
                    style={[
                      styles.text,
                      {alignSelf: 'flex-start', top: '10%'},
                    ]}>
                    นักบินโดรนที่แนะนำ
                  </Text>
                  <Image
                    source={image.empty_droner}
                    style={{
                      width: normalize(126),
                      height: normalize(120),
                      top: '15%',
                    }}
                  />
                  <Text style={[styles.textEmpty]}>
                    เพื่อให้สามารถจ้างงานนักบินโดรนได้
                  </Text>
                  <Text style={[styles.textEmpty]}>
                    กรุณาลงทะเบียน/เข้าสู่ระบบ
                  </Text>
                  <TouchableOpacity
                    style={{margin: '10%'}}
                    onPress={() => navigation.navigate('ConditionScreen')}>
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
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
};
export default MainScreen;

const styles = StyleSheet.create({
  textEmpty: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    top: '16%',
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
    alignItems: 'center',
    top: '8%',
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
