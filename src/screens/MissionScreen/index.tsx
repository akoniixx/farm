import {
  View,
  StyleSheet,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';

import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabNavigatorParamList} from '../../navigations/bottomTabs/MainTapNavigator';
import {colors, font, image} from '../../assets';
import Text from '../../components/Text';
import TabCustom from '../../components/TabCustom/TabCustom';
import Body from './Body';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Campaign} from '../../datasource/CampaignDatasource';
import Spinner from 'react-native-loading-spinner-overlay';

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
  const [campaignImage, setCampaignImage] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);

  const fetchImage = async () => {
    await Campaign.getImage('DRONER', 'QUATA', 'ACTIVE')
      .then(res => {
        setLoading(true);
        setCampaignImage(res.data[0].pathImageFloating);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView
      edges={['right', 'bottom', 'left']}
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
          {/* 
          <View
            style={{
              height: 45,
            }}
          /> */}
        </View>
      </ImageBackground>
      <Body navigation={navigation} fetchImage={fetchImage} />
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          right: 8,
          zIndex: 1,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('CampaignScreen')}>
          <Image
            source={{uri: campaignImage}}
            style={{width: 150, height: 60}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <Spinner
        visible={loading}
        textContent="Loading..."
        textStyle={{color: '#FFF'}}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    ...Platform.select({
      ios: {
        height: 136,
        width: '100%',
        justifyContent: 'flex-end',
      },
      android: {
        height: 100,
        width: '100%',
        justifyContent: 'flex-end',
      },
    }),
  },
});
