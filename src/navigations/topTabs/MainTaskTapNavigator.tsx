import {normalize} from '@rneui/themed';
import React from 'react';
import {useState} from 'react';
import {useWindowDimensions, StyleSheet} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import fonts from '../../assets/fonts';
import {colors} from '../../assets';
import FinishTask from '../../screens/MainTaskScreen/FinishTask';
import WaitStartTask from '../../screens/MainTaskScreen/WaitStartTask';
import InprogressTask from '../../screens/MainTaskScreen/InprogressTask';
import Text from '../../components/Text';
import {mixpanel} from '../../../mixpanel';

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{backgroundColor: colors.orange}}
    style={{backgroundColor: colors.white}}
    renderLabel={({route, focused}) => (
      <Text
        style={[styles.label, {color: focused ? colors.orange : colors.gray}]}>
        {route.title}
      </Text>
    )}
  />
);

const renderScene = SceneMap({
  inprogress: InprogressTask,
  WaitStart: WaitStartTask,
  finish: FinishTask,
});

const MainTaskTapNavigator: React.FC = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'inprogress', title: 'กำลังดำเนินการ'},
    {key: 'WaitStart', title: 'รอเริ่มงาน'},
    {key: 'finish', title: 'งานเสร็จสิ้น'},
  ]);

  return (
    <TabView
      navigationState={{index, routes}}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={(index: number) => {
        mixpanel.track('MainTaskScreen_TabView_ChangeTab', {
          tab: routes[index].title,
        });
        setIndex(index);
      }}
      initialLayout={{width: layout.width}}
      lazy
    />
  );
};

export default MainTaskTapNavigator;

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.bold,
    fontSize: normalize(14),
  },
});
