import { Switch } from '@rneui/themed';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font } from '../../assets';
import { stylesCentral } from '../../styles/StylesCentral';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from '@rneui/base';
import icons from '../../assets/icons/icons';
import { SheetManager } from 'react-native-actions-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { normalize, width } from '../../functions/Normalize';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import image from '../../assets/images/image';
import MainTapNavigator from '../../navigations/BottomTabs/MainTapNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from '../MainScreen/MainScreen';
import fonts from '../../assets/fonts';
import PromotionScreen from '../PromotionScreen/PromotionScreen';
import ProfileScreen from '../ProfileScreen/ProfileScreen';
import AuthMainScreen from '../AuthMainScreen/AuthMainScreen';

const Tab = createBottomTabNavigator();
const HomeScreen: React.FC<any> = ({ navigation, route }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: '9%', borderBottomColor: colors.white },
      }}>
      <Tab.Screen
        name="หน้าแรก"
        component={AuthMainScreen}
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
                style={{ width: 22, height: 22, top: normalize(3) }}
              />
            ) : (
              <Image
                source={icons.discount}
                style={{ width: 24, height: 24, top: normalize(3) }}
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
                style={{ width: 22, height: 22, top: normalize(3) }}
              />
            ) : (
              <Image
                source={icons.profile}
                style={{ width: 22, height: 22, top: normalize(3) }}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  btnContainer: {
    width: normalize(33),
    marginVertical: normalize(10),
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
});
