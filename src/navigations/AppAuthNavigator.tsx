import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import ConditionScreen from '../screens/RegisterScreen/ConditionScreen';
import TelNumScreen from '../screens/RegisterScreen/TelNumberScreen';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
import MainScreen from '../screens/MainScreen/MainScreen';
import FirstFormScreen from '../screens/RegisterScreen/FirstFormScreen';
import SecondFormScreen from '../screens/RegisterScreen/SecondFormScreen';
import ThirdFormScreen from '../screens/RegisterScreen/ThirdFormScreen';
import SuccessRegister from '../screens/RegisterScreen/SuccessScreen';
import AddPlotScreen from '../screens/RegisterScreen/AddPlotScreen';



const Stack = createStackNavigator();

const AppAuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ConditionScreen" component={ConditionScreen} />
      <Stack.Screen name="TelNumScreen" component={TelNumScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="MainScreen" component={MainScreen} />
      <Stack.Screen name="FirstFormScreen" component={FirstFormScreen} />
      <Stack.Screen name="SecondFormScreen" component={SecondFormScreen} />
      <Stack.Screen name="ThirdFormScreen" component={ThirdFormScreen} />
      <Stack.Screen name="SuccessRegister" component={SuccessRegister} />
      <Stack.Screen name="AddPlotScreen" component={AddPlotScreen} />



    </Stack.Navigator>
  );
};

export default AppAuthNavigator;
