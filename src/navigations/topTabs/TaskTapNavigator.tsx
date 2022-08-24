import { normalize } from "@rneui/themed";
import React from "react"
import { useState } from 'react';
import { View, useWindowDimensions, Text, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import fonts from "../../assets/fonts";
// import font from "../../../android/app/build/intermediates/assets/debug/mergeDebugAssets/fonts/font";
import { colors } from '../../assets';
import NewTaskScreen from "../../screens/MainScreen/NewTaskScreen";
import TaskScreen from "../../screens/MainScreen/TaskScreen";

const renderTabBar = (props:any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor:colors.orange }}
    style={{ backgroundColor: colors.white }}
    renderLabel={({ route, focused, color }) => (
      <Text style={[styles.label,{color: focused ? colors.orange : colors.gray }]}>
        {route.title}
      </Text>
    )}
  />
);




const renderScene = SceneMap({
  task: TaskScreen,
  newTask: NewTaskScreen,
});

const TaskTapNavigator:React.FC =()=> {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'task', title: 'งานที่ต้องทำ' },
    { key: 'newTask', title: 'งานใหม่สำหรับคุณ' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

export default TaskTapNavigator

const styles = StyleSheet.create({
  label:{
    fontFamily:fonts.bold,
    fontSize:normalize(16)
  }
});