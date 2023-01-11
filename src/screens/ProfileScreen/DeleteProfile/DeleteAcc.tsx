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
import  Toast  from 'react-native-toast-message';
import { stylesCentral } from '../../../styles/StylesCentral';
import CustomHeader from '../../../components/CustomHeader';
import { normalize } from '../../../functions/Normalize';
import { colors, font } from '../../../assets';
import { MainButton } from '../../../components/Button/MainButton';
import { InputPhone } from '../../../components/InputPhone';

const DeleteAcc: React.FC<any> = ({navigation}) => {

  return (
    <View
      style={{flex: 1}}>
        <SafeAreaView style={stylesCentral.container}>
          <CustomHeader
            title="ลบบัญชี"
            showBackBtn
            onPressBack={() => navigation.goBack()}
          />
          <View style={styles.inner}>
          <View style={[styles.TextAll]}>
         <Text style={[styles.head, {fontWeight: 'bold', bottom: 10}]}>
           เงื่อนไขการลบบัญชี
         </Text>
         <Text style={[styles.head]}>
           {`หากคุณมีการจ้างงานบินฉีดพ่นที่อยู่ระหว่าง 
 กำลังดำเนินงาน หรือรอเริ่มงาน 
 คุณจะไม่สามารถลบบัญชีของคุณได้`}
         </Text>
         <Text style={styles.text}>
           {`หากคุณมีปัญหาในการใช้งาน 
 คุณสามารถติดต่อเจ้าหน้าที่ 
 โทร. 02-113-6159`}
         </Text>
       </View>

            <View>
              <MainButton
                label="ลบบัญชี"
                color={colors.error}
                onPress={() => ('')}
              />
            </View>
          </View>
        </SafeAreaView>
    </View>
  );
};
export default DeleteAcc;

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  button: {
    height: normalize(54),
    width: normalize(343),
    alignSelf: 'center',
    },
  TextAll: {
    alignItems: 'center',
  },
  head: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.fontBlack,
    fontWeight: '300',
    textAlign: 'center',
    top: '-50%'
  },
  text: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.primary,
    fontWeight: '200',
    textAlign: 'center',
    paddingVertical: 20,
    top: '-50%'

  },
});
