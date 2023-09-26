import React, { useEffect, useReducer, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors, font } from '../../assets';
import { stylesCentral } from '../../styles/StylesCentral';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import icons from '../../assets/icons/icons';
import { useFocusEffect } from '@react-navigation/native';
import { normalize } from '../../functions/Normalize';
import image from '../../assets/images/image';
import LinearGradient from 'react-native-linear-gradient';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { initProfileState, profileReducer } from '../../hook/profilefield';
import { TaskSuggestion } from '../../datasource/TaskSuggestion';
import Text from '../../components/Text/Text';
import MaintenanceHeader from '../MainScreen/MainScreenComponent/MaintenanceHeader';
import { useMaintenance } from '../../contexts/MaintenanceContext';

const AuthMainScreen: React.FC<any> = ({ navigation }) => {
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const { height, width } = Dimensions.get('window');
  const { notiMaintenance, maintenanceData } = useMaintenance();
  useEffect(() => {
    getProfile();
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
                      height: (height * 250) / 812,
                      position: 'absolute',
                    }}
                  />
                  <SafeAreaView edges={['top']} style={styles.headCard}>
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
                      paddingTop: 90,
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
                          source={icons.plots}
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
                      เพื่อให้สามารถจ้างงานนักบินโดรนได้
                    </Text>
                    <Text style={[styles.textEmpty]}>
                      กรุณาลงทะเบียน/เข้าสู่ระบบ
                    </Text>
                    <TouchableOpacity
                      style={{ margin: '3%' }}
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
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default AuthMainScreen;

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
    top: '5%',
  },
  headCard: {
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
