import { Avatar } from '@rneui/base/dist/Avatar/Avatar';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons, image } from '../../assets';
import { MainButton } from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import { height, normalize } from '../../functions/Normalize';
import { stylesCentral } from '../../styles/StylesCentral';
import { TaskSuggestion } from '../../datasource/TaskSuggestion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { initProfileState, profileReducer } from '../../hook/profilefield';
import fonts from '../../assets/fonts';
import CardReview from '../../components/Carousel/CardReview';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AllDronerUsed from '../MainScreen/AllDronerUsed';
import FavDronerUsed from '../MainScreen/FavDronerUsed';

const SeeAllDronerUsed: React.FC<any> = ({ navigation, route }) => {
  const Stack = createNativeStackNavigator();
  const Tab = createMaterialTopTabNavigator();

  const [selectDate, setSelectDate] = useState();
  const timeSelect = useRef<any>();
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [taskSugUsed, setTaskSugUsed] = useState<any[]>([]);
  const date = new Date().toLocaleDateString();

  useEffect(() => {
    getProfile();
    dronerSugUsed();
  }, []);

  const getProfile = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    ProfileDatasource.getProfile(farmer_id!).then(res => {
      dispatch({
        type: 'InitProfile',
        name: `${res.firstname} ${res.lastname}`,
        plotItem: res.farmerPlot,
      });
    });
  };
  const dronerSugUsed = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const limit = 0;
    const offset = 0;
    TaskSuggestion.DronerUsed(
      farmer_id !== null ? farmer_id : '',
      profilestate.plotItem[0].id,
      date,
      limit,
      offset,
    ).then(res => {
      setTaskSugUsed(res);
    });
  };
  return (
    <SafeAreaView style={[stylesCentral.container]}>
      <CustomHeader
        title="ประวัติการจ้างนักบิน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
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
            fontFamily: font.AnuphanBold,
          },
          tabBarIndicatorStyle: {
            borderBottomColor: colors.greenLight,
            borderBottomWidth: 2,
          },
        }}>
        <Tab.Screen
          name="ทั้งหมด"
          component={AllDronerUsed}
          options={{
            tabBarLabel: 'ทั้งหมด',
          }}
        />
        <Tab.Screen
          name="นักบินที่ถูกใจ"
          component={FavDronerUsed}
          options={{
            tabBarLabel: 'นักบินที่ถูกใจ',
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};
export default SeeAllDronerUsed;
