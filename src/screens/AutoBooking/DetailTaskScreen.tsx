import { normalize } from '@rneui/themed';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import { stylesCentral } from '../../styles/StylesCentral';

const DeatilTaskScreen: React.FC<any> = ({ navigation, route }) => {
  return (
    <View style={[{ flex: 1 }]}>
      <CustomHeader
        title="รายละเอียดการจอง"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: normalize(16),
          backgroundColor: 'white',
          marginTop: 10,
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Text>วันและเวลา</Text>
        </View>
        <View
          style={{
            padding: normalize(10),
            backgroundColor: '#FFF2E3',
            borderRadius: 10,
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Text>วันที่</Text>
            <Text>16 พฤศจิกายน 2565</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default DeatilTaskScreen;
