import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Image, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import { normalize } from '../../functions/Normalize';
import { colors, font, image } from '../../assets';
import { MainButton } from '../../components/Button/MainButton';

const MyPlotScreen: React.FC<any> = ({navigation}) => {
  const [fcmToken, setFcmToken] = useState('');
  const getToken = async () => {
    const token = await AsyncStorage.getItem('fcmtoken');
    setFcmToken(token!);
  };

  useEffect(() => {
    getToken();
  });
  return (
    <>
      {fcmToken !== null ? (
        <View></View>
      ) : (
        <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title="แปลงของคุณ"
          showBackBtn
          onPressBack={() => navigation.goBack()
        }
        />
          <View>
            <Image source={image.empty_farmer} style={[styles.empty]} />
            <View style={{top: '35%'}}>
              <Text style={[styles.text]}>คุณเป็นสมาชิกหรือยัง?</Text>
              <Text style={[styles.label]}>
                {`เข้าร่วมเป็นสมาชิกกับเรา
เพื่อรับสิทธิประโยชน์มากมาย`}
              </Text>
            </View>
            <View style={{top: '40%'}}>
              <MainButton
                label="ลงทะเบียน/เข้าสู่ระบบ"
                color={colors.greenLight}
                style={styles.buttomBlank}
                onPress={() => navigation.navigate('ConditionScreen')}
              />
            </View>
          </View>
      </SafeAreaView>
      )}
    </>
  );
};
export default MyPlotScreen;
const styles = StyleSheet.create({
  buttomBlank: {
    height: normalize(54),
    width: normalize(343),
    alignSelf: 'center',
    shadowColor: '#0CDF65',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12.35,
    elevation: 19,
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
    top: '25%'
  },
    container: {
      flex: 1,
    },
    inner: {
        paddingHorizontal: normalize(17),
        flex: 1,
        justifyContent: 'space-around',
      },
  });
