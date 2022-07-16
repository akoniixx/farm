import React from "react"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from "../../screens/MainScreen/MainScreen";
import IncomeScreen from "../../screens/IncomeScreen/IncomScreen";
import TaskScreen from "../../screens/TaskScreen/TaskScreen";

const Tab = createBottomTabNavigator();

const MainTapNavigator:React.FC = () => {

    return (
      <Tab.Navigator>
      <Tab.Screen name="MainScreen" component={MainScreen} />
      <Tab.Screen name="TaskScreen" component={TaskScreen} />
      <Tab.Screen name="IncomeScreen" component={IncomeScreen} />
    </Tab.Navigator>
    )
}

export default MainTapNavigator