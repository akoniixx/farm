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
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
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
import { normalize } from '../../functions/Normalize';
import LinearGradient from 'react-native-linear-gradient';
import Lottie from 'lottie-react-native';
export default function SlipWaitingScreen({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'SlipWaitingScreen'>) {
  const { taskId } = route.params;
  const [loading, setLoading] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [showModalExtend, setShowModalExtend] = useState(false);
  const [showModalCall, setShowModalCall] = useState(false);
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
  });
  const onSearchExtend = async () => {
    await AsyncStorage.setItem(
      'endTime',
      moment().add(30, 'minutes').toISOString(),
    );
    await AsyncStorage.setItem('taskId', taskId);
    setShowModalExtend(false);
  };
  const onSubmitCancelTask = async () => {
    try {
      const res = await TaskDatasource.cancelTask({ taskId, reason });
      if (res) {
        await AsyncStorage.removeItem('taskId');
        await AsyncStorage.removeItem('endTime');
        setReason('');

        navigation.navigate('MainScreen');
      }
    } catch (e) {
      console.log('error', e);
    }
  };
  useEffect(() => {
    const getTaskByTaskId = async (taskId: string) => {
      try {
        const res = await TaskDatasource.getTaskByTaskId(taskId);

        if (res && res.data) {
          setLoading(false);

          const endTime = await AsyncStorage.getItem('endTime');
          const isAfter = moment(endTime).isAfter(moment());
          if (!isAfter) {
            setShowModalExtend(true);
            const roundTime = {
              taskId,
              round: 1,
            };
            await AsyncStorage.setItem('extendObj', JSON.stringify(roundTime));
            // await AsyncStorage.removeItem('endTime');
            // await AsyncStorage.removeItem('taskId');
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
  }, [taskId]);

  return (
    <View style={{
      flex : 1,
      backgroundColor : '#FFFEFA'
    }}>
      <Header
        style={{
          paddingTop : 60
        }}
        componentLeft={
          <TouchableOpacity onPress={() => navigation.navigate('MainScreen')}>
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
            style={{
              flex: 1,
              paddingTop : normalize(30)
            }}>
            <View style={{
                width: '100%',
                height: 170,
                marginTop: 32,
              }}>
              <Lottie 
              source={image.waitinglottie} 
              autoPlay 
              loop 
              resizeMode="contain"
              />
            </View>
            <SectionBody {...taskData} />
          </LinearGradient>
          <View
            style={{
              backgroundColor : '#41A97A',
              padding: 16,
            }}>
            <MainButton
              label="กลับหน้าหลัก"
              onPress={() => navigation.navigate('MainScreen')}
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
                  returnKeyType="done"
                  returnKeyLabel="done"
                  onSubmitEditing={() => {
                    setIsFocus(false);
                    refInput.current?.blur();
                  }}
                  numberOfLines={6}
                  style={{
                    marginTop: 8,
                    width: '100%',
                    borderColor: isFocus
                      ? colors.greenLight
                      : colors.greyDivider,

                    minHeight: Platform.OS === 'ios' ? 6 * 20 : 40,
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
                onPress={() => {
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
                onPress={() => {
                  onSubmitCancelTask();
                  setIsShowModal(false);
                }}
                style={{
                  height: 54,
                  flex: 0.48,

                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.greenLight,
                  borderWidth: 1,
                  borderColor: colors.greenLight,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                }}>
                <Text
                  style={{
                    color: colors.white,
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
                  setShowModalExtend(false);
                  setShowModalCall(true);
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
                  fontFamily: fonts.AnuphanMedium,
                  color: '#007AFF',
                  fontSize: 20,
                }}>
                {callcenterNumber}
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
                  fontFamily: fonts.AnuphanMedium,
                  color: '#007AFF',
                  fontSize: 20,
                }}>
                ยกเลิก
              </Text>
            </View>
          </TouchableOpacity>
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
