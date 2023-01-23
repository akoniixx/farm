import React, { useReducer, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons, image } from '../../assets';
import { height, normalize } from '../../functions/Normalize';
import { stylesCentral } from '../../styles/StylesCentral';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomHeader from '../../components/CustomHeader';
import { Avatar } from '@rneui/themed';
import * as RootNavigation from '../../navigations/RootNavigation';
import { ScrollView } from 'react-native';
import PlotsItem, { StatusObject } from '../../components/Plots/Plots';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Authentication } from '../../datasource/AuthDatasource';
import { FCMtokenDatasource } from '../../datasource/FCMDatasource';
import { socket } from '../../functions/utility';
import { initProfileState, profileReducer } from '../../hook/profilefield';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { MainButton } from '../../components/Button/MainButton';
import ConditionScreen from '../RegisterScreen/ConditionScreen';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import PlotInProfile from '../../components/Plots/PlotsInProfile';

const AuthProfileScreen: React.FC<any> = ({ navigation }) => {
  const openGooglePlay = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL(
        `https://apps.apple.com/th/app/iconkaset-droner/id6443516628?l=th`,
      );
    } else {
      Linking.openURL(
        `https://play.google.com/store/apps/details?id=com.iconkaset.droner`,
      );
    }
  };
  return (
    <SafeAreaView style={[stylesCentral.container]}>
      <CustomHeader
        title="บัญชีของฉัน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />

      <LinearGradient colors={['#ECFBF2', '#FFFFFF']}>
        <View style={{ height: normalize(296) }}>
          <View style={[styles.profileBlank]}>
            <Image
              source={icons.profile_blank}
              style={{ width: normalize(80), height: normalize(80) }}
            />
          </View>
          <View style={[styles.textBlank]}>
            <Text
              style={{
                fontSize: normalize(22),
                fontFamily: font.AnuphanMedium,
                color: colors.fontBlack,
              }}>
              ยินดีต้อนรับสู่ IconKaset
            </Text>
            <Text
              style={{
                fontSize: normalize(16),
                fontFamily: font.SarabunLight,
                top: 15,
                color: colors.fontBlack,
              }}>
              เข้าร่วมเป็นสมาชิกเพื่อรับสิทธิประโยชน์มากมาย
            </Text>
            <MainButton
              label="ลงทะเบียน/เข้าสู่ระบบ"
              color={colors.greenLight}
              style={styles.buttomBlank}
              onPress={async () => {
                const value = await AsyncStorage.getItem('PDPA');
                if (value === 'read') {
                  navigation.navigate('TelNumScreen');
                } else {
                  navigation.navigate('ConditionScreen');
                }
              }}
            />
          </View>
        </View>
      </LinearGradient>
      <View style={{ marginTop: 10 }}></View>
      <View
        style={{
          backgroundColor: colors.white,
          width: '100%',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          onPress={openGooglePlay}
          style={{
            alignItems: 'center',
            padding: normalize(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: colors.disable,
          }}>
          <Image
            source={image.iconAppDrone}
            style={[styles.icon, { marginRight: '-15%' }]}
          />
          <Text style={[styles.h2]}>มาเป็นนักบินโดรนร่วมกับเรา</Text>
          <Image source={icons.arrowRigth} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PrivacyScreen');
          }}
          style={{
            alignItems: 'center',
            padding: normalize(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: colors.disable,
          }}>
          <Image
            source={icons.lock}
            style={[styles.icon, { marginRight: '-20%' }]}
          />
          <Text style={styles.h2}>นโยบายความเป็นส่วนตัว</Text>
          <Image source={icons.arrowRigth} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default AuthProfileScreen;

const styles = StyleSheet.create({
  btAdd: {
    top: normalize(100),
    borderRadius: 10,
    height: normalize(80),
    width: normalize(340),
    borderStyle: 'dashed',
    position: 'relative',
  },
  textaddplot: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
    textAlign: 'center',
    top: '30%',
  },
  buttonAdd: {
    borderColor: '#1F8449',
    borderWidth: 1,
    borderRadius: 10,
    height: normalize(80),
    width: normalize(350),
    borderStyle: 'dashed',
    position: 'relative',
    alignSelf: 'center',
  },
  buttomBlank: {
    height: normalize(54),
    width: normalize(343),
    alignSelf: 'center',
    marginTop: normalize(30),
  },
  textBlank: {
    alignItems: 'center',
    top: normalize(60),
    display: 'flex',
  },
  profileBlank: {
    alignItems: 'center',
    top: normalize(30),
    bottom: normalize(82),
  },
  head: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
  },
  h1: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.SarabunMedium,
    fontSize: 18,
    color: colors.fontBlack,
    alignItems: 'center',
  },
  headerTitleWraper: {
    backgroundColor: '#F7FFF0',
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    width: normalize(375),
    height: normalize(50),
  },
  headerTitle: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
    textAlign: 'center',
    height: normalize(75),
    top: normalize(20),
    position: 'absolute',
    width: 260,
    left: 80,
    display: 'flex',
  },
  text: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  section1: {
    flexDirection: 'row',
    backgroundColor: '#F7FFF0',
    display: 'flex',
    alignItems: 'flex-start',
    padding: 15,
  },
  appProve: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.greenLight,
    padding: normalize(10),
    width: normalize(135),
    height: normalize(25),
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  section2: {
    padding: 15,
    backgroundColor: colors.white,
  },
  section3: {
    backgroundColor: colors.white,
    justifyContent: 'space-around',
  },
  menu: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.disable,
    paddingBottom: normalize(20),
    justifyContent: 'space-between',
  },
  icon: {
    width: 24,
    height: 24,
  },
});
