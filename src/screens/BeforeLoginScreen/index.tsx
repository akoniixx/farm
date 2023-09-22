import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-navigation';
import CustomHeader from '../../components/CustomHeader';
import { stylesCentral } from '../../styles/StylesCentral';
import { Image } from 'react-native';
import { font, image } from '../../assets';
import { MainButton } from '../../components/Button/MainButton';
import colors from '../../assets/colors/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalize } from '../../functions/Normalize';

export default function BeforeLoginScreen({ navigation }: any) {
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
}
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
