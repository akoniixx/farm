import React, { useReducer, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons, image } from '../../assets';
import { height, normalize } from '../../functions/Normalize';
import { stylesCentral } from '../../styles/StylesCentral';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomHeader from '../../components/CustomHeader';
import { Avatar } from '@rneui/themed';
import * as RootNavigation from '../../navigations/RootNavigation';
import { ScrollView } from 'react-native';
import PlotsItem, { StatusObject } from '../../components/Plots/Plots';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Authentication } from '../../datasource/AuthDatasource';
import { FCMtokenDatasource } from '../../datasource/FCMDatasource';
import { socket } from '../../functions/utility';
import { initProfileState, profileReducer } from '../../hook/profilefield';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { MainButton } from '../../components/Button/MainButton';
import ConditionScreen from '../RegisterScreen/ConditionScreen';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import PlotInProfile from '../../components/Plots/PlotsInProfile';
import Spinner from 'react-native-loading-spinner-overlay/lib';

const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    socket.removeAllListeners(`send-task-${farmer_id!}`);
    socket.close();
    await Authentication.logout();
  };
  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = async () => {
    setLoading(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    ProfileDatasource.getProfile(farmer_id!)
      .then(async res => {
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
            })
            
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  const openGooglePlay = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL(
        `https://apps.apple.com/th/app/iconkaset-droner/id6443516628?l=th`,
      );
    } else {
      Linking.openURL(
        `https://play.google.com/store/apps/details?id=com.iconkaset.droner`,
      );
    }
  };
  return (
    <SafeAreaView style={[stylesCentral.container]}>
      <View
        style={{
          maxHeight: '100%',
          backgroundColor: '#F7FFF0',
          justifyContent: 'center',
          padding: 25,
        }}>
        <Text
          style={{
            fontFamily: font.AnuphanBold,
            fontSize: normalize(20),
            color: colors.fontBlack,
            textAlign: 'center',
          }}>
          บัญชีของฉัน
        </Text>
      </View>
      <ScrollView>
        <View style={styles.section1}>
          <Avatar
            size={normalize(80)}
            source={
              profilestate.image === ''
                ? icons.avatar
                : { uri: profilestate.image }
            }
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
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.text]}>{profilestate.name} </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfileScreen')}>
                <Image
                  source={icons.edit}
                  style={{
                    width: normalize(20),
                    height: normalize(20),
                    tintColor: colors.fontBlack,
                    marginLeft: '55%',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: normalize(10),
                width: normalize(135),
                height: normalize(28),
                borderRadius: normalize(12),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: StatusObject(profilestate.status).fontColor,
                backgroundColor: StatusObject(profilestate.status).colorBg,
                flexDirection: 'row',
              }}>
              {StatusObject(profilestate.status).status === 'ตรวจสอบแล้ว' ? (
                <Image
                  source={icons.correct}
                  style={{ width: 16, height: 16, right: 5 }}
                />
              ) : (
                <Image
                  source={icons.warning}
                  style={{ width: 16, height: 16, right: 5 }}
                />
              )}

              <Text
                style={{
                  color: StatusObject(profilestate.status).fontColor,
                  fontFamily: font.AnuphanBold,
                  fontSize: normalize(14),
                }}>
                {StatusObject(profilestate.status).status === 'ตรวจสอบแล้ว'
                  ? 'ยืนยันตัวตนสำเร็จ'
                  : 'รอการตรวจสอบ'}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            margin: 2,
            backgroundColor: '#EBEEF0',
            height: 3,
          }}></View>
        <View style={[styles.section2]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.head]}>
              แปลงของคุณ ({profilestate.plotItem.length})
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AllPlotScreen');
              }}>
              <Text style={[styles.h1]}>ดูแปลงทั้งหมด</Text>
            </TouchableOpacity>
          </View>
          {profilestate.plotItem.length === 0 ? (
            <View>
              <Image
                source={image.empty_plot}
                style={{
                  width: normalize(138),
                  height: normalize(120),
                  alignSelf: 'center',
                  top: '5%',
                }}
              />
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: normalize(16),
                  color: colors.gray,
                  textAlign: 'center',
                  paddingVertical: normalize(22),
                }}>{`คุณไม่มีแปลงเกษตร
 กดเพิ่มแปลงเกษตรได้เลย!`}</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AddPlotScreen');
                }}>
                <View style={[styles.buttonAdd]}>
                  <Text style={styles.textaddplot}>+ เพิ่มแปลงเกษตร</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ top: 5 }}>
              <ScrollView
                style={{ paddingVertical: 10 }}
                horizontal
                showsHorizontalScrollIndicator={false}>
                <FlatList
                  horizontal={false}
                  scrollEnabled={false}
                  contentContainerStyle={{
                    alignSelf: 'flex-start',
                  }}
                  ItemSeparatorComponent={({ highlighted }) => (
                    <View style={[highlighted && { marginLeft: 0 }]} />
                  )}
                  numColumns={Math.ceil(profilestate.plotItem.length / 2)}
                  showsVerticalScrollIndicator={true}
                  showsHorizontalScrollIndicator={false}
                  data={profilestate.plotItem}
                  renderItem={({ item, index }) => (
                    <View style={{flexDirection: 'row' }}>
                      <View>
                        <PlotInProfile
                          key={index}
                          plotName={
                            !item.plotName
                              ? 'แปลงที่' +
                                ' ' +
                                `${index + 1}` +
                                ' ' +
                                item.plantName
                              : item.plotName
                          }
                          raiAmount={item.raiAmount}
                          locationName={item.locationName}
                          plantName={item.plantName}
                          status={item.status}
                          index={index}
                        />
                      </View>
                    </View>
                  )}
                />
              </ScrollView>
            </View>
          )}
        </View>
        <View
          style={{
            margin: 2,
            backgroundColor: '#EBEEF0',
            height: 3,
          }}></View>
        <View style={[styles.section3]}>
          <View
            style={{
              backgroundColor: colors.white,
              width: '100%',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              onPress={openGooglePlay}
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
                style={[styles.icon, { marginRight: '-15%' }]}
              />
              <Text style={[styles.h2]}>มาเป็นนักบินโดรนร่วมกับเรา</Text>
              <Image
                source={icons.arrowRigth}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PrivacyScreen');
              }}
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
                style={[styles.icon, { marginRight: '-23%' }]}
              />
              <Text style={styles.h2}>นโยบายความเป็นส่วนตัว</Text>
              <Image
                source={icons.arrowRigth}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('DeleteProfileScreen', {
                  tele: profilestate.id,
                });
              }}
              style={{
                padding: normalize(20),
                flexDirection: 'row',
                height: normalize(62),
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderColor: colors.disable,
              }}>
              <Image
                source={icons.deleteUser}
                style={[styles.icon, { marginRight: '-55%' }]}
              />
              <Text style={styles.h2}>ลบบัญชี</Text>
              <Image
                source={icons.arrowRigth}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await onLogout();
                RootNavigation.navigate('Auth', {
                  screen: 'HomeScreen',
                });
              }}
              style={{
                padding: normalize(20),
                flexDirection: 'row',
                height: normalize(62),
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderColor: colors.disable,
              }}>
              <Image
                source={icons.logout}
                style={[styles.icon, { marginRight: '-45%' }]}
              />
              <Text style={styles.h2}>ออกจากระบบ</Text>
              <Image
                source={icons.arrowRigth}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </SafeAreaView>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  btAdd: {
    top: normalize(100),
    borderRadius: 10,
    height: normalize(80),
    width: normalize(340),
    borderStyle: 'dashed',
    position: 'relative',
  },
  textaddplot: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
    textAlign: 'center',
    top: '30%',
  },
  buttonAdd: {
    borderColor: '#1F8449',
    borderWidth: 1,
    borderRadius: 10,
    height: normalize(80),
    width: normalize(350),
    borderStyle: 'dashed',
    position: 'relative',
    alignSelf: 'center',
  },
  buttomBlank: {
    height: normalize(54),
    width: normalize(343),
    alignSelf: 'center',
    marginTop: normalize(30),
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
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.SarabunMedium,
    fontSize: 18,
    color: colors.fontBlack,
    alignItems: 'center',
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
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  section1: {
    flexDirection: 'row',
    backgroundColor: '#F7FFF0',
    display: 'flex',
    alignItems: 'flex-start',
    padding: 15,
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
    padding: 15,
    backgroundColor: colors.white,
  },
  section3: {
    backgroundColor: colors.white,
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
    width: normalize(24),
    height: normalize(24),
  },
});
