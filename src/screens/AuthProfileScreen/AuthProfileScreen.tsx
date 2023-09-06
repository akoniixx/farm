import React from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons, image } from '../../assets';
import { normalize } from '../../functions/Normalize';
import { stylesCentral } from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { MainButton } from '../../components/Button/MainButton';

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
                fontFamily: font.AnuphanBold,
                color: colors.fontBlack,
                fontWeight: '800',
                lineHeight: 29,
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
      <View style={{ marginTop: 10 }} />
      <View style={[styles.section3]}>
        <View
          style={{
            backgroundColor: colors.white,
            width: '100%',
            justifyContent: 'space-around',
            paddingHorizontal: 10,
          }}>
          <TouchableOpacity onPress={openGooglePlay}>
            <View style={styles.listTile}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image source={image.iconAppDrone} style={[styles.icon]} />
                <Text style={[styles.h2, { paddingHorizontal: 20 }]}>
                  มาเป็นนักบินโดรนร่วมกับเรา
                </Text>
              </View>
              <Image
                source={icons.arrowRigth}
                style={{ width: 24, height: 24 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PrivacyScreen');
            }}>
            <View style={styles.listTile}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image source={icons.lock} style={[styles.icon]} />
                <Text style={[styles.h2, { paddingHorizontal: 20 }]}>
                  นโยบายความเป็นส่วนตัว
                </Text>
              </View>
              <Image
                source={icons.arrowRigth}
                style={{ width: 24, height: 24 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default AuthProfileScreen;

const styles = StyleSheet.create({
  listTile: {
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: normalize(0.5),
    borderBottomColor: colors.disable,
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
  h2: {
    fontFamily: font.SarabunMedium,
    fontSize: 18,
    color: colors.fontBlack,
    alignItems: 'center',
  },
  text: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  section3: {
    backgroundColor: colors.white,
    justifyContent: 'space-around',
  },
  icon: {
    width: 24,
    height: 24,
  },
});
