import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { stylesCentral } from '../../../styles/StylesCentral';
import CustomHeader from '../../../components/CustomHeader';
import colors from '../../../assets/colors/colors';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { font } from '../../../assets';
import { Authentication } from '../../../datasource/AuthDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../contexts/AuthContext';
import * as RootNavigation from '../../../navigations/RootNavigation';
import { FCMtokenDatasource } from '../../../datasource/FCMDatasource';
import { socket } from '../../../functions/utility';
import { normalize } from '../../../functions/Normalize';
import Text from '../../../components/Text/Text';

const CELL_COUNT = 6;
interface props {
  index: number;
  symbol: string;
  isFocused: boolean;
}

const VerifyOTP: React.FC<any> = ({ navigation, route }) => {
  const params = route.params;
  const [value, setValue] = useState<string>('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [isError, setIsError] = useState(false);
  const [resentTime, setResentTime] = useState('02:00');
  const [resentNumber, setResentNumber] = useState(120);
  const [otpCalling, setOtpCalling] = useState(false);
  const [refCode, setRefCode] = useState('');
  const {
    state: { user },
  } = useAuth();
  const onResendOtp = async () => {
    try {
      const data = await Authentication.generateOtpDelete(user?.telephoneNo);
      setRefCode(data?.result?.refCode);
    } catch (e) {
      console.log(e);
    }
  };
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [errOTP, setErrOTP] = useState(false);

  const [otpTimeOut, setOTPtimeout] = useState(300);
  const [time, setTime] = useState('05:00');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (otpCalling) {
      setOTPtimeout(300);
      setTime('05:00');
      setOtpCalling(false);
    }
    if (params.refCode) {
      setRefCode(params.refCode);
    }
  }, [otpCalling, params.refCode]);

  useEffect(() => {
    let timer = setInterval(() => {
      if (otpTimeOut === 0) {
      } else {
        let second = otpTimeOut - 1;
        setOTPtimeout(second);
        setTime(
          `0${parseInt((second / 60).toString())}:${
            second % 60 < 10 ? '0' + (second % 60) : second % 60
          }`,
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [otpTimeOut]);
  useEffect(() => {
    let timerR = setInterval(() => {
      if (resentNumber === 0) {
      } else {
        let secondR = resentNumber - 1;
        setResentNumber(prev => prev - 1);
        setResentTime(
          `0${parseInt((secondR / 60).toString())}:${
            secondR % 60 < 10 ? '0' + (secondR % 60) : secondR % 60
          }`,
        );
      }
    }, 1000);
    return () => clearInterval(timerR);
  }, [resentNumber]);

  const renderCell: React.FC<props> = ({ index, symbol, isFocused }) => {
    return (
      <Text
        key={index}
        style={[
          !isError ? styles.cell : styles.cellError,
          isFocused || symbol ? styles.focusCell : null,
          {
            color: colors.fontBlack,
          },
        ]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </Text>
    );
  };

  const onFufill = async (v: string) => {
    setValue(v);
    if (v.length >= CELL_COUNT) {
      const payload = {
        telephoneNo: params.telNumber,
        otpCode: v,
        token: params.token,
        refCode: params.refCode,
      };
      try {
        setLoading(true);
        const result = await Authentication.verifyOtp(payload);
        Authentication.onDeleteAccount(result.data.id)
          .then(async res => {
            if (res) {
              setLoading(false);
              const fcmtoken = await AsyncStorage.getItem('fcmtoken');
              FCMtokenDatasource.deleteFCMtoken(fcmtoken!)
                .then(async res => {
                  console.log(res);
                  navigation.navigate('DeleteSuccess');
                })
                .catch(err => console.log(err));
            }
          })
          .catch(err => {
            console.log(err);
          });
      } catch (e) {
        setLoading(false);
        setErrOTP(true);
        console.log(e, 'AsyncStorage.setItem');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={stylesCentral.container}>
          <CustomHeader
            title="ยืนยันรหัสเลข OTP"
            showBackBtn
            onPressBack={() => navigation.goBack()}
          />
          <View style={styles.inner}>
            <View style={styles.headContainer}>
              <View>
                <Text style={[styles.text, { bottom: '5%' }]}>
                  เลขยืนยัน 6 หลัก (OTP)
                </Text>
                <Text style={[styles.text, { bottom: '5%' }]}>
                  ถูกส่งไปที่กล่องข้อความของคุณ
                </Text>
                <Text style={[styles.text, { bottom: '2%' }]}>
                  เบอร์{' '}
                  <Text style={[styles.text, { color: colors.greenLight }]}>
                    {route.params.telNumber}
                  </Text>
                </Text>
                <Text style={[styles.textpass, { color: colors.gray }]}>
                  รหัสอ้างอิง OTP: {refCode}
                </Text>
              </View>
            </View>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={onFufill}
              cellCount={CELL_COUNT}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={renderCell}
            />
            {errOTP ? (
              <Text style={styles.textError}>
                รหัส OTP ไม่ถูกต้องกรุณาลองอีกครั้ง
              </Text>
            ) : (
              <></>
            )}
            <View style={styles.otpQuestion}>
              <View style={styles.rowDirection}>
                <Text style={styles.text}>รหัส OTP จะหมดอายุใน </Text>
                {resentNumber === 0 ? (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        setOtpCalling(true);
                        setResentNumber(120);
                        setResentTime('02:00');
                        onResendOtp();
                      }}>
                      <Text
                        style={[
                          styles.text,
                          {
                            color: colors.greenLight,
                            textDecorationLine: 'underline',
                            textDecorationColor: colors.greenLight,
                          },
                        ]}>
                        ส่งอีกครั้ง
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text
                    style={[
                      styles.text,
                      {
                        color: colors.greenLight,
                        textDecorationColor: colors.greenLight,
                      },
                    ]}>
                    {`${resentTime} นาที`}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </KeyboardAvoidingView>
  );
};

export default VerifyOTP;
const styles = StyleSheet.create({
  textpass: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(14),
    color: colors.fontBlack,
    textAlign: 'center',
  },
  cell: {
    width: 55,
    height: 75,
    lineHeight: 70,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    textAlign: 'center',
    borderRadius: 8,
  },
  cellError: {
    width: 55,
    height: 75,
    lineHeight: 70,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#EB2C21',
    textAlign: 'center',
    borderRadius: 8,
  },
  focusCell: {
    borderColor: colors.greenLight,
    borderRadius: 8,
  },
  textError: {
    color: '#EB2C21',
    fontFamily: font.SarabunLight,
    marginTop: 15,
    fontSize: 16,
  },
  inner: {
    flex: 1,
    paddingHorizontal: normalize(15),
  },
  headContainer: {
    marginVertical: normalize(38),
    alignItems: 'center',
  },
  otpQuestion: {
    marginTop: normalize(38),
    alignItems: 'center',
  },
  timeCount: {
    marginTop: normalize(12),
    alignItems: 'center',
  },
  text: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
    textAlign: 'center',
  },
  rowDirection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: normalize(10),
  },
});
