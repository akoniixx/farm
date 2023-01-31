import { Switch } from '@rneui/themed';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font } from '../../assets';
import { stylesCentral } from '../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar } from '@rneui/base';
import { normalize, width } from '../../functions/Normalize';
import image from '../../assets/images/image';
import CustomHeader from '../../components/CustomHeader';
import { MainButton } from '../../components/Button/MainButton';

const PromotionScreen: React.FC<any> = ({ navigation, route }) => {
  const [fcmToken, setFcmToken] = useState('');

  const getData = async () => {
    const value = await AsyncStorage.getItem('token');
    setFcmToken(value!);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <SafeAreaView
        style={[stylesCentral.container, { backgroundColor: '#F5FCF8' }]}>
        <CustomHeader
          title="โปรโมชั่น"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.empty}>
          <Image
            source={image.empty_coupon}
            style={{ width: 130, height: 122 }}
          />
          <View
            style={{
              alignItems: 'center',
              alignContent: 'center',
              paddingVertical: 10,
            }}>
            <Text style={styles.textEmpty}>ติดตามคูปองและสิทธิพิเศษมากมาย</Text>
            <Text style={styles.textEmpty}>ได้ที่หน้าโปรโมชั่น เร็วๆนี้ </Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
export default PromotionScreen;

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    display: 'flex',
    paddingVertical: '50%',
  },
  textEmpty: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    paddingVertical: 2,
    color: colors.gray,
    alignItems: 'center'
  },
});
