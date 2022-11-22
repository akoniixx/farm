import React, {useContext, useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from '../../screens/MainScreen/MainScreen';
import {colors, font, icons} from '../../assets';
import {Text} from '@rneui/base';
import fonts from '../../assets/fonts';
import {normalize} from '@rneui/themed';
import {
  Image,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {TabActions} from '@react-navigation/native';

import Toast from 'react-native-toast-message';
import { SheetManager } from 'react-native-actions-sheet';

const Tab = createBottomTabNavigator();

const MainTapNavigator: React.FC<any> = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [registerNoti, setRegisterNoti] = useState(false);
  const [registerfailedModalNoti, setRegisterFailedModalNoti] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState('home');
  const ListPath = [
    {
      name: 'home',
      title: 'หน้าหลัก',
      component: MainScreen,
      activeIcon: icons.home,
      inactiveIcon: icons.home,
    },
    {
      name: 'myTask',
      title: 'โปรโมชั่น',
      component: MainScreen,
      activeIcon: icons.discount,
      inactiveIcon: icons.discount,
    },
    {
      name: 'profile',
      title: 'โปรไฟล์',
      component: MainScreen,
      activeIcon: icons.profile,
      inactiveIcon: icons.profile,
    },
  ];


  if (loading) {
    return <></>;
  }
  return (
    <>
    {/* <RegisterNotification value={registerNoti} onClick={()=>{
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
      dialCall()
    }} 
    onClose={()=>{
      setRegisterFailedModalNoti(false)
    }}/> */}
      <Tab.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={initialRouteName}>
        {ListPath.map((item, index) => {
          return (
            <Tab.Screen
              key={index}
              name={item.name}
              component={item.component}
              options={{
                tabBarLabelStyle: {
                  fontFamily: font.SarabunLight,
                },
                tabBarStyle: {
                  minHeight: Platform.OS === 'ios' ? 95 : 80,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                lazy: true,
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
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={
                            isFocused ? item.activeIcon : item.inactiveIcon
                          }
                          style={
                            item.name === 'profile'
                              ? {width: 16, height: 20, marginTop: 3.5}
                              : {width: 25, height: 25}
                          }
                        />

                        <Text
                          style={{
                            fontFamily: fonts.SarabunLight,
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

export default MainTapNavigator;
