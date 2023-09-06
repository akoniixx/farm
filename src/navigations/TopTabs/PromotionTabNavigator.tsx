import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { colors } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize } from '../../functions/Normalize';
import MyCouponExpiredScreen from '../../screens/PromotionScreen/MyCouponExpiredScreen';
import MyCouponUsedScreen from '../../screens/PromotionScreen/MyCouponUsedScreen';
import MyCouponUseScreen from '../../screens/PromotionScreen/MyCouponUseScreen';
import { mixpanel } from '../../../mixpanel';
import Text from '../../components/Text/Text';

const renderTabBar: React.FC<any> = (props: any) => {
  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.greenLight }}
      style={{ backgroundColor: colors.white }}
      renderLabel={({ route, focused, color }) => {
        return (
          <Text
            style={[
              styles.label,
              { color: focused ? colors.greenLight : colors.gray },
            ]}>
            {route.title}
          </Text>
        );
      }}
    />
  );
};

const PromotionTabNavigator: React.FC<any> = ({}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'use', title: 'ใช้ได้' },
    { key: 'used', title: 'ใช้แล้ว' },
    { key: 'expired', title: 'หมดอายุ' },
  ]);
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'use':
        return <MyCouponUseScreen />;
      case 'used':
        return <MyCouponUsedScreen />;
      case 'expired':
        return <MyCouponExpiredScreen />;
      default:
        return <View />;
    }
  };

  return (
    <TabView
      key={index}
      navigationState={{ index, routes }}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={(index: number) => {
        mixpanel.track('MyCouponScreen_TabSelect_tapped', {
          tab: routes[index].title,
        });
        setIndex(index);
      }}
      initialLayout={{ width: layout.width }}
      lazy
    />
  );
};

export default PromotionTabNavigator;

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(16),
  },
});
