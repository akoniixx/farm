import {
  View,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Modal from './Modal';
import {colors, font, icons} from '../../assets';
import Text from '../Text';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onPressLibrary: () => void;
  onPressCamera: () => void;
}

export default function ModalUploadImage({
  visible,
  onCancel,
  onPressLibrary,
  onPressCamera,
}: Props) {
  const cameraRef = useRef<Camera>(null);
  const [isCamera, setIsCamera] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;
  console.log('devices', JSON.stringify(devices, null, 2));
  console.log('show', isCamera);

  const onOpenCamera = async () => {
    setIsCamera(true);

    if (Platform.OS === 'android') {
      const alreadyHasPermission = await Camera.getCameraPermissionStatus();
      if (alreadyHasPermission === 'authorized') {
        setIsCamera(true);
        return;
      }
      const requested = await Camera.requestCameraPermission();
      if (requested === 'authorized') {
        setIsCamera(true);
      } else {
        onCancel();
        Alert.alert('ไม่สามารถเข้าถึงกล้องได้');
      }
    }
  };
  const staticSelect = [
    {
      label: 'ถ่ายภาพ',
      onPress: () => {
        onOpenCamera();
        // onPressCamera();
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
    {
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
      {device && devices?.back ? (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          photo={true}
          isActive={true}
        />
      ) : null}
    </View>
  );
}
