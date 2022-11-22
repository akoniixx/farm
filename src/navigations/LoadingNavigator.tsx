import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingNavigator: React.FC<any> = ({navigation}) => {
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('token');
        const fcmtoken = await AsyncStorage.getItem('fcmtoken')
        if (value !== null) {
          if(fcmtoken !== null){
            navigation.push('Main');
          }
          else{
            navigation.push('Auth');
          }
        } else {
          navigation.push('Auth');
        }
      } catch (e) {
        console.log(e, 'get async token');
      }
    };
    getData();
  }, []);
  return (
    <View style={styles.scaffold}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scaffold: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingNavigator;
