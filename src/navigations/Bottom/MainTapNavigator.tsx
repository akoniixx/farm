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
import messaging from '@react-native-firebase/messaging';
import * as RootNavigation from '../RootNavigation';
import FarmerPlotSuccess from '../../components/Modal/FarmerPlotSuccess';
import FarmerRegisterSuccess from '../../components/Modal/FarmerRegisterSuccess';
import FarmerRegisterFailed from '../../components/Modal/FarmerRegisterFailed';
import FarmerPlotFailed from '../../components/Modal/FarmerPlotFailed';
import { TaskDatasource } from '../../datasource/TaskDatasource';
import {TabActions} from '@react-navigation/native';
import MainScreen from '../../screens/MainScreen/MainScreen';

const Tab = createBottomTabNavigator();

const MainTapNavigator: React.FC<any> = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [farmerRegisterSuccess,setFarmerRegisterSuccess] = useState<boolean>(false)
  const [farmerRegisterFailed,setFarmerRegisterFailed] = useState<boolean>(false)
  const [farmerPlotSuccess,setFarmerPlotSuccess] = useState<boolean>(false)
  const [farmerPlotFailed,setFarmerPlotFailed] = useState<boolean>(false)
  const [initialRouteName, setInitialRouteName] = useState('หน้าแรก');
  useEffect(()=>{
    messaging().getInitialNotification().then(
      message =>{
        if(message){
          const type = message.notification?.body;
          switch (type){
            case "find droner success":
              TaskDatasource.getTaskByTaskId("3dc03f2b-9f4d-4861-8124-f576fdac3834").then(
                res => {
                  console.log(res.data)
                  // RootNavigation.navigate('Main', {
                  //   screen: 'MyTaskDetailScreen',
                  //   params : {
                  //     task: res.data,
                  //   }
                  // })
                }
              ).catch(err => console.log(err))
            break;
            case "find droner failed":
              RootNavigation.navigate('Main', {
                screen: 'SlipWaitingScreen',
                params: {
                  taskId: message.data?.taskId
                },
              });
            break;
            case "farmer register success":
              setInitialRouteName("บัญชีของฉัน")
            break;
            case "farmer register failed":
              setInitialRouteName("บัญชีของฉัน")
            break;
            case "farmer plot success" :
              setInitialRouteName("บัญชีของฉัน")
            break;
            case "farmer plot failed" :
              setInitialRouteName("บัญชีของฉัน")
            break;
          }
        }
        setLoading(false);
      }
    )
    messaging().onNotificationOpenedApp(async message => {
      console.log(message)
      const jumpAction = TabActions.jumpTo('บัญชีของฉัน');
      const type = message.notification?.body;
      switch (type){
        case "find droner success":
          console.log("find droner success")
          RootNavigation.navigate('Main', {
            screen: 'MyTaskDetailScreen',
            params : {
              task: "3dc03f2b-9f4d-4861-8124-f576fdac3834",
            }
          });
        break;
        case "find droner failed":
          RootNavigation.navigate('Main', {
            screen: 'SlipWaitingScreen',
            params: {
              taskId: message.data?.taskId
            },
          });
        break;
        case "farmer register success":
          navigation.dispatch(jumpAction);
        break;
        case "farmer register failed":
          navigation.dispatch(jumpAction);
        break;
        case "farmer plot success" :
          navigation.dispatch(jumpAction);
        break;
        case "farmer plot failed" :
          navigation.dispatch(jumpAction);
        break;
      }
    })

    messaging().onMessage(async message =>{
      const type = message.notification?.body;
      console.log(message)
      switch (type){
        case "find droner success":
          RootNavigation.navigate('Main', {
            screen: 'SlipSuccessScreen',
            params : {
              taskId: message.data?.taskId,
            }
          });
        break;
        case "find droner failed":
          RootNavigation.navigate('Main', {
            screen: 'SlipWaitingScreen',
            params: {
              taskId: message.data?.taskId
            },
          });
        break;
        case "farmer register success":
          setFarmerRegisterSuccess(true)
        break;
        case "farmer register failed":
          setFarmerRegisterFailed(true)
        break;
        case "farmer plot success" :
          setFarmerPlotSuccess(true)
        break;
        case "farmer plot failed" :
          setFarmerPlotFailed(true)
        break;
      }
    })
  },[])
  if(loading){
    return <></>
  }
  else{
    return (
      <>
        <FarmerRegisterSuccess
          show={farmerRegisterSuccess}
          onClose={()=>{
            setFarmerRegisterSuccess(false)
          }}
          onMainClick={()=>{
            setFarmerRegisterSuccess(false)
          }}
        />
        <FarmerRegisterFailed
          show={farmerRegisterFailed}
          onClose={()=>{
            setFarmerRegisterFailed(false)
          }}
          onMainClick={()=>{
            setFarmerRegisterFailed(false)
          }}
        />
        <FarmerPlotSuccess
          show={farmerPlotSuccess}
          onClose={()=>{
            setFarmerPlotSuccess(false)
          }}
          onMainClick={()=>{
            setFarmerPlotSuccess(false)
          }}
        />
        <FarmerPlotFailed
          show={farmerPlotFailed}
          onClose={()=>{
            setFarmerPlotFailed(false)
          }}
          onMainClick={()=>{
            setFarmerPlotFailed(false)
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
