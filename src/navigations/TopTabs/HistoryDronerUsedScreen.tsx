import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AllDronerUsed from '../../screens/MainScreen/AllDronerUsed';
import FavDronerUsed from '../../screens/MainScreen/FavDronerUsed';
import { colors, font } from '../../assets';
import { color } from 'react-native-reanimated';
import { normalize } from '../../functions/Normalize';

const Tab = createMaterialTopTabNavigator();

const TabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.greenLight,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          height: normalize(56),
        },
        tabBarLabelStyle: {
          textAlign: 'center',
          fontSize: 18,
          color: colors.fontBlack,
          fontFamily: font.AnuphanBold
        },
        tabBarIndicatorStyle: {
          borderBottomColor:colors.greenLight,
          borderBottomWidth: 2,
        },
      }}>
      <Tab.Screen
        name="ทั้งหมด"
        component={AllDronerUsed}
        options={{
          tabBarLabel: 'ทั้งหมด',
        }}  />
      <Tab.Screen
        name="นักบินที่ถูกใจ"
        component={FavDronerUsed}
        options={{
          tabBarLabel: 'นักบินที่ถูกใจ',
        }} />
    </Tab.Navigator>
  );
}
export default TabStack