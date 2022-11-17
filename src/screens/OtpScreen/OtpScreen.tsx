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
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {normalize} from '../../functions/Normalize';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import fonts from '../../assets/fonts';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CELL_COUNT = 6;

interface propsOTP {
  toggle: boolean;
}

interface props {
  index: number;
  symbol: string;
  isFocused: boolean;
}

const OtpScreen: React.FC<any> = ({navigation, route}) => {
  const [value, setValue] = useState<string>('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [isError, setIsError] = useState(false);
  const [otpCalling, setOtpCalling] = useState(false);
  const [tokenOtp, setTokenOtp] = useState();
  const [codeRef, setCodeRef] = useState();
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [errOTP, setErrOTP] = useState(false);

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
  const newCodeRef = useCallback(
    (value: any) => {
      setCodeRef(value);
    },
    [codeRef],
  );
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
  const onFufill = async (value: string) => {
      setValue(value);
      if (value.length >= CELL_COUNT) {
        setLoading(true);
        navigation.navigate('FirstFormScreen')      
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
              <View >
                <Text style={styles.text}>รหัสยืนยัน (OTP) ถูกส่งไปที่กล่องข้อความ </Text>
                <Text style={[styles.text]}>
                เบอร์ {" "}
                <Text style={[styles.text, {color: colors.greenLight}]}>
                 0989284761
                </Text>
              </Text>
              <Text style={[styles.text, {color: colors.gray}]}>
                รหัสอ้างอิง OTP: NIAA
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
            <View style={styles.otpQuestion}>
            <View>
                <Text style={styles.text}>ถ้ายังไม่ได้รับรหัสยืนยัน (OTP)?  
                <Text style={[styles.text, {color: colors.greenLight}]}>  ส่งอีกครั้ง</Text>
                </Text>
              </View>
              <Text style={styles.text}>รหัสจะหมดอายุใน {time} นาที</Text>
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
export default OtpScreen;

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
    borderColor: colors.greenLight,
    borderRadius: 8,
  },
  textError: {
    color: '#EB2C21',
    fontFamily: fonts.AnuphanMedium,
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
    fontFamily: font.Sarabun,
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
