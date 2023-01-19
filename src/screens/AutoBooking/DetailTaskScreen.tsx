import { normalize } from '@rneui/themed';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../assets/colors/colors';
import icons from '../../assets/icons/icons';
import CustomHeader from '../../components/CustomHeader';
import {
  DateTimeDetail,
  PlotDetail,
  TargetSpray,
} from '../../components/TaskDetail/TaskDetail';
import { stylesCentral } from '../../styles/StylesCentral';

const DeatilTaskScreen: React.FC<any> = ({ navigation, route }) => (
  <View style={[{ flex: 1 }]}>
    <CustomHeader
      title="รายละเอียดการจอง"
      showBackBtn
      onPressBack={() => navigation.goBack()}
    />
    <View
      style={{
        paddingHorizontal: normalize(16),
        backgroundColor: 'white',
        marginTop: 10,
        paddingVertical: normalize(10),
      }}>
      <View style={{ flexDirection: 'row' }}>
        <Text>วันและเวลา</Text>
      </View>
      <DateTimeDetail time="18.00" date="15 พฤศจิกายน" note="-" />
    </View>

    <View
      style={{
        paddingHorizontal: normalize(16),
        backgroundColor: 'white',
        marginTop: 10,
        paddingVertical: normalize(10),
      }}>
      <View style={{ flexDirection: 'row' }}>
        <Text>แปลงเกษตร</Text>
      </View>

      <PlotDetail
        plotName="แปลง 1 ข้าวโพด"
        plotAmout={20}
        plant="ข้าวโพด"
        location="บ้านลุงตู่ จุ๊กกรู้ววววว"
      />

      <View style={{ flexDirection: 'row' }}>
        <Text>เป้าหมายการพ่น</Text>
      </View>
      <TargetSpray
        periodSpray="คุมเลน"
        target="หญ้า"
        preparationBy="เกษตรเตรียมเอง"
      />
    </View>
  </View>
);
export default DeatilTaskScreen;
