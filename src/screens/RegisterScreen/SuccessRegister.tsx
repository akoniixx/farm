import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import React from 'react';
import {normalize} from '@rneui/themed';
import {colors, font, image} from '../../assets';
import {MainButton} from '../../components/Button/MainButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../navigations/RootNavigation';
import {Register} from '../../datasource/AuthDatasource';
import { mixpanel } from '../../../mixpanel';

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const SuccessRegister: React.FC<any> = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        padding: (windowWidth * 20) / 375,
        justifyContent: 'space-between',
        backgroundColor: '#FEF7EE',
      }}>
      <View
        style={{
          marginTop: (windowHeight * 20) / 375,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FEF7EE',
        }}>
        <View
          style={{
            position: 'relative',
          }}>
          <Image
            source={image.successdrone}
            style={{
              position: 'absolute',
              width: windowWidth * 0.3,
              height: windowWidth * 0.3,
              top: (windowWidth * 40) / 812,
              left: (windowWidth * -30) / 375,
            }}
          />
          <Image
            source={image.successimage}
            style={{
              top: (windowHeight * 60) / 812,
              width: (windowWidth * 261) / 375,
              height: (windowHeight * 330) / 812,
            }}
          />
        </View>
        <View
          style={{
            marginTop: (windowHeight * 60) / 812,
            alignItems: 'center',
          }}>
          <Text style={[styles.h1, {marginTop: (windowWidth * 14) / 375}]}>
            ยินดีต้อนรับสู่ครอบครัว
          </Text>
          <Text style={[styles.h1]}>นักบิน IconKaset</Text>
          <Text
            style={[
              styles.label,
              {marginTop: (windowWidth * 16) / 375, textAlign: 'center'},
            ]}>
            คุณลงทะเบียนนักบินโดรนกับเราเรียบร้อยแล้ว
            โปรดรอการยืนยันสถานะนักบินจากระบบ เพื่อรับงาน
          </Text>
        </View>
      </View>
      <MainButton
        label="เริ่มใช้งาน"
        color={colors.orange}
        onPress={async () => {
          mixpanel.track('Account Create Success');
          const token_register = await AsyncStorage.getItem('token_register');
          await AsyncStorage.setItem('token', token_register!);
          Register.changeToPending()
            .then(res => {
              RootNavigation.navigate('Main', {
                screen: 'MainScreen',
              });
            })
            .catch(err => console.log(err));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    paddingHorizontal: (windowWidth * 17) / 325,
  },
  h1: {
    fontFamily: font.bold,
    fontSize: (windowHeight * 32) / 812,
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.medium,
    fontSize: (windowHeight * 16) / 812,
    color: colors.fontBlack,
  },
  h3: {
    fontFamily: font.medium,
    fontSize: (windowHeight * 14) / 812,
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.light,
    fontSize: (windowHeight * 14) / 812,
    color: colors.gray,
  },
});

export default SuccessRegister;
