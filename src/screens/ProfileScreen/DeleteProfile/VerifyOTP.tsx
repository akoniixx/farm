import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {stylesCentral} from '../../../styles/StylesCentral';
import CustomHeader from '../../../components/CustomHeader';
import colors from '../../../assets/colors/colors';
import {normalize} from '../../../function/Normalize';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {font} from '../../../assets';

const CELL_COUNT = 6;
interface props {
  index: number;
  symbol: string;
  isFocused: boolean;
}

const VerifyOTP: React.FC<any> = ({navigation, route}) => {
  const [value, setValue] = useState<string>('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [isError, setIsError] = useState(false);
  const [otpCalling, setOtpCalling] = useState(false);
  const [tokenOtp, setTokenOtp] = useState(route.params.token);
  const [codeRef, setCodeRef] = useState(route.params.refCode);
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [errOTP, setErrOTP] = useState(false);

  const newCodeRef = useCallback((v: any) => {
    setCodeRef(v);
  }, []);

  const [otpTimeOut, setOTPtimeout] = useState(300);
  const [time, setTime] = useState('05:00');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (otpCalling) {
      setOTPtimeout(300);
      setTime('05:00');
      setOtpCalling(false);
    }
  }, [otpCalling]);

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
  });

  const renderCell: React.FC<props> = ({index, symbol, isFocused}) => {
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
    console.log(v);
    setValue(v);
    if (v.length >= CELL_COUNT) {
      setLoading(true);
      try {
        console.log(v);
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
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={stylesCentral.container}>
          <CustomHeader
            title="ยืนยันรหัส OTP"
            showBackBtn
            onPressBack={() => navigation.goBack()}
          />
          <View style={styles.inner}>
            <View style={styles.headContainer}>
              <View style={styles.rowDirection}>
                <Text style={styles.text}>รหัส OTP ถูกส่งไปยัง </Text>
                <Text style={[styles.text, {color: colors.orange}]}>
                  {route.params.telNumber}
                </Text>
              </View>
              <Text style={[styles.text, {color: colors.gray}]}>
                รหัสอ้างอิง OTP: {codeRef}
              </Text>
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
                <Text style={styles.text}>ไม่ได้รับรหัส OTP? </Text>
                <TouchableOpacity
                  onPress={() => {
                    setOtpCalling(true);
                  }}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: colors.orange,
                        textDecorationLine: 'underline',
                        textDecorationColor: colors.orange,
                      },
                    ]}>
                    ส่งอีกครั้ง
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={[
                    styles.text,
                    {
                      fontFamily: font.bold,
                    },
                  ]}>{`รหัส OTP จะหมดอายุใน ${time} นาที`}</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </KeyboardAvoidingView>
  );
};

export default VerifyOTP;
const styles = StyleSheet.create({
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
    borderColor: colors.orange,
    borderRadius: 8,
  },
  textError: {
    color: '#EB2C21',
    fontFamily: font.medium,
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
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  rowDirection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: normalize(10),
  },
});
