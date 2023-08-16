import {Image, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../Text';
import colors from '../../assets/colors/colors';
import {image} from '../../assets';
import fonts from '../../assets/fonts';

interface Props {
  onPress?: () => void;
  children?: React.ReactNode;
}
export default function NetworkLost({onPress, children}: Props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
      }}>
      <Image
        source={image.lostNetwork}
        style={{
          height: '100%',
        }}
        resizeMode="contain"
      />
      <Text
        style={{
          fontSize: 16,
          color: colors.grey3,
          textAlign: 'center',
          fontFamily: fonts.medium,
          marginTop: 20,
        }}>
        เครือข่ายขัดข้อง กรุณาตรวจสอบการเชื่อมต่อ และลองใหม่อีกครั้ง
      </Text>
      <TouchableOpacity>
        <Text
          style={{
            fontSize: 16,
            color: colors.orange,
            textAlign: 'center',
            fontFamily: fonts.bold,
          }}>
          ลองอีกครั้ง
        </Text>
      </TouchableOpacity>
    </View>
  );
}
