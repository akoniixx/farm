import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../../Text';
import {colors, font, image} from '../../../assets';
import {Image} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

interface Props {
  error?: string;
  onPressToSeeDemo: () => void;
  imgController: ImagePicker.ImagePickerResponse | null;
}
export default function StepOne({
  onPressToSeeDemo,
  imgController,
  error,
}: Props) {
  // const [demoModal, setDemoModal] = useState(false);

  return (
    <View
      style={{
        marginVertical: 16,
      }}>
      {!imgController && (
        <>
          <Text
            style={{
              fontSize: 14,
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              color: colors.darkOrange2,
              fontFamily: font.medium,
            }}>
            ตัวอย่างภาพถ่าย หรือภาพแคปเจอร์หน้าจอ
          </Text>
          <Text
            style={{
              color: colors.darkOrange2,
              fontFamily: font.medium,
              fontSize: 14,
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
            งานเสร็จสิ้นครั้งนี้จากแอปฯ หรือ Controller
          </Text>
        </>
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
        <Image
          source={
            imgController
              ? {uri: imgController?.assets?.[0].uri}
              : image.bgSelectControllerImage
          }
          style={{
            height: 156,
            borderRadius: 12,
            width: '100%',
            position: 'absolute',
          }}
        />
        {!imgController && (
          <TouchableOpacity
            onPress={onPressToSeeDemo}
            style={{
              borderWidth: 1,
              borderColor: colors.orange,
              borderRadius: 20,
              padding: 8,
              minHeight: 46,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.white,
            }}>
            <Text
              style={{
                color: colors.orange,
                fontFamily: font.bold,
              }}>
              ดูภาพตัวอย่าง
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Text
            style={{
              color: colors.decreasePoint,
              fontFamily: font.medium,
            }}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}
