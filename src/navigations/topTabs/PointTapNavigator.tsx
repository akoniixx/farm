import {normalize} from '@rneui/themed';
import React from 'react';
import {useState} from 'react';
import {View, useWindowDimensions, Text, StyleSheet} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import fonts from '../../assets/fonts';
import {colors} from '../../assets';

import {mixpanel} from '../../../mixpanel';
import UsedPointScreen from '../../screens/PointScreen/UsedPointScreen';
import PendingPointScreen from '../../screens/PointScreen/PendingPointScreen';

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{backgroundColor: colors.orange}}
    style={{backgroundColor: colors.white}}
    renderLabel={({route, focused, color}) => (
      <Text
        style={[styles.label, {color: focused ? colors.orange : colors.gray}]}>
        {route.title}
      </Text>
    )}
  />
);

/* interface Prop {
    isOpenReceiveTask: boolean;
    dronerStatus: string;
} */

const PointTapNavigator: React.FC<any> = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'pending', title: 'รอรับแต้ม'},
    {key: 'history', title: 'ได้รับ/ใช้แต้ม'},
  ]);
  const renderScene = ({route}: any) => {
    switch (route.key) {
      case 'pending':
        return <PendingPointScreen />;
      case 'history':
        return <UsedPointScreen />;
      default:
        return null;
    }
  };

  return (
    <TabView
      key={index}
      navigationState={{index, routes}}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      lazy
    />
  );
};

export default PointTapNavigator;

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.bold,
    fontSize: normalize(16),
  },
});
