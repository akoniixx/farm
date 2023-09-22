import { View, Modal, Linking, Dimensions } from 'react-native';
import React from 'react';
import Text from '../Text/Text';
import { colors, font } from '../../assets';
import { MainButton } from '../Button/MainButton';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
}
export default function ModalRequestPermission({
  visible,
  onRequestClose,
}: Props) {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}>
        <View
          style={{
            backgroundColor: colors.white,
            width: '100%',
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: 8,
          }}>
          <Text
            style={{
              fontFamily: font.AnuphanMedium,
              fontSize: 22,
              textAlign: 'center',
            }}>
            กรุณาเปิดการตั้งค่า {'\n'} การเข้าถึงตำแหน่งของคุณ
          </Text>

          <Text
            style={{
              fontFamily: font.SarabunLight,
              fontSize: 18,
              lineHeight: 28,
              marginTop: 8,
            }}>
            เพื่อช่วยในการค้นหานักบินโดรน
          </Text>
          <MainButton
            style={{
              width: Dimensions.get('window').width - 64,
              height: 54,
              marginTop: 20,
            }}
            label="ตกลง"
            color={colors.greenLight}
            onPress={() => {
              Linking.openSettings();
              onRequestClose();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
