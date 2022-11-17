import React from 'react';
import {font} from '../assets';
import {View, Text, Image} from 'react-native';
import icons from '../assets/icons/icons';
import { normalize } from '../functions/Normalize';

const toastStyle = {
  backgroundColor: '#3EBD93',
  borderRadius: 16,
  width: '90%',
  height: normalize(90),
};

const text1Style = {
  color: '#FFFFFF',
  fontFamily: font.AnuphanBold,
  fontSize: normalize(16),
  paddignLeft: 10,
};

const text2Style = {
  color: '#FFFFFF',
  fontFamily: font.AnuphanLight,
  fontSize: normalize(16),
  paddignLeft: 10,
};

export const toastConfig = {
  receiveTaskSuccess: ({text1, text2, props}: any) => (
    <View
      style={{
        ...toastStyle,
        paddingLeft: 20,
        paddingRight: 20,
        display: 'flex',
        flexDirection: 'row',
      }}>
      <View
        style={{
          width: '10%',
          justifyContent: 'center',
        }}>
        {/* <Image
          source={icons.checkSolid}
          style={{
            width: normalize(24),
            height: normalize(24),
          }}
        /> */}
      </View>
      <View
        style={{
          width: '90%',
          paddingLeft: 6,
          justifyContent: 'center',
        }}>
        <Text style={{...text1Style}}>{text1}</Text>
        <Text style={{...text2Style}}>{text2}</Text>
      </View>
    </View>
  ),
};
