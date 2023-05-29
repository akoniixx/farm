import {View, SafeAreaView, StyleSheet, ImageBackground} from 'react-native';
import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {StackParamList} from '../../navigations/MainNavigator';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabNavigatorParamList} from '../../navigations/bottomTabs/MainTapNavigator';
import {RouteProp} from '@react-navigation/native';
import {colors, font, image} from '../../assets';
import Text from '../../components/Text';
import TabCustom from '../../components/TabCustom/TabCustom';
import Body from './Body';
type MissionScreenProps = {
  navigation: BottomTabNavigationProp<TabNavigatorParamList, 'mission'>;
};
const tabLists = [
  {
    title: 'ทั้งหมด',
    value: 'all',
  },
  {
    title: 'เริ่มแล้ว',
    value: 'start',
  },
  {
    title: 'เสร็จแล้ว',
    value: 'finish',
  },
  {
    title: 'หมดเขต',
    value: 'expire',
  },
];

export default function MissionScreen({navigation}: MissionScreenProps) {
  const [selectedTab, setSelectedTab] = React.useState<string>('all');
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ImageBackground
        source={image.bgHeaderMission}
        style={styles.headerContainer}>
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            marginTop: 16,
          }}>
          <Text
            style={{
              fontSize: 24,
              color: colors.white,
              fontFamily: font.bold,
              marginBottom: 8,
            }}>
            ภารกิจ
          </Text>
          <TabCustom
            tabs={tabLists}
            value={selectedTab}
            onChangeTab={handleTabChange}
          />
        </View>
      </ImageBackground>
      <Body />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    height: 120,
    width: '100%',
  },
});
