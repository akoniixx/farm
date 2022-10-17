import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from '../../screens/MainScreen/MainScreen';
import IncomeScreen from '../../screens/IncomeScreen';
import TaskScreen from '../../screens/MainTaskScreen/MainTaskScreen';

import {colors, font, icons} from '../../assets';
import {Text} from '@rneui/base';
import fonts from '../../assets/fonts';
import {normalize} from '@rneui/themed';
import {Image, TouchableOpacity, View} from 'react-native';
import MainTaskScreen from '../../screens/MainTaskScreen/MainTaskScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

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
      activeIcon: '',
      inactiveIcon: '',
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
                minHeight: 60,
              },
              tabBarButton(props) {
                const isFocused = props.accessibilityState?.selected;
                return (
                  <TouchableOpacity
                    {...props}
                    style={[props?.style, {padding: 8}]}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      {item.name === 'profile' ? (
                        <>
                          {isFocused ? (
                            <Icon
                              name={'user'}
                              color={colors.orange}
                              size={20}
                            />
                          ) : (
                            <Icon name={'user-o'} color={'#9BA1A8'} size={18} />
                          )}
                        </>
                      ) : (
                        <Image
                          source={
                            isFocused ? item.activeIcon : item.inactiveIcon
                          }
                          style={{width: 20, height: 20}}
                        />
                      )}
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: normalize(14),
                          color: isFocused ? colors.orange : colors.gray,
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
