import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {colors, icons} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import {TabBar, TabView} from 'react-native-tab-view';
import fonts from '../../assets/fonts';
import {normalize} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import {numberWithCommas} from '../../function/utility';
import {Image} from 'react-native';
import InProgressTab from './InProgressTab';
import UsedOrReceiveTab from './UsedOrReceiveTab';

interface Props {
  navigation: any;
}
export default function HistoryRewardScreen({navigation}: Props) {
  const [key, setKey] = React.useState(0);
  const [currentPoint] = React.useState(123000);
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
      {key: 'inProgress', title: 'กำลังดำเนินการ'},
      {key: 'usedOrReceive', title: 'ได้รับ/ใช้คะแนน'},
    ];
  }, []);
  const renderScene = ({route}: any) => {
    switch (route.key) {
      case 'inProgress':
        return <InProgressTab />;
      case 'usedOrReceive':
        return <UsedOrReceiveTab />;
      default:
        return null;
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        showBackBtn
        title={'ประวัติการได้รับ/ใช้คะแนน'}
        onPressBack={() => navigation.goBack()}
      />
      <LinearGradient
        colors={['#FA7052', '#F89132']}
        start={{x: 0, y: 0}}
        end={{x: 0.8, y: 1}}
        style={styles.containerPoint}>
        <Image
          source={icons.ICKDronerPoint}
          style={{
            width: 40,
            height: 40,
            marginRight: 8,
          }}
        />
        <View>
          <Text
            style={{
              fontSize: 24,
              fontFamily: fonts.bold,
              color: colors.white,
            }}>
            {numberWithCommas(currentPoint.toString(), true)}{' '}
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.medium,
                color: colors.white,
              }}>
              คะแนน
            </Text>
          </Text>
        </View>
      </LinearGradient>
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
