import {Image, View} from 'react-native';
import React from 'react';
import Text from '../../Text';
import {colors, font, image} from '../../../assets';
import * as ImagePicker from 'react-native-image-picker';
interface Props {
  imgFertilizer: ImagePicker.ImagePickerResponse | null;
}
export default function StepTwo({imgFertilizer}: Props) {
  return (
    <View
      style={{
        marginVertical: 16,
      }}>
      {!imgFertilizer && (
        <Text
          style={{
            fontSize: 14,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: colors.darkOrange2,
            fontFamily: font.medium,
          }}>
          ตัวอย่างภาพถ่ายปุ๋ย/ยาที่ถูกต้อง
        </Text>
      )}

      <View
        style={{
          marginTop: 16,
          borderRadius: 12,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: colors.orange,
          borderStyle: 'dashed',
          height: 160,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {imgFertilizer ? (
          <Image
            source={{uri: imgFertilizer?.assets?.[0].uri}}
            style={{
              height: 156,
              borderRadius: 12,
              width: '100%',
              position: 'absolute',
            }}
          />
        ) : (
          <Image
            source={image.defaultImageFertilizer}
            style={{
              height: 156,
              borderRadius: 12,
              width: '100%',
              position: 'absolute',
            }}
          />
        )}
      </View>
    </View>
  );
}
