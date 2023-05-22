import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import {colors, font} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import {numberWithCommas} from '../../function/utility';
import AddressDetail from './AddressDetail';

interface Props {
  navigation: any;
  route: RouteProp<StackParamList, 'ExchangeAddressScreen'>;
}
export default function ExchangeAddressScreen({navigation, route}: Props) {
  const {data} = route.params;
  const onConfirm = () => {
    console.log('confirm');
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        showBackBtn
        onPressBack={() => navigation.goBack()}
        title="สรุปรายละเอียดการแลก"
      />
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{
              flex: 0.2,
            }}>
            <Image
              source={data.image}
              resizeMode="contain"
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
              }}
            />
          </View>
          <View style={{paddingLeft: 16, flex: 0.8}}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.gray,
              }}>
              สินค้า
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.bold,
                color: colors.fontBlack,
                marginTop: 4,
                lineHeight: 28,
                alignSelf: 'flex-start',
              }}>
              {data.title}
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.row}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 28,

                fontFamily: font.medium,
                color: colors.grey2,
              }}>
              จำนวน
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.fontBlack,
                lineHeight: 28,
              }}>
              {data.amount}
            </Text>
          </View>
          <View style={styles.row}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.grey2,
                lineHeight: 28,
              }}>
              แต้มสะสมปัจจุบัน
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.fontBlack,
                lineHeight: 28,
              }}>
              {numberWithCommas(data.usePoint.toString(), true)} แต้ม
            </Text>
          </View>
          <View style={styles.row}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.grey2,
                lineHeight: 28,
              }}>
              ใช้แต้ม
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                color: colors.fontBlack,
                lineHeight: 28,
              }}>
              {numberWithCommas(data.usePoint.toString(), true)} แต้ม
            </Text>
          </View>
          <View style={styles.row}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 28,

                fontFamily: font.medium,
                color: colors.grey2,
              }}>
              แต้มคงเหลือ
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.medium,
                lineHeight: 28,

                color: colors.fontBlack,
              }}>
              {numberWithCommas(data.pointLeft.toString(), true)} แต้ม
            </Text>
          </View>
        </View>
        <AddressDetail navigation={navigation} data={data} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={onConfirm}>
          <Text style={styles.textButton}>ยืนยันการแลก</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomColor: colors.greys5,
    borderBottomWidth: 1,
    borderTopColor: colors.greys5,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  content: {
    padding: 16,
    borderBottomColor: colors.greys5,
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    height: 100,
    backgroundColor: colors.white,

    flexDirection: 'row',
    padding: 16,
    elevation: 8,
    shadowColor: '#242D35',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  textButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.white,
  },
  button: {
    width: '100%',
    backgroundColor: colors.orange,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F86820',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
});
