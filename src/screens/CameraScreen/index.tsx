import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Camera, PhotoFile, useCameraDevices} from 'react-native-vision-camera';
import Text from '../../components/Text';
import {SafeAreaView} from 'react-native-safe-area-context';

import {colors, font, icons} from '../../assets';

export default function CameraScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const onFinished = route.params.onFinished;
  const onCancel = route.params.onCancel;
  const cameraRef = React.useRef<Camera>(null);
  const [currentImage, setCurrentImage] = React.useState<PhotoFile | null>(
    null,
  );
  const devices = useCameraDevices();
  const onTakePhoto = async () => {
    const photo = await cameraRef.current?.takePhoto({
      flash: 'auto',
      qualityPrioritization: 'speed',
      skipMetadata: Platform.OS === 'android',
    });
    if (!photo) {
      return;
    }

    setCurrentImage(photo);
  };
  const device = devices.back;
  if (!device) {
    return (
      <View>
        <Text>ไม่สามารถเข้าถึงกล้องได้</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
          onCancel();
        }}
        style={{
          position: 'absolute',
          zIndex: 10,
          top: 16,
          left: 16,
        }}>
        <Text
          style={{
            fontFamily: font.bold,
            color: colors.white,
            fontSize: 20,
          }}>
          ยกเลิก
        </Text>
      </TouchableOpacity>
      {currentImage ? (
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
          }}>
          <Image
            source={{
              uri: 'file://' + currentImage.path,
            }}
            style={{
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          />
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => {
                setCurrentImage(null);
              }}
              style={{
                padding: 16,
                borderRadius: 200,
              }}>
              <Image
                source={icons.closewhite}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onFinished(currentImage);
                navigation.goBack();
              }}
              style={{
                padding: 16,
                borderRadius: 200,
              }}>
              <Image
                source={icons.checkWhite}
                style={{
                  width: 46,
                  height: 46,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <Camera
            photo={true}
            isActive={true}
            ref={cameraRef}
            device={device}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
          <View
            style={[
              styles.footer,
              {
                justifyContent: 'center',
              },
            ]}>
            <TouchableOpacity
              onPress={onTakePhoto}
              style={{
                padding: 16,
                backgroundColor: colors.white,
                borderRadius: 200,
              }}>
              <Image
                source={icons.camera}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 10,
  },
});
