import {SafeAreaView, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {colors} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import {normalize} from '@rneui/themed';
import fonts from '../../assets/fonts';
import {TabBar, TabView} from 'react-native-tab-view';
import ReadyToUseTab from './ReadyToUseTab';
import HistoryTab from './HistoryTab';
import {useFocusEffect} from '@react-navigation/native';
import Text from '../../components/Text';

export default function MyRewardScreen({
  navigation,
  route: r,
}: {
  route: any;
  navigation: any;
}) {
  const {tab = 'readyToUse'} = r.params;
  const [key, setKey] = React.useState(0);
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.orange}}
      style={{backgroundColor: colors.white}}
      renderLabel={({route, focused}) => (
        <Text
          style={[
            styles.label,
            {color: focused ? colors.orange : colors.gray},
          ]}>
          {route.title}
        </Text>
      )}
    />
  );
  const routes = useMemo(() => {
    return [
      {key: 'readyToUse', title: 'พร้อมใช้'},
      {key: 'history', title: 'ประวัติ'},
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
  const renderScene = ({route}: any) => {
    switch (route.key) {
      case 'readyToUse':
        return <ReadyToUseTab navigation={navigation} />;
      case 'history':
        return <HistoryTab navigation={navigation} />;
      default:
        return null;
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        showBackBtn
        title={'รีวอร์ดของฉัน'}
        onPressBack={() => navigation.navigate('reward')}
      />

      <TabView
        key={key}
        navigationState={{index: key, routes}}
        renderScene={renderScene}
        lazy
        onIndexChange={setKey}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: normalize(16),
  },
  containerPoint: {
    paddingHorizontal: 12,
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
