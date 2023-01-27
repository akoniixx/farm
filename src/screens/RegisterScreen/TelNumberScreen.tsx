import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Button,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../styles/StylesCentral';
import { colors, font } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { MainButton } from '../../components/Button/MainButton';
import { normalize } from '../../functions/Normalize';
import { InputPhone } from '../../components/InputPhone';
import OtpScreen from '../OtpScreen/OtpScreen';
import * as RootNavigation from '../../navigations/RootNavigation';
import { Authentication } from '../../datasource/AuthDatasource';
import Toast from 'react-native-toast-message';
import Spinner from 'react-native-loading-spinner-overlay/lib';

const TelNumScreen: React.FC<any> = ({ navigation }) => {
  const [value, setValue] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [errMessage, setErrMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const login = () => {
    Authentication.generateOtpRegister(value)
      .then(result => {
        console.log(result)
        setLoading(false);
        navigation.navigate('OtpScreen', {
          telNumber: value,
          token: result.result.token,
          refCode: result.result.refCode,
          isRegisterScreen: true,
        });
      })
      .catch(err => {
        console.log(JSON.stringify(err.response,null,2))
        if (err.response.data.statusCode === 409) {
          Authentication.generateOtp(value).then(result => {
            setLoading(false);
            console.log(result)
            const telNumber = value;
            setValue('');
            navigation.navigate('OtpScreen', {
              telNumber: telNumber,
              token: result.result.token,
              refCode: result.result.refCode,
              isRegisterScreen: false,
            });
          });
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
              <Text style={styles.headText}>ระบุหมายเลขโทรศัพท์ของคุณ</Text>
              <InputPhone
                value={value}
                onChangeText={(e: string) => setValue(e)}
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

            <View>
              <MainButton
                label="ถัดไป"
                color={colors.greenLight}
                disable={value.length != 10}
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
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
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
    paddingTop: normalize(70),
  },
});
