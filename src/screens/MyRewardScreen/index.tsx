import { StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { colors } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { normalize } from '@rneui/themed';
import fonts from '../../assets/fonts';
import { TabBar, TabView } from 'react-native-tab-view';
import ReadyToUseTab from './ReadyToUseTab';
import HistoryTab from './HistoryTab';
import { useFocusEffect } from '@react-navigation/native';
import { mixpanel } from '../../../mixpanel';
import Text from '../../components/Text/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import InDelivery from './InDelivery';

export default function MyRewardScreen({
  navigation,
  route: r,
}: {
  route: any;
  navigation: any;
}) {
  const { tab = 'readyToUse' } = r.params;
  const [key, setKey] = React.useState(0);
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.greenLight }}
      style={{ backgroundColor: colors.white }}
      renderLabel={({ route, focused }) => (
        <Text
          style={[
            styles.label,
            { color: focused ? colors.greenLight : colors.grey40 },
          ]}>
          {route.title}
        </Text>
      )}
    />
  );
  const routes = useMemo(() => {
    return [
      { key: 'readyToUse', title: 'พร้อมใช้' },
      { key: 'delivery', title: 'ที่ต้องจัดส่ง' },
      { key: 'history', title: 'ประวัติ' },
    ];
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      if (tab) {
        const index = routes.findIndex(i => i.key === tab);
        setKey(index);
      }
    }, [routes, tab]),
  );
  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'readyToUse':
        return <ReadyToUseTab navigation={navigation} />;
      case 'history':
        return <HistoryTab navigation={navigation} />;
      case 'delivery':
        return <InDelivery navigation={navigation} />;
      default:
        return null;
    }
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.greenLight }}
      edges={['top', 'left', 'right']}>
      <CustomHeader
        showBackBtn
        title={'รางวัลของฉัน'}
        styleWrapper={{
          backgroundColor: colors.greenLight,
          height: 60,
          paddingVertical: 0,
        }}
        onPressBack={() => navigation.navigate('รางวัล')}
        titleColor={colors.white}
      />
      <View style={styles.safeArea}>
        <TabView
          key={key}
          navigationState={{ index: key, routes }}
          renderScene={renderScene}
          onIndexChange={(index: number) => {
            mixpanel.track('MyRewardScreen_TabView_ChangeTab', {
              tab: routes[index].title,
            });
            setKey(index);
          }}
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.AnuphanBold,
    fontSize: normalize(16),
  },
  containerPoint: {
    paddingHorizontal: 12,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
