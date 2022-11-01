import {normalize} from '@rneui/themed';
import React, { useEffect, useRef, useState } from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font} from '../../assets';
import MainTaskTapNavigator from '../../navigations/topTabs/MainTaskTapNavigator';
import {stylesCentral} from '../../styles/StylesCentral';
import messaging from '@react-native-firebase/messaging';
import RegisterNotification from '../../components/Modal/RegisterNotification';

const MainTaskScreen: React.FC<any> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const twiceNoti = useRef(1);
  const [openNoti,setOpenNoti] = useState(false)
  // useEffect(()=>{
  //   messaging().onNotificationOpenedApp(async message =>{
  //     if(message.notification?.body === "register complete"){
  //       console.log(twiceNoti.current )
  //       if(twiceNoti.current === 1){
  //         console.log("OPEN APP WITHOUT EXIT from main taskscreen")
  //         setOpenNoti(true)
  //         twiceNoti.current = 2;
  //       }
  //       else{
  //         twiceNoti.current = 1
  //       }
  //     }
  //   })
  //   messaging().onMessage(async message =>{
  //     if(message.notification?.body === "register complete"){
  //       if(twiceNoti.current === 1){
  //         console.log("REALTIME NOTI")
  //         setOpenNoti(true)
  //         twiceNoti.current = 2;
  //       }
  //       else{
  //         twiceNoti.current = 1
  //       }
  //     }
  //   })
  // },[])
  return (
    <View style={[stylesCentral.container, {paddingTop: insets.top}]}>
      <RegisterNotification value={openNoti} onClick={()=>{
        setOpenNoti(false)
        navigation.navigate('ProfileScreen', {
          navbar: false,
        });
      }}/>
      <View
        style={{
          alignItems: 'center',
          paddingVertical: normalize(20),
          backgroundColor: colors.white,
        }}>
        <Text
          style={{
            fontFamily: font.bold,
            fontSize: normalize(19),
            color: colors.fontBlack,
          }}>
          งานของฉัน
        </Text>
      </View>
      <MainTaskTapNavigator />
    </View>
  );
};
export default MainTaskScreen;
