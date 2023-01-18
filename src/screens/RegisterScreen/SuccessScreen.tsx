import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import React from 'react';
import * as RootNavigation from '../../navigations/RootNavigation';
import { normalize } from '@rneui/themed';
import { colors, font, image } from '../../assets';
import { MainButton } from '../../components/Button/MainButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Register } from '../../datasource/AuthDatasource';
import { FCMtokenDatasource } from '../../datasource/FCMDatasource';
import { getFCMToken } from '../../firebase/notification';
const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const SuccessRegister: React.FC<any> = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        padding: (windowWidth * 20) / 375,
        justifyContent: 'space-between',
        backgroundColor: colors.white,
      }}>
      <View
        style={{
          marginTop: (windowHeight * 20) / 375,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.white,
        }}>
        <View
          style={{
            position: 'relative',
          }}>
          <Image
            source={image.success}
            style={{
              top: '10%',
              width: (windowWidth * 290) / 375,
              height: (windowHeight * 330) / 812,
            }}
          />
        </View>
        <View
          style={{
            marginTop: (windowHeight * 60) / 812,
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.h1,
              { marginTop: (windowWidth * 14) / 375, textAlign: 'center' },
            ]}>
            ยินดีต้อนรับสู่ครอบครัว IconKeset
          </Text>
          <Text
            style={[
              styles.label,
              { marginTop: (windowWidth * 16) / 375, textAlign: 'center' },
            ]}>{`คุณลงทะเบียนกับเราเรียบร้อยแล้ว
เริ่มสนุกกับการใช้งานและสร้างสรรค์
แปลงเกษตรของคุณได้เลย!`}</Text>
        </View>
      </View>
      <MainButton
        label="เริ่มใช้งาน"
        color={colors.greenLight}
        onPress={async () => {
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
    fontFamily: font.AnuphanBold,
    alignItems: 'center',
    fontSize: normalize(26),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.AnuphanMedium,
    fontSize: (windowHeight * 16) / 812,
    color: colors.fontBlack,
  },
  h3: {
    fontFamily: font.AnuphanMedium,
    fontSize: (windowHeight * 14) / 812,
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
});

export default SuccessRegister;
