import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import PinScreen from '../screens/PinScreen/PinScreen';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
import ConditionScreen from '../screens/RegisterScreen/ConditionScreen';
import TelNumberScreen from '../screens/RegisterScreen/TelNumberScreen';
// import FirstFormScreen from '../screens/RegisterScreen/FirstFormScreen';
import FirstFormScreenV2 from '../screens/RegisterScreen/FirstFromScreenV2';
// import SecondFormScreen from '../screens/RegisterScreen/SecondFormScreen';
// import ThirdFormScreen from '../screens/RegisterScreen/ThirdFormScreen';
// import FourthFormScreen from '../screens/RegisterScreen/FourthFormScreen';
import AddIDcardScreen from '../screens/RegisterScreen/AddIDcardScreen';
import SuccessRegister from '../screens/RegisterScreen/SuccessRegister';
import DeleteSuccess from '../screens/ProfileScreen/DeleteProfile/DeleteSuccess';
import SecondFormScreenV2 from '../screens/RegisterScreen/SecondFromScreenV2';
import CameraScreen from '../screens/CameraScreen';

const Stack = createStackNavigator();

const AppAuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="PinScreen" component={PinScreen} />
      <Stack.Screen name="ConditionScreen" component={ConditionScreen} />
      <Stack.Screen name="TelNumberScreen" component={TelNumberScreen} />
      {/* <Stack.Screen name="FirstFormScreen" component={FirstFormScreen} /> */}
      {/* <Stack.Screen name="SecondFormScreen" component={SecondFormScreen} /> */}
      {/* <Stack.Screen name="ThirdFormScreen" component={ThirdFormScreen} />
    <Stack.Screen name="FourthFormScreen" component={FourthFormScreen} /> */}
      <Stack.Screen name="FirstFormScreenV2" component={FirstFormScreenV2} />
      <Stack.Screen name="SecondFormScreenV2" component={SecondFormScreenV2} />
      <Stack.Screen name="AddIDCardScreen" component={AddIDcardScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessRegister} />
      <Stack.Screen name="DeleteSuccess" component={DeleteSuccess} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
    </Stack.Navigator>
  );
};

export default AppAuthNavigator;
