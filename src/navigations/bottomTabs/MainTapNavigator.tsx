import React, { useEffect, useState } from 'react';
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

const Tab = createBottomTabNavigator();

const MainTapNavigator: React.FC<any> = ({navigation}) => {
  const [loading,setLoading] = useState(true)
  const [registerNoti,setRegisterNoti] = useState(false)
  const [registerfailedNoti,setRegisterFailedNoti] = useState(false)
  const [registerfailedModalNoti,setRegisterFailedModalNoti] = useState(false)
  const [initialRouteName,setInitialRouteName] = useState('หน้าหลัก')

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
        if(message){
          if(message.notification?.body === "register complete"){
            setInitialRouteName("โปรไฟล์")
            setRegisterNoti(true)
          }
          else if(message.notification?.body === "register incomplete"){
            setInitialRouteName("โปรไฟล์")
            setRegisterFailedModalNoti(true)
          }
          else if(message.notification?.body === "drone firsttime failed"){
            setInitialRouteName("โปรไฟล์")
          }
          else if(message.notification?.body === "drone success"){
            setInitialRouteName("โปรไฟล์")
          }
          else if(message.notification?.body === "drone failed"){
            setInitialRouteName("โปรไฟล์")
          }
        }
        setLoading(false)
      }
    )
    messaging().onNotificationOpenedApp(async message =>{
      if(message.notification?.body === "register complete"){
        setRegisterNoti(true)
      }
      else if(message.notification?.body === "register incomplete"){
        setRegisterFailedModalNoti(true)
      }
      else if(message.notification?.body === "drone firsttime failed"){
        const jumpAction = TabActions.jumpTo('โปรไฟล์');
        navigation.dispatch(jumpAction)
      }
      else if(message.notification?.body === "drone success"){
        const jumpAction = TabActions.jumpTo('โปรไฟล์');
        navigation.dispatch(jumpAction)
      }
      else if(message.notification?.body === "drone failed"){
        const jumpAction = TabActions.jumpTo('โปรไฟล์');
        navigation.dispatch(jumpAction)
      }
    })

    messaging().onMessage(async message =>{
      if(message.notification?.body === "register complete"){
        setRegisterNoti(true)
      }
      else if(message.notification?.body === "register incomplete"){
        Toast.show({
          type : 'registerFailed',
          topOffset : 10,
          position : 'top',
          onPress() {
            const jumpAction = TabActions.jumpTo('โปรไฟล์');
            navigation.dispatch(jumpAction)
            Toast.hide()
          },
        });
      }
      else if(message.notification?.body === "drone firsttime failed"){
        Toast.show({
          type : 'droneFirstTimeFailed',
          topOffset : 10,
          position : 'top',
          onPress() {
            const jumpAction = TabActions.jumpTo('โปรไฟล์');
            navigation.dispatch(jumpAction)
            Toast.hide()
          },
        });
      }
      else if(message.notification?.body === "drone success"){
        Toast.show({
          type : 'droneSuccess',
          topOffset : 10,
          text1 : '123456789',
          position : 'top',
          onPress() {
            const jumpAction = TabActions.jumpTo('โปรไฟล์');
            navigation.dispatch(jumpAction)
            Toast.hide()
          },
        });
      }
      else if(message.notification?.body === "drone failed"){
        Toast.show({
          type : 'droneFailed',
          text1 : '123456789',
          topOffset : 10,
          position : 'top',
          onPress() {
            const jumpAction = TabActions.jumpTo('โปรไฟล์');
            navigation.dispatch(jumpAction)
            Toast.hide()
          },
        });
      }
      else if(message.notification?.body === "task receive success"){
        Toast.show({
          type : 'taskSuccess',
          topOffset : 10,
          text1 : '#TK20220518TH-0000001',
          text2 : 'วันที่ 25/10/2565 เวลา 00.00 น.',
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.notification?.body === "task receive failed"){
        Toast.show({
          type : 'taskFailed',
          topOffset : 10,
          text1 : '#TK20220518TH-0000001',
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.notification?.body === "task warning contact farmer"){
        Toast.show({
          type : 'taskWarningContactFarmer',
          topOffset : 10,
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.notification?.body === "task warning contact farmer towmorow"){
        Toast.show({
          type : 'taskWarningContactFarmerTowmorow',
          topOffset : 10,
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.notification?.body === "task warning before 1 hours"){
        Toast.show({
          type : 'taskWarningBeforeOneHours',
          topOffset : 10,
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.notification?.body === "task warning start job"){
        Toast.show({
          type : 'taskWarningStartJob',
          topOffset : 10,
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.notification?.body === "task warning job success"){
        Toast.show({
          type : 'taskWarningJobSuccess',
          topOffset : 10,
          position : 'top',
          onPress() {
            Toast.hide()
          },
        });
      }
      else if(message.notification?.body === "task success"){
        Toast.show({
          type : 'taskJobSuccess',
          topOffset : 10,
          text1 : '#TK20220518TH-0000001',
          text2 : 'วันที่ 25/10/2565 เวลา 00.00 น.',
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
      setInitialRouteName("หน้าหลัก")
      const jumpAction = TabActions.jumpTo('โปรไฟล์');
      navigation.dispatch(jumpAction)
    }}
    onClose={()=>{
      setRegisterNoti(false);
    }}
    />
    <RegisterFailedModal value={registerfailedModalNoti} 
    onClick={()=>{
      setRegisterFailedModalNoti(false)
      setInitialRouteName("หน้าหลัก")
      const jumpAction = TabActions.jumpTo('โปรไฟล์');
      navigation.dispatch(jumpAction)
    }} 
    onClose={()=>{
      setRegisterFailedModalNoti(false)
    }}/>

<Tab.Navigator screenOptions={{headerShown: false}}>
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
