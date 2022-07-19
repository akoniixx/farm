import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from '../../screens/MainScreen/MainScreen';
import IncomeScreen from '../../screens/IncomeScreen/IncomScreen';
import TaskScreen from '../../screens/TaskScreen/TaskScreen';
import fontistoIcon from 'react-native-vector-icons/Foundation';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {colors, font} from '../../assets';
import {Text} from '@rneui/base';
import fonts from '../../assets/fonts';
import {normalize} from '@rneui/themed';

const Tab = createBottomTabNavigator();

const MainTapNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="หน้าหลัก"
        component={MainScreen}
        options={{
          tabBarLabelStyle: {
            fontFamily: font.medium,
          },
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: normalize(14),
                color: focused ? colors.orange : colors.gray,
              }}>
              หน้าหลัก
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="งานของฉัน"
        component={TaskScreen}
        options={{
          tabBarLabelStyle: {
            fontFamily: font.medium,
          },
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: normalize(14),
                color: focused ? colors.orange : colors.gray,
              }}>
              งานของฉัน
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="รายได้"
        component={IncomeScreen}
        options={{
          tabBarLabelStyle: {
            fontFamily: font.medium,
          },
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: normalize(14),
                color: focused ? colors.orange : colors.gray,
              }}>
              รายได้
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTapNavigator;
