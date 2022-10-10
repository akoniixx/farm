import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from '../../screens/MainScreen/MainScreen';
import IncomeScreen from '../../screens/IncomeScreen/IncomScreen';
import TaskScreen from '../../screens/MainTaskScreen/MainTaskScreen';
import fontistoIcon from 'react-native-vector-icons/Foundation';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {colors, font, icons} from '../../assets';
import {Text} from '@rneui/base';
import fonts from '../../assets/fonts';
import {normalize} from '@rneui/themed';
import { Image } from 'react-native';
import MainTaskScreen from '../../screens/MainTaskScreen/MainTaskScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import Icon from 'react-native-vector-icons/FontAwesome'

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
          lazy:true,
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
          tabBarIcon:(i)=> i.focused?(
            <Image source={icons.home_active} style={{width:20,height:20}} />
          ):
          ( <Image source={icons.home} style={{width:20,height:20}} />)
        }}
      />
      <Tab.Screen
        name="งานของฉัน"
        component={MainTaskScreen}
        options={{
          tabBarLabelStyle: {
            fontFamily: font.medium,
          },
          lazy:true,
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
          tabBarIcon:(i)=> i.focused?(
            <Image source={icons.task_active} style={{width:20,height:20}} />
          ):
          ( <Image source={icons.task} style={{width:20,height:20}} />)
        }}
      />
      <Tab.Screen
        name="โปรไฟล์"
        component={ProfileScreen}
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
              โปรไฟล์
            </Text>
          ),
          tabBarIcon:(i)=> i.focused?(
            <Icon name={'user'} color={ colors.orange} size={20}  />
          ):
          ( <Icon name={'user-o'} color={'#9BA1A8'} size={20}  />)
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTapNavigator;
