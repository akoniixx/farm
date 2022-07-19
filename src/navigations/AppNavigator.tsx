import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen/HomeScreen'
import AppAuthNavigator from './AppAuthNavigator';
import MainNavigator from './MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator()

const AppNavigator: React.FC = () => {
  const [isSignedIn,setIsSignedIn] = useState<boolean>(false);
  useEffect(()=>{
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@token')
        if(value !== null) {
         setIsSignedIn(true)
        }
      } catch(e) {
       console.log(e,'get async token')
      }
    }
  },[])
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="Auth" component={AppAuthNavigator} />
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  )
}

export default AppNavigator