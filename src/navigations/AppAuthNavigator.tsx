import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import ConditionScreen from '../screens/RegisterScreen/ConditionScreen';
import TelNumScreen from '../screens/RegisterScreen/TelNumberScreen';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
import SecondFormScreen from '../screens/RegisterScreen/SecondFormScreen';
import ThirdFormScreen from '../screens/RegisterScreen/ThirdFormScreen';
import SuccessRegister from '../screens/RegisterScreen/SuccessScreen';
import FourthFormScreen from '../screens/RegisterScreen/FourthFormScreen';
import AddIDcardScreen from '../screens/RegisterScreen/AddIDcardScreen';
import FirstFormScreen from '../screens/RegisterScreen/FirstFromScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import Onboarding from '../screens/Onboarding/Onboarding';
import DronerBooking from '../screens/DronerBooking/DronerBooking';
import MyPlotScreen from '../screens/MyPlotScreen/MyPlotScreen';
import EditFarmerPlot from '../screens/RegisterScreen/EditFarmerPlot';
import DeleteSuccess from '../screens/ProfileScreen/DeleteProfile/DeleteSuccess';
import PrivacyScreen from '../screens/ProfileScreen/PrivacyScreen';
import AllGuruScreen from '../screens/GuruScreen/AllGuruScreen';
import BeforeLoginScreen from '../screens/BeforeLoginScreen';
import CameraScreen from '../screens/CameraScreen';
import AddPlotScreen from '../screens/ProfileScreen/PlotScreen/AddPlotScreen';
import EditPlotScreen from '../screens/ProfileScreen/PlotScreen/EditPlotScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DetailGuruScreen from '../screens/GuruScreen/DetailGuruScreen';

const Stack = createStackNavigator();

const AppAuthNavigator: React.FC = () => {
  const [isOnboarding, setIsOnboarding] = React.useState<boolean>(true);
  useEffect(() => {
    const checkOnboarding = async () => {
      const onBoarding = await AsyncStorage.getItem('onBoarding');
      if (onBoarding) {
        setIsOnboarding(true);
      } else {
        setIsOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isOnboarding ? 'HomeScreen' : 'Onboarding'}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="BeforeLoginScreen" component={BeforeLoginScreen} />
      <Stack.Screen name="AllGuruScreen" component={AllGuruScreen} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ConditionScreen" component={ConditionScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="TelNumScreen" component={TelNumScreen} />
      <Stack.Screen name="FirstFormScreen" component={FirstFormScreen} />
      <Stack.Screen name="SecondFormScreen" component={SecondFormScreen} />
      <Stack.Screen name="ThirdFormScreen" component={ThirdFormScreen} />
      <Stack.Screen name="FourthFormScreen" component={FourthFormScreen} />
      <Stack.Screen name="AddIDCardScreen" component={AddIDcardScreen} />
      <Stack.Screen name="SuccessRegister" component={SuccessRegister} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="DronerBooking" component={DronerBooking} />
      <Stack.Screen name="MyPlotScreen" component={MyPlotScreen} />
      <Stack.Screen name="EditFarmerPlot" component={EditFarmerPlot} />
      <Stack.Screen name="DeleteSuccess" component={DeleteSuccess} />
      <Stack.Screen name="PrivacyScreen" component={PrivacyScreen} />
      <Stack.Screen name="DetailGuruScreen" component={DetailGuruScreen} />
      <Stack.Screen
        name="AddPlotScreen"
        component={AddPlotScreen}
        initialParams={{ fromRegister: true }}
      />
      <Stack.Screen
        name="EditPlotScreen"
        component={EditPlotScreen}
        initialParams={{
          plotId: '',
          fromRegister: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppAuthNavigator;
