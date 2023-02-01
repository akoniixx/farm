import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { ModalEntity } from './ModalEntity';
import { ModalStyle } from './ModalStyle';
import { icons } from '../../assets';
import { normalize, width } from '../../functions/Normalize';
import { MainButton } from '../Button/MainButton';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';

const DronerFailedModal: React.FC<ModalEntity> = ({
  show,
  onClose,
  onMainClick,
  onBottomClick,
}) => {
  return (
    <Modal visible={show} transparent={true}>
      <View style={ModalStyle.modal}>
        <View style={ModalStyle.modalBg}>
          <Text style={ModalStyle.modalHeader}>ขออภัย !</Text>
          <Text
            style={[ModalStyle.modalHeader, { paddingBottom: normalize(20) }]}>
            ขณะนี้มีผู้ใช้งานจำนวนมาก
          </Text>
          <Text style={ModalStyle.modalMain}>
            ท่านสามารถกด ค้นหานักบินโดรนอีกครั้ง
          </Text>
          <Text style={ModalStyle.modalMain}>
            เพื่อค้นหาต่อไป หรือ กดติดตามเจ้าหน้าที่
          </Text>
          <Text
            style={[ModalStyle.modalMain, { paddingBottom: normalize(20) }]}>
            เพื่อให้ช่วยในการค้นหานักบินโดรน
          </Text>
          <MainButton
            label="ตืดต่อเจ้าหน้าที่"
            color={colors.blueLight}
            fontColor={colors.white}
            fontFamily={fonts.AnuphanMedium}
            onPress={onMainClick}
            width={width * 0.65}
          />
          <MainButton
            label="ค้นหานักบินโดรนอีกครั้ง"
            color={colors.white}
            fontColor={colors.fontBlack}
            fontFamily={fonts.AnuphanMedium}
            onPress={onBottomClick}
            borderColor={colors.fontBlack}
            width={width * 0.65}
          />
        </View>
      </View>
    </Modal>
  );
};

export default DronerFailedModal;
