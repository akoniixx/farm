import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { TabBar, TabBarIndicator, TabView } from 'react-native-tab-view';
import { colors } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize } from '../../functions/Normalize';
import MyCouponExpiredScreen from '../../screens/PromotionScreen/MyCouponExpiredScreen';
import MyCouponUsedScreen from '../../screens/PromotionScreen/MyCouponUsedScreen';
import MyCouponUseScreen from '../../screens/PromotionScreen/MyCouponUseScreen';

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
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy
    />
  );
};

// const checkColorNumber = (key: number): string => {
//   let result = colors.greenLight;
//   if (key === 0) {
//     result = colors.greenLight;
//   } else if (key === 1) {
//     result = '#B05E03';
//   } else if (key === 2) {
//     result = '#AB091E';
//   }
//   return result;
// };

// const checkColor = (key: string): string => {
//   let result = colors.greenLight;
//   if (key === 'use') {
//     result = colors.greenLight;
//   } else if (key === 'used') {
//     result = '#B05E03';
//   } else if (key === 'expired') {
//     result = '#AB091E';
//   }
//   return result;
// };

export default PromotionTabNavigator;

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(16),
  },
});
