import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from '../../screens/MainScreen/MainScreen';
import {colors, font, icons} from '../../assets';
import {Text} from '@rneui/base';
import fonts from '../../assets/fonts';
import {normalize} from '@rneui/themed';
import { Image } from 'react-native';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import PromotionScreen from '../../screens/PromotionScreen/PromotionScreen';

const Tab = createBottomTabNavigator();

const MainTapNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="หน้าแรก"
        component={MainScreen}
        options={{
          tabBarLabelStyle: {
            fontFamily: font.AnuphanMedium,
          },
          lazy:true,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                fontSize: normalize(14),
                color: focused ? colors.orange : colors.gray,
              }}>
              หน้าหลัก
            </Text>
          ),
          tabBarIcon:(i)=> i.focused?(
            <Image source={icons.home} style={{width:20,height:20}} />
          ):
          ( <Image source={icons.home} style={{width:20,height:20}} />)
        }}
      />
      <Tab.Screen
        name="โปรโมชั่น"
        component={PromotionScreen}
        options={{
          tabBarLabelStyle: {
            fontFamily: font.AnuphanMedium,
          },
          lazy:true,
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                fontSize: normalize(14),
                color: focused ? colors.orange : colors.gray,
              }}>
              งานของฉัน
            </Text>
          ),
          tabBarIcon:(i)=> i.focused?(
            <Image source={icons.discount} style={{width:20,height:20}} />
          ):
          ( <Image source={icons.discount} style={{width:20,height:20}} />)
        }}
      />
      <Tab.Screen
        name="บัญชีของฉัน"
        component={ProfileScreen}
        options={{
          tabBarLabelStyle: {
            fontFamily: font.AnuphanMedium,
          },
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                fontSize: normalize(14),
                color: focused ? colors.greenLight : colors.gray,
              }}>
              โปรไฟล์
            </Text>
          ),
          tabBarIcon:(i)=> i.focused?(
            <Image source={icons.profile} style={{width:20,height:20}} />
          ):
          ( <Image source={icons.profile} style={{width:20,height:20}} />)
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTapNavigator;
