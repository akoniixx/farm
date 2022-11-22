import { Button } from '@rneui/themed';
import React, {useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {font} from '../../assets';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';
import image from '../../assets/images/image';
import { MainButton } from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import {ProgressBar} from '../../components/ProgressBar';
import {normalize} from '../../functions/Normalize';
import {stylesCentral} from '../../styles/StylesCentral';

const ThirdFormScreen: React.FC<any> = ({route, navigation}) => {
  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลงทะเบียนเกษตรกร"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.inner}>
        <View style={styles.container}>
          <View style={{marginBottom: normalize(10)}}>
            <ProgressBar index={3} />
          </View>
          <Text style={styles.h3}>ขั้นตอนที่ 3 จาก 4</Text>
          <Text style={styles.h1}>สร้างแปลงเกษตร</Text>

          <View style={styles.rectangleFixed}>
            <Image style={styles.rectangle} source={image.rectangle} />
            <Text style={styles.h2}>กดเพื่อเพิ่มแปลงเกษตรของคุณ</Text>
          </View>
          <View
              style={styles.buttonAdd}>
              <Text style={styles.textaddplot} onPress={() => navigation.navigate('AddPlotScreen')}>+ เพิ่มแปลงเกษตร</Text>
            </View>
        </View>
        <View style={{backgroundColor: colors.white, zIndex: 0}}>
          <MainButton 
          label="ถัดไป" 
          color={colors.greenLight}
          onPress={() => navigation.navigate('FourthFormScreen')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ThirdFormScreen;

const styles = StyleSheet.create({
  first: {
    flex: 1,
    justifyContent: 'space-around',
  },
  inner: {
    paddingHorizontal: normalize(15),
    flex: 1,
    justifyContent: 'space-around',
  },
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
  },
  h2: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
    top: '8%',
    textAlign: 'center'
    
  },
  h3: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(14),
    color: colors.gray,
  },
  varidate: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(12),
    color: 'red',
  },
  hSheet: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(14),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },

  rectangleFixed: {
    position: 'absolute',
    top: '25%',
  },
  buttonAdd : {
    top: '55%',
    borderColor: '#1F8449' ,
    borderWidth: 1,
    borderRadius: 15 ,
    height: normalize(90),
    width: normalize(350),
    borderStyle: 'dashed'
  },
  textaddplot: {
    fontFamily: fonts.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
    textAlign: 'center',
    top: '30%'
  },
  rectangle: {
    height: normalize(160),
    width: normalize(350),
    bottom: '15%'
  },
  input: {
    display: 'flex',
    paddingHorizontal: normalize(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: normalize(56),
    marginVertical: 12,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
  },
});
