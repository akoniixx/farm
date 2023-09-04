import React from 'react';
import { Image, StyleSheet, Platform } from 'react-native';
import { colors, font } from '../../assets';
import icons from '../../assets/icons/icons';
import { normalize } from '../../functions/Normalize';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import fonts from '../../assets/fonts';
import AuthMainScreen from '../AuthMainScreen/AuthMainScreen';
import AuthProfileScreen from '../AuthProfileScreen/AuthProfileScreen';
import AuthPromotionScreen from '../AuthPromotionScreen/AuthPromotionScreen';
import Text from '../../components/Text/Text';

const Tab = createBottomTabNavigator();
const HomeScreen: React.FC<any> = ({ navigation, route }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: normalize(80), borderBottomColor: colors.white },
      }}>
      <Tab.Screen
        name="หน้าแรก"
        component={AuthMainScreen}
        options={{
          tabBarStyle: {
            minHeight: Platform.OS === 'ios' ? 95 : 80,
            alignItems: 'center',
            justifyContent: 'center',
          },
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
                style={{ width: 20, height: 21 }}
              />
            ) : (
              <Image source={icons.home} style={{ width: 20, height: 21 }} />
            ),
        }}
      />
      <Tab.Screen
        name="โปรโมชั่น"
        component={AuthPromotionScreen}
        options={{
          tabBarStyle: {
            minHeight: Platform.OS === 'ios' ? 95 : 80,
            alignItems: 'center',
            justifyContent: 'center',
          },
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
        component={AuthProfileScreen}
        options={{
          tabBarStyle: {
            minHeight: Platform.OS === 'ios' ? 95 : 80,
            alignItems: 'center',
            justifyContent: 'center',
          },
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
