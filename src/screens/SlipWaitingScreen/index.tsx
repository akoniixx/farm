import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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

export default function SlipWaitingScreen({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'SlipWaitingScreen'>) {
  const { taskId } = route.params;
  const [loading, setLoading] = useState(true);
  const [isFocus, setIsFocus] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
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
  useEffect(() => {
    const getTaskByTaskId = async (taskId: string) => {
      try {
        const res = await TaskDatasource.getTaskByTaskId(taskId);
        if (res && res.data) {
          setTaskData({
            ...res.data,
            cropName: res.data.purposeSpray.crop.cropName || '',
            purposeSprayName: res.data.purposeSpray.purposeSprayName || '',
          });
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    };
    if (taskId) {
      getTaskByTaskId(taskId);
    }
  }, [taskId]);

  return (
    <Container>
      <Header
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
          <View
            style={{
              flex: 1,
            }}>
            <Image
              source={image.waitingDroner}
              style={{
                width: '100%',
                height: 320,
              }}
              resizeMode="contain"
            />
            <SectionBody {...taskData} />
          </View>
          <View
            style={{
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
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </Container>
  );
}
