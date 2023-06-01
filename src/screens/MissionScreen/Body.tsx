import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';

import CollapseItem from './CollapseItem';
import Text from '../../components/Text';
import {colors, image} from '../../assets';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {TabNavigatorParamList} from '../../navigations/bottomTabs/MainTapNavigator';

interface Props {
  navigation: BottomTabNavigationProp<TabNavigatorParamList, 'mission'>;
}
export default function Body({navigation}: Props) {
  const array = [1, 2, 3];
  const EmptyContent = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={image.emptyMission}
          style={{
            width: 120,
            height: 120,
            marginBottom: 16,
          }}
        />
        <Text
          style={{
            color: colors.grey3,
          }}>
          ยังไม่มีภารกิจในขณะนี้
        </Text>
        <Text
          style={{
            color: colors.grey3,
          }}>
          ติดตามภารกิจพร้อมพิชิตรางวัลมากมาย
        </Text>
        <Text
          style={{
            color: colors.grey3,
          }}>
          ได้ที่หน้านี่
        </Text>
      </View>
    );
  };

  return (
    <View>
      {array.length > 0 ? (
        <ScrollView style={styles.container}>
          {array.map((item, index) => {
            return <CollapseItem key={index} navigation={navigation} />;
          })}

          <View style={{height: 200}} />
        </ScrollView>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: Dimensions.get('window').height - 300,
          }}>
          <EmptyContent />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    padding: 16,
  },
});
