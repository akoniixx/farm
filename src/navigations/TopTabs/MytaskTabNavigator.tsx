import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { colors } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize } from '../../functions/Normalize';
import FinishTaskScreen from '../../screens/MyTaskScreen/FinishTaskScreen';
import InprogressScreen from '../../screens/MyTaskScreen/InprogressScreen';
import Text from '../../components/Text/Text';
import { mixpanel } from '../../../mixpanel';

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: '#2EC46D' }}
    style={{ backgroundColor: colors.white, paddingVertical: 8 }}
    renderLabel={({ route, focused }) => (
      <Text
        style={[
          styles.label,
          { color: focused ? '#1F8449' : colors.gray, lineHeight: 30 },
        ]}>
        {route.title}
      </Text>
    )}
  />
);

// const renderScene = SceneMap({
//   task: TaskScreen,
//   newTask: NewTaskScreen,
// });

const MyTaskTapNavigator: React.FC<any> = ({}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'inprogress', title: 'กำลังดำเนินงาน' },
    { key: 'finish', title: 'งานเสร็จสิ้น' },
  ]);
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'inprogress':
        return <InprogressScreen />;
      case 'finish':
        return <FinishTaskScreen />;
      default:
        return null;
    }
  };

  return (
    <TabView
      key={index}
      navigationState={{ index, routes }}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={idx => {
        mixpanel.track('MyTaskScreen_TabViewOnIndexChange_tapped', {
          tab: routes[idx].title,
        });
        setIndex(idx);
      }}
      initialLayout={{ width: layout.width }}
      lazy
    />
  );
};

export default MyTaskTapNavigator;

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(20),
  },
});
