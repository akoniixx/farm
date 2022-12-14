import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import { normalize } from '../../functions/Normalize';

const DronerBooking: React.FC<any> = ({navigation}) => {
  const [fcmToken, setFcmToken] = useState('');
  const getToken = async () => {
    const token = await AsyncStorage.getItem('fcmtoken');
    setFcmToken(token!);
  };

  useEffect(() => {
    getToken();
  });
  return (
    <>
      {fcmToken !== null ? (
        <View></View>
      ) : (
        <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title="จ้างโดรนเกษตร"
          showBackBtn
          onPressBack={() => navigation.goBack()
        }
        />
      </SafeAreaView>
      )}
    </>
  );
};
export default DronerBooking;
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inner: {
        paddingHorizontal: normalize(17),
        flex: 1,
        justifyContent: 'space-around',
      },
  });
