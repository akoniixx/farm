import { Dimensions, Image, View } from 'react-native';
import React from 'react';
import Text from '../../components/Text/Text';
import { colors, font, image } from '../../assets';

export default function EmptyDronerList() {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: Dimensions.get('window').height - 300,
      }}>
      <Image
        source={image.emptyDronerList}
        style={{
          width: 150,
          height: 150,
        }}
      />
      <Text
        style={{
          fontFamily: font.SarabunLight,
          fontSize: 20,
          color: colors.grey40,
          marginTop: 16,
        }}>
        ไม่มีนักบินโดรน
      </Text>
    </View>
  );
}
