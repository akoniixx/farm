import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import CustomHeader from '../../components/CustomHeader';
import {colors} from '../../assets';
import {SafeAreaView} from 'react-native-safe-area-context';
import CardMission from '../../components/CardMission/CardMission';
interface Props {
  navigation: any;
  route: RouteProp<StackParamList, 'MissionDetailScreen'>;
}

export default function MissionDetailScreen({navigation, route}: Props) {
  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <CustomHeader
        showBackBtn
        title={'รายละเอียดภารกิจ'}
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <CardMission />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
  },
});
