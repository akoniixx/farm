import React, { useContext, useEffect, useState } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from '../../screens/MainScreen/MainScreen';
import messaging from '@react-native-firebase/messaging';
import {colors, font, icons} from '../../assets';
import {Text} from '@rneui/base';
import fonts from '../../assets/fonts';
import {normalize} from '@rneui/themed';
import { Image, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import MainTaskScreen from '../../screens/MainTaskScreen/MainTaskScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import RegisterNotification from '../../components/Modal/RegisterNotification';
import { TabActions } from '@react-navigation/native';
import RegisterFailedNotification from '../../components/Modal/RegisterFailedNotification';
import RegisterFailedModal from '../../components/Modal/RegisterFailedModalNotification';
import Toast from 'react-native-toast-message';
import { responsiveHeigth, responsiveWidth } from '../../function/responsive';
import IncomeScreen from '../../screens/IncomeScreen';
import * as RootNavigation from '../../navigations/RootNavigation';
import { SheetManager } from 'react-native-actions-sheet';
import { ActionContext } from '../../../App';

const Tab = createBottomTabNavigator();

const MainTapNavigator: React.FC<any> = ({navigation}) => {
  const [loading,setLoading] = useState(true)
  const [registerNoti,setRegisterNoti] = useState(false)
  const [registerfailedModalNoti,setRegisterFailedModalNoti] = useState(false)
  const [initialRouteName,setInitialRouteName] = useState('home')
  const {actiontaskId,setActiontaskId} = useContext(ActionContext)
  const ListPath = [
    {
      name: 'home',
      title: 'หน้าหลัก',
      component: MainScreen,
      activeIcon: icons.home_active,
      inactiveIcon: icons.home,
    },
    {
      name: 'myTask',
      title: 'งานของฉัน',
      component: MainTaskScreen,
      activeIcon: icons.task_active,
      inactiveIcon: icons.task,
    },
    {
      name: 'Income',
      title: 'รายได้',
      component: IncomeScreen,
      activeIcon: icons.pocket_active,
      inactiveIcon: icons.pocket,
    },
    {
      name: 'profile',
      title: 'โปรไฟล์',
      component: ProfileScreen,
      activeIcon: icons.profileActive,
      inactiveIcon: icons.profile,
    },
  ];


  useEffect(()=>{
    messaging().getInitialNotification().then(
      message =>{
        // console.log(message)
        if(message){
          if(message.data?.type === "APPROVE_DRONER_SUCCESS"){
            setInitialRouteName("profile")
            setRegisterNoti(true)
          }
          else if(message.data?.type === "APPROVE_DRONER_FAIL"){
            setInitialRouteName("profile")
            setRegisterFailedModalNoti(true)
          }
          else if(message.data?.type === "APPROVE_DRONER_DRONE_FAIL"){
            setInitialRouteName("profile")
          }
          else if(message.data?.type === "APPROVE_ADDITION_DRONER_DRONE_SUCCESS"){
            setInitialRouteName("profile")
          }
          else if(message.data?.type === "APPROVE_ADDITION_DRONER_DRONE_FAIL"){
            setInitialRouteName("profile")
          }
          else if(message.data?.type === "NEW_TASK"){
            RootNavigation.navigate('Main', {
              screen: 'TaskDetailScreen',
              params: {taskId: message.data?.taskId},
            })
          }
          else if(message.data?.type === "FIRST_REMIND"){
            RootNavigation.navigate('Main', {
              screen: 'TaskDetailScreen',
              params: {taskId: message.data?.taskId},
            })
          }
          else if(message.data?.type === "SECOND_REMIND"){
            RootNavigation.navigate('Main', {
              screen: 'TaskDetailScreen',
              params: {taskId: message.data?.taskId},
            })
          }
          else if(message.data?.type === "THIRD_REMIND"){
            RootNavigation.navigate('Main', {
              screen: 'TaskDetailScreen',
              params: {taskId: message.data?.taskId},
            })
          }
          else if(message.data?.type === "FORTH_REMIND"){
            RootNavigation.navigate('Main', {
              screen: 'TaskDetailScreen',
              params: {taskId: message.data?.taskId},
            })
          }
          else if(message.data?.type === "DONE_TASK_REMIND"){
            RootNavigation.navigate('Main', {
              screen: 'TaskDetailScreen',
              params: {taskId: message.data?.taskId},
            })
          }
        }
        setLoading(false)
      }
    )
    messaging().onNotificationOpenedApp(async message =>{
      // console.log(message)
      if(message.data?.type === "APPROVE_DRONER_SUCCESS"){
        setRegisterNoti(true)
      }
      else if(message.data?.type === "APPROVE_DRONER_FAIL"){
        setRegisterFailedModalNoti(true)
      }
      else if(message.data?.type === "APPROVE_DRONER_DRONE_FAIL"){
        const jumpAction = TabActions.jumpTo('profile');
        navigation.dispatch(jumpAction)
      }
      else if(message.data?.type === "APPROVE_ADDITION_DRONER_DRONE_SUCCESS"){
        const jumpAction = TabActions.jumpTo('profile');
        navigation.dispatch(jumpAction)
      }
      else if(message.data?.type === "APPROVE_ADDITION_DRONER_DRONE_FAIL"){
        const jumpAction = TabActions.jumpTo('profile');
        navigation.dispatch(jumpAction)
      }
      else if(message.data?.type === "NEW_TASK"){
        SheetManager.hide('NewTaskSheet');
        RootNavigation.navigate('Main', {
          screen: 'TaskDetailScreen',
          params: {taskId: message.data?.taskId},
        })
      }
      else if(message.data?.type === "FIRST_REMIND"){
        RootNavigation.navigate('Main', {
          screen: 'TaskDetailScreen',
          params: {taskId: message.data?.taskId},
        })
      }
      else if(message.data?.type === "SECOND_REMIND"){
        RootNavigation.navigate('Main', {
          screen: 'TaskDetailScreen',
          params: {taskId: message.data?.taskId},
        })
      }
      else if(message.data?.type === "THIRD_REMIND"){
        RootNavigation.navigate('Main', {
          screen: 'TaskDetailScreen',
          params: {taskId: message.data?.taskId},
        })
      }
      else if(message.data?.type === "FORTH_REMIND"){
        RootNavigation.navigate('Main', {
          screen: 'TaskDetailScreen',
          params: {taskId: message.data?.taskId},
        })
      }
      else if(message.data?.type === "DONE_TASK_REMIND"){
        RootNavigation.navigate('Main', {
          screen: 'TaskDetailScreen',
          params: {taskId: message.data?.taskId},
        })
      }
    })

    messaging().onMessage(async message =>{
      console.log(message)
      if(message.data?.type === "APPROVE_DRONER_SUCCESS"){
        setRegisterNoti(true)
      }
      else if(message.data?.type === "APPROVE_DRONER_FAIL"){
        Toast.show({
          type : 'registerFailed',
          topOffset : 10,
          position : 'top',
          onPress() {
            const jumpAction = TabActions.jumpTo('profile');
            navigation.dispatch(jumpAction)
            Toast.hide()
          },
        });
      }
      else if(message.notification?.body === "APPROVE_DRONER_DRONE_FAIL"){
        Toast.show({
          type : 'droneFirstTimeFailed',
          topOffset : 10,
          position : 'top',
          onPress() {
            const jumpAction = TabActions.jumpTo('profile');
            navigation.dispatch(jumpAction)
            Toast.hide()
          },
        });
      }
      else if(message.data?.type === "APPROVE_ADDITION_DRONER_DRONE_SUCCESS"){
        Toast.show({
          type : 'droneSuccess',
          topOffset : 10,
          text1 : message.data?.message.split(" ")[2],
          position : 'top',
          onPress() {
            const jumpAction = TabActions.jumpTo('profile');
            navigation.dispatch(jumpAction)
            Toast.hide()
          },
        });
      }
      else if(message.data?.type === "APPROVE_ADDITION_DRONER_DRONE_FAIL"){
        Toast.show({
          type : 'droneFailed',
          text1 : message.data?.message.split(" ")[2],
          topOffset : 10,
          position : 'top',
          onPress() {
            const jumpAction = TabActions.jumpTo('profile');
            navigation.dispatch(jumpAction)
            Toast.hide()
          },
        });
      }
      else if(message.data?.type === "RECEIVE_TASK_FAIL"){
        setActiontaskId(message.data?.taskId)
        Toast.show({
          type : 'taskFailed',
          topOffset : 10,
          text1 : `${message.data?.taskNo}`,
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.data?.type === "FIRST_REMIND"){
        Toast.show({
          type : 'taskWarningContactFarmer',
          topOffset : 10,
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.data?.type === "SECOND_REMIND"){
        const date = message.data?.dateAppointment.split("T")
        Toast.show({
          type : 'taskWarningContactFarmerTowmorow',
          topOffset : 10,
          position : 'top',
          text1 : `วันที่ ${date[0].split("-")[2]}/${date[0].split("-")[1]}/${parseInt(date[0].split("-")[0])+543} เวลา ${(parseInt(date[1].split(":")[0])+7)>9?`0${parseInt(date[1].split(":")[0])+7}`:parseInt(date[1].split(":")[0])+7}.${parseInt(date[1].split(":")[1])}น.`,
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.data?.type === "THIRD_REMIND"){
        Toast.show({
          type : 'taskWarningBeforeOneHours',
          topOffset : 10,
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.data?.type === "FORTH_REMIND"){
        Toast.show({
          type : 'taskWarningStartJob',
          topOffset : 10,
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.data?.type === "DONE_TASK_REMIND"){
        Toast.show({
          type : 'taskWarningJobSuccess',
          topOffset : 10,
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.data?.type === "FORCE_SELECT_DRONER"){
        const date = message.data?.dateAppointment.split("T")
        Toast.show({
          type : 'taskJobSuccess',
          topOffset : 10,
          text1 : `#${message.data?.taskNo}`,
          text2 : `วันที่ ${date[0].split("-")[2]}/${date[0].split("-")[1]}/${parseInt(date[0].split("-")[0])+543} เวลา ${(parseInt(date[1].split(":")[0])+7)>9?`0${parseInt(date[1].split(":")[0])+7}`:parseInt(date[1].split(":")[0])+7}.${parseInt(date[1].split(":")[1])}น.`,
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
    })
  },[])

  if(loading){
    return <></>
  }
  return (
    <>
    <RegisterNotification value={registerNoti} onClick={()=>{
      setRegisterNoti(false);
      setInitialRouteName("home")
      const jumpAction = TabActions.jumpTo('profile');
      navigation.dispatch(jumpAction)
    }}
    onClose={()=>{
      setRegisterNoti(false);
    }}
    />
    <RegisterFailedModal value={registerfailedModalNoti} 
    onClick={()=>{
      setRegisterFailedModalNoti(false)
      setInitialRouteName("home")
      const jumpAction = TabActions.jumpTo('profile');
      navigation.dispatch(jumpAction)
    }} 
    onClose={()=>{
      setRegisterFailedModalNoti(false)
    }}/>

    <Tab.Navigator screenOptions={{headerShown: false}} initialRouteName={initialRouteName}>
      {ListPath.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.name}
            component={item.component}
            options={{
              tabBarLabelStyle: {
                fontFamily: font.medium,
              },
              tabBarStyle: {
                minHeight: Platform.OS === 'ios' ? 95 : 80,
                alignItems: 'center',
                justifyContent: 'center',
              },
              lazy:true,
              tabBarButton(props) {
                const isFocused = props.accessibilityState?.selected;
                return (
                  <TouchableOpacity
                    {...props}
                    style={[
                      props?.style,
                      {
                        padding: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Image
                        source={isFocused ? item.activeIcon : item.inactiveIcon}
                        style={
                          item.name === 'profile'
                            ? {width: 16, height: 20, marginTop: 3.5}
                            : {width: 25, height: 25}
                        }
                      />

                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: normalize(14),
                          color: isFocused ? colors.orange : colors.gray,
                          marginTop: item.name === 'profile' ? 4 : 2,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              },
            }}
          />
        );
      })}
    </Tab.Navigator>
    
    </>
  );
};

const styles = StyleSheet.create({
  modal : {
      width : '100%',
      height : Platform.OS === 'ios'? responsiveHeigth(170):responsiveWidth(100),
      justifyContent : 'center',
      alignItems : 'center'
  },
})

export default MainTapNavigator;
