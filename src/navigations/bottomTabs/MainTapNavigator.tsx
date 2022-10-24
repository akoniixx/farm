import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from '../../screens/MainScreen/MainScreen';
import IncomeScreen from '../../screens/IncomeScreen';
import TaskScreen from '../../screens/MainTaskScreen/MainTaskScreen';

import {colors, font, icons} from '../../assets';
import {Text} from '@rneui/base';
import fonts from '../../assets/fonts';
import {normalize} from '@rneui/themed';
import {Image, Platform, TouchableOpacity, View} from 'react-native';
import MainTaskScreen from '../../screens/MainTaskScreen/MainTaskScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTapNavigator: React.FC = () => {
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

  return (
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
  );
};

export default MainTapNavigator;
