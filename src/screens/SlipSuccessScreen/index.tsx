import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Content from '../../components/Content/Content';
import SectionBody from './SectionBody';
import colors from '../../assets/colors/colors';
import image from '../../assets/images/image';
import LinearGradient from 'react-native-linear-gradient';
import { normalize } from '@rneui/themed';
import { TaskDataTypeSlip } from '../../components/SlipCard/SlipCard';
import { TaskDatasource } from '../../datasource/TaskDatasource';
import Lottie from 'lottie-react-native';

export default function SlipSuccessScreen({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'SlipSuccessScreen'>) {
  const { taskId } = route.params;
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
    countResend: null,
  });

  useEffect(() => {
    TaskDatasource.getTaskByTaskId(taskId)
      .then(res =>
        setTaskData({
          ...res.data,
          cropName: res.data.purposeSpray.crop.cropName || '',
          purposeSprayName: res.data.purposeSpray.purposeSprayName || '',
        }),
      )
      .catch(err => console.log(err));
  }, [taskId]);
  return (
    <View
      style={{
        flex: 1,
      }}>
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
                height: Platform.OS === 'ios' ? 200 : 170,

                marginTop: 32,
              }}>
              <Lottie
                autoPlay
                speed={0.4}
                source={image.successfullottie}
                resizeMode="contain"
              />
            </View>
            <SectionBody {...taskData} />
          </LinearGradient>
          <View
            style={{
              padding: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#41A97A',
              width: '100%',
              paddingBottom: normalize(40),
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('MainScreen')}
              style={{
                height: 52,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                paddingHorizontal: 16,
                width: '48%',
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: colors.white,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Anuphan-Bold',
                  color: colors.white,
                }}>
                รายละเอียดงาน
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('MainScreen')}
              style={{
                height: 52,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                paddingHorizontal: 16,
                width: '48%',
                borderWidth: 1,
                borderColor: colors.orangeLight,
                backgroundColor: colors.orangeLight,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Anuphan-Bold',
                  color: colors.white,
                }}>
                กลับหน้าหลัก
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Content>
    </View>
  );
}
