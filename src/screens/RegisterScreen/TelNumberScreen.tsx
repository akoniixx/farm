import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../styles/StylesCentral';
import { colors, font, image } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { MainButton } from '../../components/Button/MainButton';
import { normalize } from '../../functions/Normalize';
import { InputPhone } from '../../components/InputPhone';
import { Authentication } from '../../datasource/AuthDatasource';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Text from '../../components/Text/Text';
import { useMaintenance } from '../../contexts/MaintenanceContext';

const TelNumScreen: React.FC<any> = ({ navigation }) => {
  const [value, setValue] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [errMessage, setErrMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { checkDataMA } = useMaintenance();

  const login = async () => {
    await checkDataMA();
    Authentication.generateOtpRegister(value)
      .then(result => {
        setLoading(false);
        navigation.navigate('OtpScreen', {
          telNumber: value,
          token: result.result.token,
          refCode: result.result.refCode,
          isRegisterScreen: true,
        });
      })
      .catch(err => {
        console.log(err);
        if (err.response.data.statusCode === 409) {
          Authentication.generateOtp(value)
            .then(result => {
              setLoading(false);
              const telNumber = value;
              setValue('');
              navigation.navigate('OtpScreen', {
                telNumber: telNumber,
                token: result.result.token,
                refCode: result.result.refCode,
                isRegisterScreen: false,
              });
            })
            .catch(err => console.log(err));
        }
      });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={stylesCentral.container}>
          <CustomHeader
            title="ลงทะเบียน/เข้าสู่ระบบ"
            showBackBtn
            onPressBack={() => navigation.goBack()}
          />

          <View style={styles.inner}>
            <View style={styles.containerTopCard}>
              <Image
                source={image.loginImage}
                style={{
                  width: normalize(116),
                  height: normalize(116),
                  resizeMode: 'contain',
                  marginBottom: normalize(8),
                }}
              />
              <Text style={styles.headText}>ยืนยันหมายเลขโทรศัพท์ของคุณ</Text>
              <InputPhone
                value={value}
                onChangeText={(e: string) => {
                  if (/^(09|08|06)\d{8}$/.test(e)) {
                    setValue(e);
                  } else {
                    setValue('');
                  }
                }}
                maxLength={10}
                autoFocus={true}
                onError={isError}
                errorMessage={message}
              />
              {errMessage.length > 0 ? (
                <Text
                  style={{
                    marginTop: 5,
                    color: 'red',
                    fontFamily: font.AnuphanMedium,
                  }}>
                  {errMessage}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                ...Platform.select({
                  ios: {
                    paddingVertical: 0,
                  },
                  android: {
                    paddingVertical: 30,
                  },
                }),
              }}>
              <MainButton
                label="ถัดไป"
                color={colors.greenLight}
                disable={value.length !== 10}
                onPress={() => {
                  setLoading(true);
                  login();
                }}
              />
            </View>
          </View>
          <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default TelNumScreen;

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  headText: {
    fontFamily: font.AnuphanSemiBold,
    fontSize: normalize(18),
    color: colors.fontBlack,
    marginBottom: normalize(24),
  },
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(14),
    color: colors.gray,
    marginTop: normalize(24),
  },
  containerTopCard: {
    flex: 1,
    paddingTop: normalize(16),
    alignItems: 'center',
  },
});
