import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { ModalStyle } from './ModalStyle';
import { font, icons } from '../../assets';
import { normalize, width } from '../../functions/Normalize';
import { MainButton } from '../Button/MainButton';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';
import { ModalEntity } from './ModalEntity';

const VerifyStatus: React.FC<ModalEntity> = ({ show, text, onClose }) => {
  return (
    <Modal visible={show} transparent={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            marginTop: 10,
            width: '100%',
            paddingVertical: normalize(16),
            borderRadius: 12,
            paddingHorizontal: 16,
          }}>
          <Text
            style={{
              fontFamily: font.AnuphanMedium,
              fontSize: 22,
              textAlign: 'center',
            }}>
            ท่านไม่สามารถจ้าง
          </Text>
          <Text
            style={{
              fontFamily: font.AnuphanMedium,
              fontSize: 22,
              textAlign: 'center',
            }}>
            โดรนเกษตรได้ในขณะนี้ เนื่องจาก
          </Text>
          <Text
            style={{
              fontFamily: font.AnuphanMedium,
              fontSize: 22,
              textAlign: 'center',
            }}>
            {text === 'REJECTED' && 'ท่านยังยืนยันตัวตนไม่สำเร็จ'}
            {text === 'INACTIVE' && 'บัญชีของท่านปิดการใช้งาน'}
            {text === 'PENDING' && 'รอการตรวจสอบเอกสาร'}
          </Text>
          <Text
            style={{
              fontFamily: font.SarabunLight,
              textAlign: 'center',
              fontSize: 20,
              marginVertical: 16,
              lineHeight: 30,
            }}>
            {text === 'REJECTED' &&
              `กรุณาติดต่อเจ้าหน้าที่ เพื่อดำเนินการแก้ไข`}
            {text === 'INACTIVE' &&
              `กรุณาติดต่อเจ้าหน้าที่
เพื่อเปิดการใช้งานบัญชี`}
            {text === 'PENDING' &&
              `ต้องการสอบถามข้อมูล 
กรุณาติดต่อเจ้าหน้าที่`}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              height: 60,
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: colors.greenLight,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              borderRadius: 8,
              marginBottom: 8,
            }}>
            <Text
              style={{
                fontFamily: font.AnuphanMedium,
                color: colors.white,
                fontSize: 20,
              }}>
              ตกลง
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VerifyStatus;
