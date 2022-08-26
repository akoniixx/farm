import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen/HomeScreen'
import AppAuthNavigator from './AppAuthNavigator';
import MainNavigator from './MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingNavigator from './LoadingNavigator';

const Stack = createStackNavigator()

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="initPage" component={LoadingNavigator} />
        <Stack.Screen name="Auth" component={AppAuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />

    </Stack.Navigator>
  )
}

export default AppNavigator