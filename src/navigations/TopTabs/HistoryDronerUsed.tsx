import React, { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { colors } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize } from '../../functions/Normalize';
import FinishTaskScreen from '../../screens/MyTaskScreen/FinishTaskScreen';
import InprogressScreen from '../../screens/MyTaskScreen/InprogressScreen';
import AllDronerUsed from '../../screens/MainScreen/AllDronerUsed';
import FavDronerUsed from '../../screens/MainScreen/FavDronerUsed';

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: '#2EC46D' }}
    style={{ backgroundColor: colors.white }}
    renderLabel={({ route, focused, color }) => (
      <Text
        style={[styles.label, { color: focused ? '#1F8449' : colors.gray }]}>
        {route.title}
      </Text>
    )}
  />
);

const HistoryDronerUsed: React.FC<any> = ({}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'ทั้งหมด' },
    { key: 'fav', title: 'นักบินที่ถูกใจ' },
  ]);
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'all':
        return <AllDronerUsed />;
      case 'fav':
        return <FavDronerUsed />;
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
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy
    />
  );
};

export default HistoryDronerUsed;

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.AnuphanBold,
    fontWeight: '800',
    fontSize: normalize(18),
    lineHeight: 56,
    height: 56
  },
});
