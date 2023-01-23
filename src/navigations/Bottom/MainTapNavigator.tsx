import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from '../../screens/MainScreen/MainScreen';
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

const Tab = createBottomTabNavigator();

const MainTapNavigator: React.FC = () => {
  return (
    <Tab.Navigator
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
                bottom: normalize(6),
              }}>
              หน้าแรก
            </Text>
          ),
          tabBarIcon: i =>
            i.focused ? (
              <Image
                source={icons.home_active}
                style={{ width: 20, height: 20 }}
              />
            ) : (
              <Image source={icons.home} style={{ width: 20, height: 20 }} />
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
                bottom: normalize(6),
              }}>
              งานของฉัน
            </Text>
          ),
          tabBarIcon: i =>
            i.focused ? (
              <Image
                source={icons.mytask_active}
                style={{ width: 19, height: 22 }}
              />
            ) : (
              <Image source={icons.mytask} style={{ width: 19, height: 22 }} />
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
                bottom: normalize(6),
              }}>
              โปรโมชั่น
            </Text>
          ),
          tabBarIcon: i =>
            i.focused ? (
              <Image
                source={icons.discount_active}
                style={{ width: 20, height: 20 }}
              />
            ) : (
              <Image
                source={icons.discount}
                style={{ width: 20, height: 20 }}
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
                bottom: normalize(6),
              }}>
              บัญชีของฉัน
            </Text>
          ),
          tabBarIcon: i =>
            i.focused ? (
              <Image
                source={icons.profile_active}
                style={{ width: 16, height: 20 }}
              />
            ) : (
              <Image source={icons.profile} style={{ width: 14, height: 18 }} />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTapNavigator;
