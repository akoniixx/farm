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
import HistoryDronerUsed from '../../navigations/TopTabs/HistoryDronerUsedScreen';
import { NavigationContainer } from '@react-navigation/native';
import TabStack from '../../navigations/TopTabs/HistoryDronerUsedScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const SeeAllDronerUsed: React.FC<any> = ({ navigation, route }) => {
  const Stack = createNativeStackNavigator();

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
      <Stack.Navigator
        screenOptions={{
          headerTintColor: colors.white,
        }}>
        <Stack.Screen
          name="ประวัติการจ้างนักบิน"
          component={TabStack}
          // options={{title: 'ประวัติการจ้างนักบิน' }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};
export default SeeAllDronerUsed;
