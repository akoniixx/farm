import React, { useMemo, useReducer, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons, image } from '../../assets';
import { height, normalize } from '../../functions/Normalize';
import CustomHeader from '../../components/CustomHeader';
import { Avatar, Icon } from '@rneui/themed';
import * as RootNavigation from '../../navigations/RootNavigation';
import { ScrollView } from 'react-native';
import PlotsItem, { StatusObject } from '../../components/Plots/Plots';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Authentication } from '../../datasource/AuthDatasource';
import { socket } from '../../functions/utility';
import { initProfileState, profileReducer } from '../../hook/profilefield';
import { useEffect } from 'react';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import PlotInProfile from '../../components/Plots/PlotsInProfile';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { useIsFocused } from '@react-navigation/native';
import { callcenterNumber } from '../../definitions/callCenterNumber';

const ProfileScreen: React.FC<any> = ({ navigation, route }) => {
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [reason, setReason] = useState<any>('');
  const noti = route.params?.noti ?? false;
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const [showModalCall, setShowModalCall] = useState(false);
  const [countPlot, setCountPlot] = useState<any>();

  const isFocused = useIsFocused();
  const onLogout = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    socket.removeAllListeners(`send-task-${farmer_id!}`);
    socket.close();
    await Authentication.logout(navigation);
  };

  const newPlotList = useMemo(() => {
    var sttPlot = profilestate.plotItem.map((x: any) => x.status);
    var toRemove = 'INACTIVE';
    var index = sttPlot.indexOf(toRemove);
    if (index > -1) {
      sttPlot.splice(index);
    }
    console.log(sttPlot);
    setCountPlot(sttPlot.length);
    const findPlot = profilestate.plotItem.filter(
      (x: any) => x.status !== 'INACTIVE',
    );
    const convertToArrayNested = findPlot.reduce(
      (acc: any, cur: any, index: number) => {
        const isOdd = index % 2 === 0;
        if (isOdd) {
          acc.push([cur]);
        }
        if (!isOdd) {
          acc[acc.length - 1].push(cur);
        }
        return acc;
      },
      [],
    );
    return convertToArrayNested;
  }, [profilestate.plotItem]);

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const farmer_id = await AsyncStorage.getItem('farmer_id');
      ProfileDatasource.getProfile(farmer_id!)
        .then(async res => {
          setLoading(true);
          setReason(res.reason);
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
                setLoading(true);
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
    getProfile();
  }, [isFocused]);

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
    <SafeAreaView style={{ backgroundColor: '#F7FFF0' }}>
      {noti ? (
        <CustomHeader
          title="บัญชีของฉัน"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
      ) : (
        <View
          style={{
            maxHeight: '100%',
            backgroundColor: '#F7FFF0',
            justifyContent: 'center',
            position: 'relative',
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
      )}
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
              flexDirection: 'row',
              width: screenWidth,
            }}>
            <View
              style={{
                flexDirection: 'column',
                marginLeft: normalize(15),
              }}>
              <Text style={[styles.text]}>{profilestate.name} </Text>
              {StatusObject(profilestate.status).status === 'ไม่อนุมัติ' ? (
                <View
                  style={{
                    marginTop: normalize(10),
                    height: normalize(28),
                    borderRadius: normalize(15),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: StatusObject(profilestate.status).fontColor,
                    backgroundColor: StatusObject(profilestate.status).colorBg,
                    flexDirection: 'row',
                  }}>
                  {StatusObject(profilestate.status).status ===
                  'ตรวจสอบแล้ว' ? (
                    <Image
                      source={icons.correct}
                      style={{ width: 16, height: 16, right: 5 }}
                    />
                  ) : StatusObject(profilestate.status).status ===
                    'รอการตรวจสอบ' ? (
                    <Image
                      source={icons.warning}
                      style={{ width: 16, height: 16, right: 5 }}
                    />
                  ) : StatusObject(profilestate.status).status ===
                    'ไม่อนุมัติ' ? (
                    <Image
                      source={icons.wrong}
                      style={{ width: 16, height: 16, right: 5 }}
                    />
                  ) : (
                    <Image
                      style={{
                        width: 16,
                        height: 16,
                        right: 5,
                        tintColor: colors.bg,
                      }}
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
                      : StatusObject(profilestate.status).status ===
                        'รอการตรวจสอบ'
                      ? 'รอการตรวจสอบ'
                      : StatusObject(profilestate.status).status ===
                        'ไม่อนุมัติ'
                      ? 'ยืนยันตัวตนไม่สำเร็จ'
                      : 'ปิดการใช้งาน'}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    marginTop: normalize(10),
                    width: normalize(135),
                    height: normalize(28),
                    borderRadius: normalize(15),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: StatusObject(profilestate.status).fontColor,
                    backgroundColor: StatusObject(profilestate.status).colorBg,
                    flexDirection: 'row',
                  }}>
                  {StatusObject(profilestate.status).status ===
                  'ตรวจสอบแล้ว' ? (
                    <Image
                      source={icons.correct}
                      style={{ width: 16, height: 16, right: 5 }}
                    />
                  ) : StatusObject(profilestate.status).status ===
                    'รอการตรวจสอบ' ? (
                    <Image
                      source={icons.warning}
                      style={{ width: 16, height: 16, right: 5 }}
                    />
                  ) : StatusObject(profilestate.status).status ===
                    'ไม่อนุมัติ' ? (
                    <Image
                      source={icons.wrong}
                      style={{ width: 16, height: 16, right: 5 }}
                    />
                  ) : null}

                  <Text
                    style={{
                      color: StatusObject(profilestate.status).fontColor,
                      fontFamily: font.AnuphanBold,
                      fontSize: normalize(14),
                    }}>
                    {StatusObject(profilestate.status).status === 'ตรวจสอบแล้ว'
                      ? 'ยืนยันตัวตนสำเร็จ'
                      : StatusObject(profilestate.status).status ===
                        'รอการตรวจสอบ'
                      ? 'รอการตรวจสอบ'
                      : StatusObject(profilestate.status).status ===
                        'ไม่อนุมัติ'
                      ? 'ยืนยันตัวตนไม่สำเร็จ'
                      : 'ปิดการใช้งาน'}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ alignSelf: 'flex-start' }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfileScreen')}>
                <Image
                  source={icons.edit}
                  style={{
                    width: normalize(20),
                    height: normalize(20),
                    tintColor: colors.fontBlack,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {profilestate.status === 'REJECTED' && (
          <View style={{ paddingHorizontal: 25, paddingBottom: 15 }}>
            <View style={styles.card}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.textVerify, { fontWeight: '800' }]}>
                  หมายเหตุ :
                </Text>
                <Text style={styles.textVerify}> {reason}</Text>
              </View>

              <Text style={styles.textVerify}>
                กรุณาติดต่อเจ้าหน้าที่ เพื่อดำเนินการแก้ไข
              </Text>
              <View style={{ paddingTop: 15 }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowModalCall(true);
                  }}
                  style={{
                    ...Platform.select({
                      ios: {
                        height: 60,
                        backgroundColor: colors.white,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        borderRadius: 12,
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
        {profilestate.status === 'INACTIVE' && (
          <View style={{ paddingHorizontal: 25, paddingBottom: 15 }}>
            <View style={styles.card}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.textVerify, { fontWeight: '800' }]}>
                  หมายเหตุ :
                </Text>
                <Text style={styles.textVerify}>
                  {' '}
                  บัญชีของท่านถูกปิดการใช้งาน
                </Text>
              </View>

              <Text style={styles.textVerify}>
                หากต้องการเปิดใช้งานบัญชี กรุณาติดต่อ เจ้าหน้าที่
              </Text>
              <View style={{ paddingTop: 15 }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowModalCall(true);
                  }}
                  style={{
                    ...Platform.select({
                      ios: {
                        height: 60,
                        backgroundColor: colors.white,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        borderRadius: 12,
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
        {profilestate.status === 'PENDING' && (
          <View style={{ paddingHorizontal: 25, paddingBottom: 15 }}>
            <View style={styles.card}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.textVerify}>
                  ขณะนี้เจ้าหน้าที่กำลังตรวจสอบเอกสารยืนยันของคุณอยู่
                  สอบถามข้อมูลเพิ่มเติม กรุณาติดต่อเจ้าหน้าที่
                </Text>
              </View>
              <View style={{ paddingTop: 15 }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowModalCall(true);
                  }}
                  style={{
                    ...Platform.select({
                      ios: {
                        height: 60,
                        backgroundColor: colors.white,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        borderRadius: 12,
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
        <View
          style={{
            paddingHorizontal: 2,
            backgroundColor: '#EBEEF0',
            height: 3,
          }}
        />
        <View style={[styles.section2]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
            }}>
            <Text style={[styles.head]}>แปลงของคุณ ({countPlot})</Text>
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
                <View style={{ paddingHorizontal: normalize(15) }}>
                  <View style={[styles.buttonAdd]}>
                    <Text style={styles.textaddplot}>+ เพิ่มแปลงเกษตร</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'space-between',
                backgroundColor: 'white',
                alignSelf: 'center',
              }}>
              <FlatList
                pagingEnabled={false}
                keyExtractor={item => item.id}
                horizontal={true}
                scrollEnabled={true}
                contentContainerStyle={{
                  justifyContent: 'center',
                }}
                ItemSeparatorComponent={({ highlighted }) => (
                  <View style={[highlighted && { marginLeft: 0 }]} />
                )}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                data={newPlotList}
                renderItem={({ item, index }) => (
                  <View style={{ minHeight: 300 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <PlotInProfile
                          key={index}
                          plotName={
                            !item[0].plotName
                              ? 'แปลงที่' +
                                ' ' +
                                `${index + 1}` +
                                ' ' +
                                item[0].plantName
                              : item[0].plotName
                          }
                          raiAmount={item[0].raiAmount}
                          locationName={item[0].locationName}
                          plantName={item[0].plantName}
                          status={item[0].status}
                          index={index}
                        />
                      </View>
                    </View>
                    {item?.[1] && (
                      <View style={{ flexDirection: 'row' }}>
                        <View>
                          <PlotInProfile
                            key={index}
                            plotName={
                              !item[1].plotName
                                ? 'แปลงที่' +
                                  ' ' +
                                  `${index + 1}` +
                                  ' ' +
                                  item[1].plantName
                                : item[1].plotName
                            }
                            raiAmount={item[1].raiAmount}
                            locationName={item[1].locationName}
                            plantName={item[1].plantName}
                            status={item[1].status}
                            index={index}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                )}
              />
            </View>
          )}
        </View>
        <View
          style={{
            paddingHorizontal: 2,
            backgroundColor: '#EBEEF0',
            height: 3,
          }}
        />
        <View style={[styles.section3]}>
          <View
            style={{
              backgroundColor: colors.white,
              width: '100%',
              justifyContent: 'space-around',
              paddingHorizontal: 10,
            }}>
            <TouchableOpacity onPress={openGooglePlay}>
              <View style={styles.listTile}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image source={image.iconAppDrone} style={[styles.icon]} />
                  <Text style={[styles.h2, { paddingHorizontal: 20 }]}>
                    มาเป็นนักบินโดรนร่วมกับเรา
                  </Text>
                </View>
                <Image
                  source={icons.arrowRigth}
                  style={{ width: 24, height: 24 }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PrivacyScreen');
              }}>
              <View style={styles.listTile}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image source={icons.lock} style={[styles.icon]} />
                  <Text style={[styles.h2, { paddingHorizontal: 20 }]}>
                    นโยบายความเป็นส่วนตัว
                  </Text>
                </View>
                <Image
                  source={icons.arrowRigth}
                  style={{ width: 24, height: 24 }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('DeleteProfileScreen', {
                  tele: profilestate.id,
                });
              }}>
              <View style={styles.listTile}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image source={icons.deleteUser} style={[styles.icon]} />
                  <Text style={[styles.h2, { paddingHorizontal: 20 }]}>
                    ลบบัญชี
                  </Text>
                </View>
                <Image
                  source={icons.arrowRigth}
                  style={{ width: 24, height: 24 }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await onLogout();
                RootNavigation.navigate('Auth', {
                  screen: 'HomeScreen',
                });
              }}>
              <View style={styles.listTile}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.logout}
                    style={{ width: 24, height: 24 }}
                  />
                  <Text style={[styles.h2, { paddingHorizontal: 20 }]}>
                    ออกจากระบบ
                  </Text>
                </View>
                <Image
                  source={icons.arrowRigth}
                  style={{ width: 24, height: 24 }}
                />
              </View>
            </TouchableOpacity>
            {profilestate.plotItem.length > 1 ? (
              <View
                style={{
                  ...Platform.select({
                    ios: {
                      paddingVertical: 20,
                    },
                    android: {
                      paddingVertical: 40,
                    },
                  }),
                }}
              />
            ) : (
              <View
                style={{
                  ...Platform.select({
                    ios: {
                      paddingVertical: 50,
                    },
                    android: {
                      paddingVertical: 40,
                    },
                  }),
                }}
              />
            )}
          </View>
        </View>
        <Modal animationType="fade" transparent={true} visible={showModalCall}>
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
  listTile: {
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: normalize(0.5),
    borderBottomColor: colors.disable,
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
    width: '100%',
    borderStyle: 'dashed',
    position: 'relative',
    alignSelf: 'center',
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
    lineHeight: 28,
  },
  h2: {
    fontFamily: font.SarabunMedium,
    fontSize: 18,
    color: colors.fontBlack,
    alignItems: 'center',
  },
  text: {
    fontFamily: font.AnuphanMedium,
    fontWeight: '800',
    fontSize: normalize(20),
    color: colors.fontBlack,
    width: 200,
  },
  section1: {
    flexDirection: 'row',
    backgroundColor: '#F7FFF0',
    display: 'flex',
    alignItems: 'flex-start',
    padding: 15,
    width: '100%',
  },
  section2: {
    ...Platform.select({
      ios: {
        padding: 10,
        paddingVertical: 15,
        backgroundColor: colors.white,
      },
      android: {
        paddingVertical: 15,
        backgroundColor: colors.white,
      },
    }),
  },
  section3: {
    backgroundColor: colors.white,
    justifyContent: 'space-around',
  },
  icon: {
    width: normalize(24),
    height: normalize(24),
  },
  card: {
    backgroundColor: colors.redLight,
    borderWidth: 1,
    padding: normalize(12),
    borderRadius: 15,
    borderColor: colors.transOrange,
  },
  textVerify: {
    fontSize: normalize(16),
    fontFamily: font.SarabunLight,
    lineHeight: 34,
  },
});
