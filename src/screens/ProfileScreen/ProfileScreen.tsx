import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';

import {MainButton} from '../../components/Button/MainButton';
import {colors} from '../../assets';
import {normalize} from '../../function/Normalize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Authentication } from '../../datasource/TaskDatasource';

const ProfileScreen: React.FC<any> = ({navigation}) => {
  return (
    <SafeAreaView style={stylesCentral.container}>
    <TouchableOpacity onPress={async()=>{ 
      await Authentication.logout()
      await navigation.navigate('HomeScreen')
      }}>
        <Text>Logout</Text>
    </TouchableOpacity>
    </SafeAreaView>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
  btnContainer: {
    width: normalize(343),
    marginVertical: normalize(10),
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
});
