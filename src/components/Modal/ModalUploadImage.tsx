import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import React from 'react';
import Modal from './Modal';
import {colors, font, icons} from '../../assets';
import Text from '../Text';
import {Camera, PhotoFile} from 'react-native-vision-camera';
import {navigate} from '../../navigations/RootNavigation';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onPressLibrary: () => void;
  onPressCamera: () => void;
  onFinishedTakePhoto: (v: any) => void;
  onCloseModalSelect: () => void;
}

export default function ModalUploadImage({
  visible,
  onCancel,
  onPressLibrary,
  onPressCamera,
  onFinishedTakePhoto,
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
      _data: {name: fileName, type, size},
    } = blob;
    onFinishedTakePhoto({
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
      },
      icon: icons.cameraGray,
      id: 1,
    },
    {
      id: 2,
      label: 'เลือกจากคลังภาพ',
      onPress: async () => {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'ขออนุญาติเข้าถึงไฟล์',
              message: 'แอปต้องการเข้าถึงไฟล์ของคุณ',
              buttonPositive: 'ตกลง',
              buttonNegative: 'ยกเลิก',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            onPressLibrary();
          } else {
            onCancel();
          }
        } else {
          onPressLibrary();
        }
      },
      icon: icons.imageStorage,
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
                    borderBottomColor: colors.disable,
                    borderBottomWidth: isLast ? 0 : 1,
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      fontFamily: font.bold,
                      fontSize: 20,
                      color: colors.orange,
                    }}>
                    {el.label}
                  </Text>
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
                  borderBottomColor: colors.disable,
                  borderBottomWidth: isLast ? 0 : 1,
                  width: '100%',
                }}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: 20,
                  }}>
                  {el.label}
                </Text>
                {el.icon && (
                  <Image
                    source={el.icon}
                    style={{
                      width: 28,
                      height: 28,
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
