import React from 'react';
import { Image, Text, View } from 'react-native';
import { font, image } from '../../assets';
import { normalize } from '../../functions/Normalize';

export const EmptyTask = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={image.emptyTask}
        style={{
          width: normalize(140),
          height: normalize(140),
          marginBottom: normalize(20),
        }}
      />
      <Text
        style={{
          fontFamily: font.SarabunMedium,
          color: '#8D96A0',
          fontSize: normalize(18),
        }}>
        ยังไม่มีงานจ้าง
      </Text>
    </View>
  );
};
