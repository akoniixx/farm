import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, font, icons } from '../../assets';
import { Text } from '@rneui/base';
import fonts from '../../assets/fonts';
import { normalize } from '@rneui/themed';
import { Image, Platform, StyleSheet, View } from 'react-native';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import PromotionScreen from '../../screens/PromotionScreen/PromotionScreen';
import { responsiveHeigth, responsiveWidth } from '../../functions/responsive';
import TaskScreen from '../../screens/MyTaskScreen/MyTaskScreen';
import MainNavigator from '../MainNavigator';
import messaging, { firebase } from '@react-native-firebase/messaging';
import * as RootNavigation from '../RootNavigation';
import FarmerPlotSuccess from '../../components/Modal/FarmerPlotSuccess';
import FarmerRegisterSuccess from '../../components/Modal/FarmerRegisterSuccess';
import FarmerRegisterFailed from '../../components/Modal/FarmerRegisterFailed';
import FarmerPlotFailed from '../../components/Modal/FarmerPlotFailed';
import { TaskDatasource } from '../../datasource/TaskDatasource';
import { TabActions } from '@react-navigation/native';
import MainScreen from '../../screens/MainScreen/MainScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseInitialize } from '../../firebase/notification';

const Tab = createBottomTabNavigator();

const MainTapNavigator: React.FC<any> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [farmerRegisterSuccess, setFarmerRegisterSuccess] =
    useState<boolean>(false);
  const [farmerRegisterFailed, setFarmerRegisterFailed] =
    useState<boolean>(false);
  const [farmerPlotSuccess, setFarmerPlotSuccess] = useState<boolean>(false);
  const [farmerPlotFailed, setFarmerPlotFailed] = useState<boolean>(false);
  const [messageNoti, setMessageNoti] = useState<string>('');
  const [initialRouteName, setInitialRouteName] = useState('หน้าแรก');
  useEffect(() => {
    if(!firebase.apps.length){
      firebaseInitialize();
    }
    messaging()
      .getInitialNotification()
      .then(message => {
        if (message) {
          const type = message.data?.type;
          switch (type) {
            case 'RECEIVE_TASK_SUCCESS':
              TaskDatasource.getTaskByTaskId(message.data?.taskId!)
                .then(async res => {
                  await AsyncStorage.removeItem('taskId')
                  RootNavigation.navigate('Main', {
                    screen: 'MyTaskDetailScreenNoti',
                    params: {
                      task: res.data,
                    },
                  });
                })
                .catch(err => console.log(err));
              break;
            case 'THIRTY_MINUTE_REMIND':
              RootNavigation.navigate('Main', {
                screen: 'SlipWaitingScreen',
                params: {
                  taskId: message.data?.taskId,
                  countResend : message.data?.countResend
                },
              });
              break;
            case 'DRONER_ALL_REJECT':
              RootNavigation.navigate('Main', {
                screen: 'SlipWaitingScreen',
                params: {
                  taskId: message.data?.taskId,
                },
              });
              break;
            case 'APPROVE_FARMER_SUCCESS':
              setInitialRouteName('บัญชีของฉัน');
              break;
            case 'APPROVE_FARMER_FAIL':
              setInitialRouteName('บัญชีของฉัน');
              break;
            case 'APPROVE_FARMER_PLOT_SUCCESS':
              setInitialRouteName('บัญชีของฉัน');
              break;
            case 'APPROVE_FARMER_PLOT_FAIL':
              setInitialRouteName('บัญชีของฉัน');
              break;
          }
        }
        setLoading(false);
      });
    messaging().onNotificationOpenedApp(async message => {
      const jumpAction = TabActions.jumpTo('บัญชีของฉัน');
      const type = message.data?.type;
      switch (type) {
        case 'RECEIVE_TASK_SUCCESS':
          TaskDatasource.getTaskByTaskId(message.data?.taskId!)
            .then(async res => {
              await AsyncStorage.removeItem('taskId')
              RootNavigation.navigate('Main', {
                screen: 'MyTaskDetailScreenNoti',
                params: {
                  task: res.data,
                },
              });
            })
            .catch(err => console.log(err));
          break;
        case 'THIRTY_MINUTE_REMIND':
          RootNavigation.navigate('Main', {
            screen: 'SlipWaitingScreen',
            params: {
              taskId: message.data?.taskId,
              countResend : message.data?.countResend
            },
          });
          break;
        case 'DRONER_ALL_REJECT':
          RootNavigation.navigate('Main', {
            screen: 'SlipWaitingScreen',
            params: {
              taskId: message.data?.taskId,
              countResend : message.data?.countResend
            },
          });
          break;
        case 'APPROVE_FARMER_SUCCESS':
          navigation.dispatch(jumpAction);
          break;
        case 'APPROVE_FARMER_FAIL':
          navigation.dispatch(jumpAction);
          break;
        case 'APPROVE_FARMER_PLOT_SUCCESS':
          navigation.dispatch(jumpAction);
          break;
        case 'APPROVE_FARMER_PLOT_FAIL':
          navigation.dispatch(jumpAction);
          break;
      }
    });

    messaging().onMessage(async message => {
      const type = message.notification?.body;
      switch (type) {
        case 'RECEIVE_TASK_SUCCESS':
          await AsyncStorage.removeItem('taskId')
          RootNavigation.navigate('Main', {
            screen: 'SlipSuccessScreen',
            params: {
              taskId: message.data?.taskId,
            },
          });
          break;
        case 'THIRTY_MINUTE_REMIND':
          RootNavigation.navigate('Main', {
            screen: 'SlipWaitingScreen',
            params: {
              taskId: message.data?.taskId,
              countResend : message.data?.countResend
            },
          });
          break;
        case 'DRONER_ALL_REJECT':
          RootNavigation.navigate('Main', {
            screen: 'SlipWaitingScreen',
            params: {
              taskId: message.data?.taskId,
              countResend : message.data?.countResend
            },
          });
          break;
        case 'APPROVE_FARMER_SUCCESS':
          setMessageNoti(message.notification?.body!);
          setFarmerRegisterSuccess(true);
          break;
        case 'APPROVE_FARMER_FAIL':
          setMessageNoti(message.notification?.body!);
          setFarmerRegisterFailed(true);
          break;
        case 'APPROVE_FARMER_PLOT_SUCCESS':
          setMessageNoti(message.notification?.body!);
          setFarmerPlotSuccess(true);
          break;
        case 'APPROVE_FARMER_PLOT_FAIL':
          setMessageNoti(message.notification?.body!);
          setFarmerPlotFailed(true);
          break;
      }
    });
  }, []);
  if (loading) {
    return <></>;
  } else {
    return (
      <>
        <FarmerRegisterSuccess
          text={messageNoti}
          show={farmerRegisterSuccess}
          onClose={() => {
            setFarmerRegisterSuccess(false);
          }}
          onMainClick={() => {
            setFarmerRegisterSuccess(false);
            // setInitialRouteName("หน้าแรก")
            const jumpAction = TabActions.jumpTo('หน้าแรก');
            navigation.dispatch(jumpAction);
          }}
        />
        <FarmerRegisterFailed
          text={messageNoti}
          show={farmerRegisterFailed}
          onClose={() => {
            setFarmerRegisterFailed(false);
          }}
          onMainClick={() => {
            setFarmerRegisterFailed(false);
            const jumpAction = TabActions.jumpTo('บัญชีของฉัน');
            navigation.dispatch(jumpAction);
          }}
        />
        <FarmerPlotSuccess
          text={messageNoti}
          show={farmerPlotSuccess}
          onClose={() => {
            setFarmerPlotSuccess(false);
          }}
          onMainClick={() => {
            setFarmerPlotSuccess(false);
            const jumpAction = TabActions.jumpTo('บัญชีของฉัน');
            navigation.dispatch(jumpAction);
          }}
        />
        <FarmerPlotFailed
          text={messageNoti}
          show={farmerPlotFailed}
          onClose={() => {
            setFarmerPlotFailed(false);
          }}
          onMainClick={() => {
            setFarmerPlotFailed(false);
            const jumpAction = TabActions.jumpTo('บัญชีของฉัน');
            navigation.dispatch(jumpAction);
          }}
        />
        <Tab.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{
            headerShown: false,
            tabBarStyle: { height: '9%', borderBottomColor: colors.white },
          }}>
          <Tab.Screen
            name="หน้าแรก"
            component={MainScreen}
            options={{
              tabBarLabelStyle: {
                fontFamily: font.AnuphanMedium,
              },
              lazy: true,
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontFamily: fonts.AnuphanMedium,
                    fontSize: normalize(16),
                    color: focused ? colors.greenLight : '#8D96A0',
                  }}>
                  หน้าแรก
                </Text>
              ),
              tabBarIcon: i =>
                i.focused ? (
                  <Image
                    source={icons.home_active}
                    style={{ width: 20, height: 20, top: normalize(3) }}
                  />
                ) : (
                  <Image
                    source={icons.home}
                    style={{ width: 20, height: 20, top: normalize(3) }}
                  />
                ),
            }}
          />
          <Tab.Screen
            name="งานของฉัน"
            component={TaskScreen}
            options={{
              tabBarLabelStyle: {
                fontFamily: font.AnuphanMedium,
              },
              lazy: true,
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontFamily: fonts.AnuphanMedium,
                    fontSize: normalize(16),
                    color: focused ? colors.greenLight : '#8D96A0',
                  }}>
                  งานของฉัน
                </Text>
              ),
              tabBarIcon: i =>
                i.focused ? (
                  <Image
                    source={icons.mytask_active}
                    style={{ width: 22, height: 22, top: normalize(3) }}
                  />
                ) : (
                  <Image
                    source={icons.mytask}
                    style={{ width: 22, height: 22, top: normalize(3) }}
                  />
                ),
            }}
          />
          <Tab.Screen
            name="โปรโมชั่น"
            component={PromotionScreen}
            options={{
              tabBarLabelStyle: {
                fontFamily: font.AnuphanMedium,
              },
              lazy: true,
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontFamily: fonts.AnuphanMedium,
                    fontSize: normalize(16),
                    color: focused ? colors.greenLight : '#8D96A0',
                  }}>
                  โปรโมชั่น
                </Text>
              ),
              tabBarIcon: i =>
                i.focused ? (
                  <Image
                    source={icons.discount_active}
                    style={{ width: 19, height: 19, top: normalize(3) }}
                  />
                ) : (
                  <Image
                    source={icons.discount}
                    style={{ width: 19, height: 19, top: normalize(3) }}
                  />
                ),
            }}
          />
          <Tab.Screen
            name="บัญชีของฉัน"
            component={ProfileScreen}
            options={{
              tabBarLabelStyle: {
                fontFamily: font.AnuphanMedium,
              },
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    fontFamily: fonts.AnuphanMedium,
                    fontSize: normalize(16),
                    color: focused ? colors.greenLight : '#8D96A0',
                  }}>
                  บัญชีของฉัน
                </Text>
              ),
              tabBarIcon: i =>
                i.focused ? (
                  <Image
                    source={icons.profile_active}
                    style={{ width: 17, height: 21, top: normalize(3) }}
                  />
                ) : (
                  <Image
                    source={icons.profile}
                    style={{ width: 16, height: 20, top: normalize(3) }}
                  />
                ),
            }}
          />
        </Tab.Navigator>
      </>
    );
  }
};

export default MainTapNavigator;
