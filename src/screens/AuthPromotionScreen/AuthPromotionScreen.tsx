import React from 'react';
import { Image, StyleSheet, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font } from '../../assets';
import { stylesCentral } from '../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalize } from '../../functions/Normalize';
import image from '../../assets/images/image';
import CustomHeader from '../../components/CustomHeader';
import { MainButton } from '../../components/Button/MainButton';
import Text from '../../components/Text/Text';

const AuthPromotionScreen: React.FC<any> = ({ navigation, route }) => {
  return (
    <>
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title="โปรโมชั่น"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <View>
          <Image source={image.empty_farmer} style={[styles.empty]} />
          <View style={{ top: Dimensions.get('window').width - 320 }}>
            <Text style={[styles.text]}>คุณเป็นสมาชิกหรือยัง?</Text>
            <Text style={[styles.label]}>
              {`เข้าร่วมเป็นสมาชิกกับเรา
  เพื่อรับสิทธิประโยชน์มากมาย`}
            </Text>
          </View>
          <View style={{ top: Dimensions.get('window').width - 290 }}>
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
      </SafeAreaView>
    </>
  );
};
export default AuthPromotionScreen;

const styles = StyleSheet.create({
  buttomBlank: {
    height: normalize(54),
    width: normalize(343),
    alignSelf: 'center',
  },
  text: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(22),
    color: colors.fontBlack,
    textAlign: 'center',
    bottom: '10%',
  },
  label: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
    textAlign: 'center',
  },
  empty: {
    width: normalize(240),
    height: normalize(250),
    justifyContent: 'center',
    alignSelf: 'center',
    display: 'flex',
    top: Dimensions.get('window').width - 350,
  },
  textEmpty: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    top: '16%',
    color: colors.gray,
  },
});
