import {Image, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../components/Text';
import CustomHeader from '../../components/CustomHeader';
import {
  StackNavigationHelpers,
  StackNavigationProp,
} from '@react-navigation/stack/lib/typescript/src/types';
import {RouteProp} from '@react-navigation/native';
import mockGuru from '../../assets/mockGuru';
import {colors, font} from '../../assets';
import {numberWithCommas} from '../../function/utility';
import moment from 'moment';
import BadgeGuru from '../../components/BadgeGuru';
import {SafeAreaView} from 'react-native-safe-area-context';
import SectionFooter from './SectionFooter';
import {StackParamList} from '../../navigations/MainNavigator';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'GuruDetailScreen'>;
  route: RouteProp<StackParamList, 'GuruDetailScreen'>;
}
const GuruDetailScreen: React.FC<Props> = ({navigation, route}) => {
  const {guruId} = route.params;
  const loveCount = Math.round(Math.random() * 1000);
  const commentCount = Math.round(Math.random() * 1000);
  const readCount = Math.round(Math.random() * 10000);
  const dateCreate = moment().subtract(
    Math.round(Math.random() * 1000),
    'hours',
  );
  console.log('guruId', guruId);

  return (
    <SafeAreaView style={{flex: 1}} edges={['top', 'left', 'right']}>
      <CustomHeader
        styleWrapper={{
          height: 50,
          paddingHorizontal: 0,
        }}
        showBackBtn
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.containerHeader}>
          <Image source={mockGuru.imageContent} style={styles.imageHeader} />
        </View>
        <View style={styles.containerFooter}>
          <Text numberOfLines={2} style={styles.textTitle}>
            3 หลักการแก้ปัญหาหญ้าข้าวนกดื้อยา หญ้าตัวร้ายปราบเซียนมืออาชีพ
            หญ้าตัวร้ายปราบเซียนมืออาชีพ หญ้าตัวร้ายปราบเซียนมืออาชีพ
          </Text>
          <View style={[styles.row, {marginTop: 8}]}>
            <Text style={styles.textNormal}>{dateCreate.fromNow()}</Text>
            <View style={[styles.row, {marginLeft: 16}]}>
              <Text style={styles.textNormal}>
                {`อ่านแล้ว ${numberWithCommas(
                  readCount.toString(),
                  true,
                )} ครั้ง`}
              </Text>
            </View>
          </View>
          <View style={styles.badge}>
            <BadgeGuru title="โรคพืช" isDetail />
          </View>
          <SectionFooter loveCount={loveCount} commentCount={commentCount} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default GuruDetailScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textNormal: {
    fontSize: 14,
    color: colors.grey40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.disable,
    marginVertical: 8,
  },
  imageHeader: {
    width: '100%',
    height: '100%',
  },
  textTitle: {
    fontSize: 20,
    fontFamily: font.semiBold,
    paddingRight: 32,
  },
  containerHeader: {
    height: 400,
    width: '100%',
  },
  containerFooter: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: colors.white,
    flex: 1,
    height: '100%',
  },
  badge: {
    marginTop: 8,
  },
});
