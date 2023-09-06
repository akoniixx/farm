import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../styles/StylesCentral';
import { colors, font } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { InputPhone } from '../../components/InputPhone';
import { MainButton } from '../../components/Button/MainButton';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { normalize } from '../../functions/Normalize';
import Text from '../../components/Text/Text';

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const [value, setValue] = useState<string>('');
  const [isError, setIsError] = React.useState(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = React.useState<string>('');
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={stylesCentral.container}>
          <CustomHeader
            title="เข้าสู่ระบบ"
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
                onPress={() => navigation.navigate('OtpScreen')}
                disable={value?.length !== 10}
              />

              <MainButton
                label="ลงทะเบียนเกษตรกร"
                color={colors.white}
                fontColor={'black'}
                onPress={() => navigation.navigate('ConditionScreen')}
              />
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
export default LoginScreen;

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  headText: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(20),
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
