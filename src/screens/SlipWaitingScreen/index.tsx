import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  Platform,
  Linking,
  StyleSheet,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Content from '../../components/Content/Content';
import Header from '../../components/Header/Header';
import icons from '../../assets/icons/icons';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';
import { image } from '../../assets';
import SectionBody from './SectionBody';
import { MainButton } from '../../components/Button/MainButton';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import { TaskDatasource } from '../../datasource/TaskDatasource';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { TaskDataTypeSlip } from '../../components/SlipCard/SlipCard';
import InputText from '../../components/InputText/InputText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { callcenterNumber } from '../../definitions/callCenterNumber';
import { mixpanel } from '../../../mixpanel';
import LinearGradient from 'react-native-linear-gradient';
import { normalize } from '../../functions/Normalize';
import Lottie from 'lottie-react-native';
import messaging from '@react-native-firebase/messaging';
export default function SlipWaitingScreen({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'SlipWaitingScreen'>) {
  const { taskId, countResend } = route.params;
  const [loading, setLoading] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [showModalExtend, setShowModalExtend] = useState(false);
  const [showModalExtendTwo, setModalExtendTwo] = useState(false);
  const [showModalExtendThree, setModalExtendThree] = useState(
    countResend === 3,
  );
  const refInput = React.useRef<any>(null);
  const [taskData, setTaskData] = useState<TaskDataTypeSlip>({
    id: '',
    comment: '',
    cropName: '',
    purposeSprayName: '',
    dateAppointment: '',
    farmAreaAmount: '',
    farmerId: '',
    farmerPlotId: '',
    preparationBy: '',
    price: '',
    purposeSprayId: '',
    taskNo: '',
    targetSpray: [],
    totalPrice: '',
    countResend: '',
  });
  const onSearchExtend = async () => {
    try {
      const res = await TaskDatasource.extendFindingDroner({
        taskId,
        farmerPlotId: taskData.farmerPlotId,
        dateAppointment: taskData.dateAppointment,
        farmerId: taskData.farmerId,
      });
      if (res && res.success) {
        setShowModalExtend(false);
        setModalExtendTwo(false);
      }
    } catch (e) {
      console.log('error', e);
    }
  };
  const onSubmitCancelTask = async () => {
    try {
      const res = await TaskDatasource.cancelTask({ taskId, reason });

      if (res && res.success) {
        setReason('');
        await AsyncStorage.removeItem('taskId');
        navigation.navigate('MainScreen');
      }
    } catch (e) {
      console.log('error', e);
    }
  };
  useEffect(() => {
    NotiFication();
    const getTaskByTaskId = async (taskId: string) => {
      try {
        const res = await TaskDatasource.getTaskByTaskId(taskId);

        if (res && res.data) {
          setLoading(false);

          if (res.data.status === 'WAIT_START') {
            await AsyncStorage.removeItem('taskId');
            navigation.navigate('SlipSuccessScreen', { taskId: res.data.id });
          }

          const { countResend, updatedAt } = res.data;
          const endTime = moment(updatedAt).add(30, 'minutes').toISOString();
          const isAfter = moment(endTime).isAfter(moment());
          if (!isAfter) {
            (countResend === null || !countResend) && setShowModalExtend(true);
            +countResend === 1 && setModalExtendTwo(true);
            +countResend >= 2 && setModalExtendThree(true);
          }
          setTaskData({
            ...res.data,
            cropName: res.data.purposeSpray.crop.cropName || '',
            purposeSprayName: res.data.purposeSpray.purposeSprayName || '',
          });
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    if (taskId) {
      getTaskByTaskId(taskId);
    }
  }, [taskId, navigation]);

  const NotiFication = () => {
    messaging().onMessage(async message => {
      const type = message.data?.type;
      if (type === 'RECEIVE_TASK_SUCCESS') {
        await AsyncStorage.removeItem('taskId');
        navigation.navigate('SlipSuccessScreen', {
          taskId: message.data?.taskId!,
        });
      }
      else if(type === 'DRONER_ALL_REJECT'){
        navigation.navigate('SlipWaitingScreen', {
          taskId: message.data?.taskId!,
          countResend : parseInt(message.data?.countResend!)
        });
     }
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFFEFA',
      }}>
      <Header
        style={styles.header}
        componentLeft={
          <TouchableOpacity
            onPress={() => {
              mixpanel.track('Tab back to main screen from waiting screen');
              navigation.navigate('MainScreen');
            }}>
            <Image
              source={icons.arrowUp}
              style={{
                width: 24,
                height: 24,
                transform: [{ rotate: '180deg' }],
              }}
            />
          </TouchableOpacity>
        }
        componentRight={
          <TouchableOpacity
            onPress={() => {
              mixpanel.track('Tab cancel booking from waiting screen');
              setIsShowModal(true);
            }}>
            <Text
              style={{
                color: colors.error,
                fontFamily: fonts.AnuphanBold,
                fontSize: 18,
              }}>
              ยกเลิกการจอง
            </Text>
          </TouchableOpacity>
        }
      />
      <Content noPadding>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <LinearGradient
            colors={['#FFFEFA', '#41A97A']}
            start={{ x: 0.65, y: 0.35 }}
            style={{
              flex: 1,
              paddingTop: normalize(30),
            }}>
            <View
              style={{
                width: '100%',
                height: Platform.OS === 'ios' ? 220 : 170,

                marginTop: 32,
                marginBottom: 32,
              }}>
              <Lottie
                source={image.waitinglottie}
                autoPlay
                loop
                resizeMode="cover"
              />
            </View>
            <SectionBody {...taskData} />
          </LinearGradient>
          <View
            style={{
              backgroundColor: '#41A97A',
              padding: 16,
            }}>
            <MainButton
              label="กลับหน้าหลัก"
              onPress={() => {
                mixpanel.track('Tab back to main screen from waiting screen');

                navigation.navigate('MainScreen');
              }}
              color={colors.orangeLight}
              style={{
                height: 52,
              }}
            />
          </View>
        </ScrollView>
      </Content>
      <Modal transparent={true} visible={isShowModal} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: Dimensions.get('window').width - 32,
              backgroundColor: colors.white,
              borderRadius: 12,
              padding: 20,
              height: 'auto',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                minHeight: 200,
              }}>
              <Text
                style={{
                  fontFamily: fonts.AnuphanBold,
                  fontSize: 22,
                }}>
                ขอยกเลิกการจอง
              </Text>
              <View
                style={{
                  width: '100%',
                  alignItems: 'flex-start',
                  marginTop: 16,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.AnuphanBold,
                    fontSize: 20,
                    color: colors.primary,
                  }}>
                  เหตุผลในการยกเลิก
                </Text>

                <InputText
                  ref={refInput}
                  placeholder="ระบุเหตุผล"
                  multiline={true}
                  onFocus={() => {
                    setIsFocus(true);
                  }}
                  onChangeText={text => {
                    setReason(text);
                  }}
                  returnKeyType="done"
                  returnKeyLabel="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => {
                    setIsFocus(false);
                    Keyboard.dismiss();
                    refInput.current?.blur();
                  }}
                  numberOfLines={6}
                  style={{
                    marginTop: 8,
                    width: '100%',
                    borderColor: isFocus
                      ? colors.greenLight
                      : colors.greyDivider,
                    textAlignVertical: 'top',

                    minHeight: Platform.OS === 'ios' ? 6 * 20 : 6 * 20,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                marginTop: 16,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={async () => {
                  if (taskData?.countResend && +taskData.countResend > 0) {
                    setIsShowModal(false);
                    return +taskData.countResend === 1
                      ? setModalExtendTwo(true)
                      : setModalExtendThree(true);
                  }

                  setIsShowModal(false);
                  setReason('');
                }}
                style={{
                  height: 54,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: colors.grey40,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  flex: 0.48,
                }}>
                <Text
                  style={{
                    color: colors.fontBlack,
                    fontFamily: fonts.AnuphanBold,
                    fontSize: 20,
                  }}>
                  ยกเลิก
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={reason.length === 0}
                onPress={() => {
                  mixpanel.track('Tab submit button from cancel booking modal');
                  onSubmitCancelTask();
                  setIsShowModal(false);
                }}
                style={{
                  height: 54,
                  flex: 0.48,

                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    reason.length === 0
                      ? colors.greyDivider
                      : colors.greenLight,
                  borderWidth: 1,
                  borderColor:
                    reason.length === 0
                      ? colors.greyDivider
                      : colors.greenLight,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                }}>
                <Text
                  style={{
                    color: reason.length === 0 ? colors.grey40 : colors.white,
                    fontFamily: fonts.AnuphanBold,
                    fontSize: 20,
                  }}>
                  ยืนยัน
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={showModalExtend} animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: Dimensions.get('window').width - 32,
              backgroundColor: colors.white,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}>
            {/* <TouchableOpacity
              onPress={() => {
                setShowModalExtend(false);
              }}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
              }}>
              <Image
                source={icons.closeBlack}
                style={{
                  width: 32,
                  height: 32,
                }}
              />
            </TouchableOpacity> */}
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                fontSize: 22,
              }}>
              ขออภัย !
            </Text>
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                fontSize: 22,
              }}>
              ขณะนี้มีผู้ใช้งานจำนวนมาก
            </Text>
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                fontSize: 18,
                marginVertical: 16,
              }}>
              ท่านสามารถกด ค้นหานักบินโดรนอีกครั้ง เพื่อค้นหาต่อไป หรือ
              กดติดต่อเจ้าหน้าที่ เพื่อให้ช่วยในการค้นหานักบินโดรน
            </Text>
            <View
              style={{
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${callcenterNumber}`);
                }}
                style={{
                  backgroundColor: colors.blueBorder,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.blueBorder,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                  marginVertical: 8,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 16,
                    }}
                    source={icons.callingWhite}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.AnuphanMedium,
                      color: colors.white,
                      fontSize: 20,
                    }}>
                    ติดต่อเจ้าหน้าที่
                  </Text>
                </View>
              </TouchableOpacity>
              <MainButton
                style={{
                  height: 52,
                  marginVertical: 0,
                }}
                onPress={onSearchExtend}
                color={colors.white}
                borderColor={'#202326'}
                label="ค้นหานักบินโดรนอีกครั้ง"
                fontColor={colors.fontBlack}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={showModalExtendTwo}
        animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: Dimensions.get('window').width - 32,
              backgroundColor: colors.white,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}>
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                fontSize: 22,
              }}>
              ขออภัย !
            </Text>
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                fontSize: 22,
              }}>
              ขณะนี้มีผู้ใช้งานจำนวนมาก
            </Text>
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                fontSize: 18,
                textAlign: 'center',
                marginVertical: 16,
              }}>
              ท่านสามารถกด ค้นหานักบินโดรนอีกครั้ง เพื่อค้นหาต่อไป หรือ
              กดติดต่อเจ้าหน้าที่ เพื่อให้ช่วยในการค้นหานักบินโดรน
            </Text>
            <View
              style={{
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${callcenterNumber}`);
                }}
                style={{
                  backgroundColor: colors.blueBorder,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.blueBorder,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                  marginVertical: 8,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 16,
                    }}
                    source={icons.callingWhite}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.AnuphanMedium,
                      color: colors.white,
                      fontSize: 20,
                    }}>
                    ติดต่อเจ้าหน้าที่
                  </Text>
                </View>
              </TouchableOpacity>
              <MainButton
                style={{
                  height: 52,
                  marginVertical: 0,
                }}
                onPress={onSearchExtend}
                color={colors.white}
                borderColor={'#202326'}
                label="ค้นหานักบินโดรนอีกครั้ง"
                fontColor={colors.fontBlack}
              />
              <TouchableOpacity
                onPress={() => {
                  setModalExtendTwo(false);
                  setIsShowModal(true);
                }}
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                  marginVertical: 8,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.AnuphanMedium,
                      color: colors.fontBlack,
                      fontSize: 20,
                    }}>
                    ยกเลิกการจอง
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={showModalExtendThree}
        animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: Dimensions.get('window').width - 32,
              backgroundColor: colors.white,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}>
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                fontSize: 22,
              }}>
              ขออภัย !
            </Text>
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                fontSize: 22,
              }}>
              ขณะนี้มีผู้ใช้งานจำนวนมาก
            </Text>
            <Text
              style={{
                fontFamily: fonts.SarabunLight,
                fontSize: 18,
                textAlign: 'center',
                marginVertical: 16,
              }}>
              ท่านสามารถกด ค้นหานักบินโดรนอีกครั้ง เพื่อค้นหาต่อไป หรือ
              กดติดต่อเจ้าหน้าที่ เพื่อให้ช่วยในการค้นหานักบินโดรน
            </Text>
            <View
              style={{
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${callcenterNumber}`);
                }}
                style={{
                  backgroundColor: colors.blueBorder,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.blueBorder,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                  marginVertical: 8,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 16,
                    }}
                    source={icons.callingWhite}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.AnuphanMedium,
                      color: colors.white,
                      fontSize: 20,
                    }}>
                    ติดต่อเจ้าหน้าที่
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setModalExtendThree(false);
                  setIsShowModal(true);
                }}
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                  marginVertical: 8,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.AnuphanMedium,
                      color: colors.fontBlack,
                      fontSize: 20,
                    }}>
                    ยกเลิกการจอง
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    ...Platform.select({
      ios: {
        paddingTop: 60,
      },
      android: {
        paddingVertical: 0,
        paddingHorizontal: 16,
      },
    }),
  },
});
