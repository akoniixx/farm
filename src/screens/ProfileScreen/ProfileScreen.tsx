import React, {useReducer, useRef, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font, icons, image} from '../../assets';
import {height, normalize} from '../../functions/Normalize';
import {stylesCentral} from '../../styles/StylesCentral';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CustomHeader from '../../components/CustomHeader';
import {Avatar} from '@rneui/themed';
import * as RootNavigation from '../../navigations/RootNavigation';
import {ScrollView} from 'react-native';
import PlotsItem from '../../components/Plots/Plots';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Authentication} from '../../datasource/AuthDatasource';
import {FCMtokenDatasource} from '../../datasource/FCMDatasource';
import {socket} from '../../functions/utility';
import {initProfileState, profileReducer} from '../../hook/profilefield';
import {useAuth} from '../../contexts/AuthContext';
import {useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {MainButton} from '../../components/Button/MainButton';
import ConditionScreen from '../RegisterScreen/ConditionScreen';

const ProfileScreen: React.FC<any> = ({navigation}) => {
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const {
    authContext: {getProfileAuth},
  } = useAuth();
  const windowWidth = Dimensions.get('screen').width;
  const windowHeight = Dimensions.get('screen').height;
  const [items, setItems] = useState<any>([]);
  const [brand, setBrand] = useState<any>(null);
  const [brandtype, setBrandType] = useState<any>(null);
  const [itemstype, setItemstype] = useState<any>([]);
  const [image1, setImage1] = useState<any>(null);
  const [image2, setImage2] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [opentype, setOpentype] = useState(false);
  const [value, setValue] = useState(null);
  const [valuetype, setValuetype] = useState(null);
  const [droneno, setdroneno] = useState<any>(null);
  const [popupPage, setpopupPage] = useState(1);
  const actionSheet = useRef<any>(null);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [notidata, setnotidata] = useState(0);

  const getData = async () => {
    const value = await AsyncStorage.getItem('token')
    setFcmToken(value!);
  };
  const onLogout = async () =>{
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    socket.removeAllListeners(`send-task-${farmer_id!}`);
    socket.close();
    await Authentication.logout()
  }
  useEffect(() => {
    getData();
  }, [reload]);

  
  return (
    <SafeAreaView
      style={[stylesCentral.container, {backgroundColor: '#EBEEF0'}]}>
      {fcmToken !== null ? (
        <>
          <CustomHeader title="บัญชีของฉัน" />
          <ScrollView>
            <View style={styles.section1}>
              <Avatar
                size={normalize(80)}
                source={icons.avatar}
                avatarStyle={{
                  borderRadius: normalize(40),
                  borderColor: colors.greenLight,
                  borderWidth: 1,
                }}
              />
              <View
                style={{
                  flexDirection: 'column',
                  marginLeft: normalize(15),
                  top: normalize(5),
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.text]}>อาพรรัตน์ ดวงเกษตร</Text>
                  <TouchableOpacity>
                    <Image
                      source={icons.edit}
                      style={{
                        width: normalize(20),
                        height: normalize(20),
                        tintColor: colors.fontBlack,
                        marginLeft: '45%',
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.appProve,
                    {flexDirection: 'row', top: normalize(10)},
                  ]}>
                  <Image
                    source={icons.correct}
                    style={{margin: normalize(3)}}
                  />
                  <Text
                    style={{
                      fontSize: normalize(16),
                      fontFamily: font.AnuphanBold,
                      color: colors.greenLight,
                    }}>
                    ยืนยันตัวสำเร็จ
                  </Text>
                </View>
              </View>
            </View>
            <View style={{margin: 3}}></View>
            <View style={styles.section2}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.head]}>แปลงของคุณ (1)</Text>
                <TouchableOpacity>
                  <Text style={[styles.h1]}>ดูแปลงทั้งหมด</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: normalize(110),
                  borderWidth: 0.5,
                  borderColor: colors.greenLight,
                  backgroundColor: '#ECFBF2',
                  borderRadius: normalize(10),
                  paddingVertical: normalize(10),
                  paddingHorizontal: normalize(20),
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: normalize(10),
                  marginTop: normalize(10),
                }}>
                <View
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={{fontFamily: font.SarabunLight, fontSize: 18}}>
                      แปลง 1 ข้าวโพด
                    </Text>
                    <View
                      style={{flexDirection: 'row', marginTop: normalize(10)}}>
                      <Image
                        source={icons.plot}
                        style={{
                          width: normalize(18),
                          height: normalize(20),
                          marginRight: normalize(10),
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: font.SarabunLight,
                          fontSize: normalize(16),
                          color: colors.fontGrey,
                          marginRight: '40%',
                        }}>
                        {20 + ' ' + 'ไร่'}
                      </Text>
                      <Image
                        source={icons.plant}
                        style={{
                          width: normalize(18),
                          height: normalize(20),
                          marginRight: normalize(10),
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: font.SarabunLight,
                          fontSize: normalize(16),
                          color: colors.fontGrey,
                          marginRight: '10%',
                        }}>
                        {'ข้าวโพด'}
                      </Text>
                    </View>
                    <View
                      style={{flexDirection: 'row', marginTop: normalize(10)}}>
                      <Image
                        source={icons.location}
                        style={{
                          width: normalize(18),
                          height: normalize(20),
                          marginRight: normalize(10),
                        }}
                      />
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: font.SarabunLight,
                          fontSize: normalize(16),
                          color: colors.fontGrey,
                          marginRight: '10%',
                        }}>
                        88/32 สราญสิริ ...
                        {/* {location.length < 15
                  ? `${location}`
                  : `${location.substring(0, 15)}...`}
                */}
                      </Text>
                      <View
                        style={{
                          width: normalize(109),
                          height: normalize(24),
                          borderRadius: normalize(12),
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: colors.white,
                          borderColor: colors.greenLight,
                          borderWidth: 1,
                        }}>
                        <Text
                          style={[
                            styles.head,
                            {color: colors.greenLight, fontSize: 14},
                          ]}>
                          ตรวจสอบแล้ว
                          {/* {StatusObject(status).status} */}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={{margin: 3}}></View>
            <View style={[styles.section3]}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  paddingBottom: normalize(20),
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={image.iconAppDrone}
                  style={[styles.icon, {marginRight: -100}]}
                />
                <Text style={[styles.h2]}>มาเป็นนักบินโดรนร่วมกับเรา</Text>
                <Image
                  source={icons.arrowRigth}
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menu}>
                <Image
                  source={icons.lock}
                  style={[styles.icon, {marginRight: -125}]}
                />
                <Text style={styles.h2}>นโยบายความเป็นส่วนตัว</Text>
                <Image
                  source={icons.arrowRigth}
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menu}>
                <Image
                  source={icons.deleteUser}
                  style={[styles.icon, {marginRight: -245}]}
                />
                <Text style={styles.h2}>ลบบัญชี</Text>
                <Image
                  source={icons.arrowRigth}
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menu}
                onPress={async () => {
                  await onLogout();
                  RootNavigation.navigate('Auth', {
                    screen: 'HomeScreen',
                  });
                }}>
                <Image
                  source={icons.logout}
                  style={[styles.icon, {marginRight: -200}]}
                />
                <Text style={styles.h2}>ออกจากระบบ</Text>
                <Image
                  source={icons.arrowRigth}
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          <CustomHeader
            title="บัญชีของฉัน"
            showBackBtn
            onPressBack={() => navigation.goBack()}
          />

          <LinearGradient colors={['#ECFBF2', '#FFFFFF']}>
            <View style={{height: normalize(296)}}>
              <View style={[styles.profileBlank]}>
                <Image
                  source={icons.profile_blank}
                  style={{width: normalize(80), height: normalize(80)}}
                />
              </View>
              <View style={[styles.textBlank]}>
                <Text
                  style={{
                    fontSize: normalize(22),
                    fontFamily: font.AnuphanMedium,
                  }}>
                  ยินดีต้อนรับสู่ IconKaset
                </Text>
                <Text
                  style={{
                    fontSize: normalize(16),
                    fontFamily: font.SarabunLight,
                    top: 15,
                  }}>
                  เข้าร่วมเป็นสมาชิกเพื่อรับสิทธิประโยชน์มากมาย
                </Text>
                <MainButton
                  label="ลงทะเบียน/เข้าสู่ระบบ"
                  color={colors.greenLight}
                  style={styles.buttomBlank}
                  onPress={() => navigation.navigate('ConditionScreen')}
                />
              </View>
            </View>
          </LinearGradient>
          <View style={{marginTop: 10}}></View>
          <View
            style={{
              backgroundColor: colors.white,
              width: '100%',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={{
                padding: normalize(20),
                flexDirection: 'row',
                height: normalize(62),
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderColor: colors.disable,
              }}>
              <Image
                source={image.iconAppDrone}
                style={[styles.icon, {marginRight: '-15%'}]}
              />
              <Text style={[styles.h2]}>มาเป็นนักบินโดรนร่วมกับเรา</Text>
              <Image
                source={icons.arrowRigth}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: normalize(20),
                flexDirection: 'row',
                height: normalize(62),
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderColor: colors.disable,
              }}>
              <Image
                source={icons.lock}
                style={[styles.icon, {marginRight: '-20%'}]}
              />
              <Text style={styles.h2}>นโยบายความเป็นส่วนตัว</Text>
              <Image
                source={icons.arrowRigth}
                style={{width: 24, height: 24}}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  buttomBlank: {
    height: normalize(54),
    width: normalize(343),
    alignSelf: 'center',
    marginTop: normalize(30),
    shadowColor: '#0CDF65',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12.35,
    elevation: 19,
  },
  textBlank: {
    alignItems: 'center',
    top: normalize(60),
    display: 'flex',
  },
  profileBlank: {
    alignItems: 'center',
    top: normalize(30),
    bottom: normalize(82),
  },
  head: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
  },
  h1: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
  },
  h2: {
    fontFamily: font.SarabunMedium,
    fontSize: 18,
  },
  headerTitleWraper: {
    backgroundColor: '#F7FFF0',
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    width: normalize(375),
    height: normalize(50),
  },
  headerTitle: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
    textAlign: 'center',
    height: normalize(75),
    top: normalize(20),
    position: 'absolute',
    width: 260,
    left: 80,
    display: 'flex',
  },
  text: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
  },
  section1: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    // backgroundColor: '#F7FFF0',
    display: 'flex',
    alignItems: 'flex-start',
    width: normalize(380),
    height: normalize(120),
    padding: 20,
  },
  appProve: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.greenLight,
    padding: normalize(10),
    width: normalize(135),
    height: normalize(25),
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  section2: {
    padding: normalize(20),
    backgroundColor: colors.white,
    width: normalize(380),
    height: normalize(250),
  },
  section3: {
    padding: normalize(20),
    backgroundColor: colors.white,
    width: '100%',
    height: normalize(250),
    justifyContent: 'space-around',
  },
  menu: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.disable,
    paddingBottom: normalize(20),
    justifyContent: 'space-between',
  },
  icon: {
    width: 24,
    height: 24,
  },
});
