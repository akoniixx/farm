import {View, Image, TouchableOpacity, PermissionsAndroid} from 'react-native';
import React, {useEffect} from 'react';
import Modal from './Modal';
import {colors, font, icons} from '../../assets';
import Text from '../Text';

interface Props {
  visible: boolean;

  onPressLibrary: () => void;
  onPressCamera: () => void;
}

export default function ModalUploadImage({
  visible,

  onPressLibrary,
  onPressCamera,
}: Props) {
  useEffect(() => {
    const requestPermission = async () => {
      const result = await PermissionsAndroid.request(
        'android.permission.CAMERA',
      );
    };
    requestPermission();
  }, []);
  const staticSelect = [
    {
      label: 'ถ่ายภาพ',
      onPress: () => {
        onPressCamera();
      },
      icon: icons.cameraGray,
    },
    {
      label: 'เลือกจากคลังภาพ',
      onPress: () => {
        onPressLibrary();
      },
      icon: icons.imageStorage,
    },
  ];
  return (
    <View>
      <Modal visible={visible}>
        <View
          style={{
            backgroundColor: 'white',

            borderRadius: 12,
            width: '100%',
            borderWidth: 1,
            borderColor: colors.disable,
            paddingVertical: 8,
          }}>
          {staticSelect.map((el, idx) => {
            const isFirst = idx === 0;
            return (
              <TouchableOpacity
                onPress={el.onPress}
                style={{
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  borderBottomColor: colors.disable,
                  borderBottomWidth: isFirst ? 1 : 0,
                  width: '100%',
                }}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: 20,
                  }}>
                  {el.label}
                </Text>
                <Image
                  source={el.icon}
                  style={{
                    width: 28,
                    height: 28,
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </View>
  );
}
