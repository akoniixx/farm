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
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const CELL_COUNT = 6;

interface props {
  index: number;
  symbol: string;
  isFocused: boolean;
}

const OtpScreen: React.FC<any> = ({navigation, route}) => {
  const [value, setValue] = useState<string>('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [isError, setIsError] = useState(false);
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    // console.log(navigation,'navi');
    console.log(route.params);
  }, []);

  const renderCell: React.FC<props> = ({index, symbol, isFocused}) => {
    return (
      <Text
        key={index}
        style={[
          !isError ? styles.cell : styles.cellError,
          isFocused || symbol ? styles.focusCell : null,
        ]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </Text>
    );
  };

  const onFufill = async (value: string) => {
    if(route.params.isRegisterScreen){
      console.log("step one")
      setValue(value);
      if (value.length >= CELL_COUNT) {
          navigation.navigate('FirstFormScreen');
      }
      
    }else{
      setValue(value);
      if (value.length >= CELL_COUNT) {
        try {
          axios.post("https://api-dev-dnds.iconkaset.com/auth/droner/verify-otp",{
            telephoneNo: route.params.telNumber,
            otpCode: value,
            token: route.params.token,
            refCode: route.params.refCode
          })
          .then(async(res)=>{
            await AsyncStorage.setItem('token', res.data.accessToken);
            await AsyncStorage.setItem('droner_id', res.data.data.id);
            await navigation.navigate('Main');
          }).catch((err)=>{
            console.log(err)
          })
        } catch (e) {
          console.log(e, 'AsyncStorage.setItem');
        }
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
                รหัสอ้างอิง OTP: NIAA
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
            <View style={styles.headContainer}>
              <View style={styles.rowDirection}>
                <Text style={styles.text}>ไม่ได้รับรหัส OTP? </Text>
                <Text style={[styles.text, {color: colors.orange}]}>
                  ส่งอีกครั้ง
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
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
    borderColor: colors.orange,
    borderRadius: 8,
  },
  textError: {
    color: '#EB2C21',
    alignSelf: 'center',
    marginTop: 15,
    fontSize: 12,
  },
  inner: {
    flex: 1,
    paddingHorizontal: normalize(15),
  },
  headContainer: {
    marginVertical: normalize(38),
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
