import { View, TouchableOpacity, Platform, Linking, Image } from 'react-native';
import React from 'react';
import { colors, font, icons } from '../../assets';
import { Camera, PhotoFile } from 'react-native-vision-camera';
import { navigate } from '../../navigations/RootNavigation';
import Text from '../Text/Text';
import Modal from './Modal';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onPressLibrary: () => void;
  onPressCamera: () => void;
  onFinishedTakePhotoAndroid: (v: any) => void;
  onCloseModalSelect: () => void;
}

export default function ModalUploadImage({
  visible,
  onCancel,
  onPressLibrary,
  onPressCamera,
  onFinishedTakePhotoAndroid,
  onCloseModalSelect,
}: Props) {
  const fetchImage = async (uri: string) => {
    const imageResponse = await fetch(uri);
    const imageBlob = await imageResponse.blob();

    return imageBlob;
  };

  // const blobToBase64 = (blob: any): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onerror = reject;
  //     reader.onload = () => {
  //       resolve(String(reader.result));
  //     };
  //     reader.readAsDataURL(blob);
  //   });
  // };

  const onResultBack = async (value: PhotoFile) => {
    const blob: any = await fetchImage('file://' + value.path);
    const {
      _data: { name: fileName, type, size },
    } = blob;
    onFinishedTakePhotoAndroid({
      assets: [
        {
          uri: 'file://' + value.path,
          fileName,
          type,
          fileSize: size,
        },
      ],
    });
    onCancel();
  };
  const onOpenCamera = async () => {
    if (Platform.OS === 'android') {
      const alreadyHasPermission = await Camera.getCameraPermissionStatus();
      if (alreadyHasPermission === 'authorized') {
        navigate('CameraScreen', {
          onFinished: onResultBack,
          onCancel: onCancel,
        });
        onCloseModalSelect();

        return;
      }
      const requested = await Camera.requestCameraPermission();
      if (requested === 'authorized') {
        navigate('CameraScreen', {
          onFinished: onResultBack,
          onCancel: onCancel,
        });
        onCloseModalSelect();
      } else {
        await Linking.openSettings();
      }
    }
  };
  const staticSelect = [
    {
      label: 'ถ่ายภาพ',
      onPress: () => {
        Platform.OS === 'android' ? onOpenCamera() : onPressCamera();
        // onPressCamera();
      },
      id: 1,
      icon: icons.camera,
    },
    {
      id: 2,
      label: 'เลือกรูปภาพ',
      onPress: () => {
        onPressLibrary();
      },
      icon: icons.selectImage,
    },
    {
      id: 3,
      label: 'ยกเลิก',
      onPress: () => {
        onCancel();
      },
    },
  ];

  return (
    <View>
      <Modal visible={visible} onClose={onCancel}>
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
            const isLast = idx === staticSelect.length - 1;
            if (isLast) {
              return (
                <TouchableOpacity
                  key={el.id}
                  onPress={el.onPress}
                  style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 16,
                    //   borderBottomColor: colors.disable,
                    //   borderBottomWidth: isLast ? 0 : 1,
                    width: '100%',
                    height: 70,
                  }}>
                  <Text
                    style={{
                      fontFamily: font.AnuphanMedium,
                      fontSize: 24,
                    }}>
                    {el.label}
                  </Text>
                  {/* {el.icon && (
                  <Image
                    source={el.icon}
                    style={{
                      width: 28,
                      height: 28,
                    }}
                  />
                )} */}
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={el.id}
                onPress={el.onPress}
                style={{
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 16,
                  //   borderBottomColor: colors.disable,
                  //   borderBottomWidth: isLast ? 0 : 1,
                  width: '100%',
                  height: 70,
                }}>
                <Text
                  style={{
                    fontFamily: font.AnuphanMedium,
                    fontSize: 24,
                    lineHeight: 36,
                  }}>
                  {el.label}
                </Text>
                {el.icon && (
                  <Image
                    resizeMode="contain"
                    source={el.icon}
                    style={{
                      width: el.id === 1 ? 28 : 24,
                      height: el.id === 1 ? 28 : 24,
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </View>
  );
}
