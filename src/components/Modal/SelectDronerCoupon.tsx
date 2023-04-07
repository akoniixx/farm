import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { ModalEntity } from './ModalEntity';
import { ModalStyle } from './ModalStyle';
import { MainButton } from '../Button/MainButton';
import { colors, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize, width } from '../../functions/Normalize';

const SelectDronerCouponModal: React.FC<ModalEntity> = ({
  show,
  onClose,
  onMainClick,
  onBottomClick,
  text,
}) => {
  return (
    <Modal visible={show} transparent={true}>
      <View style={ModalStyle.modal}>
        <View style={ModalStyle.modalBg}>
          <View style={ModalStyle.close}>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={icons.close}
                style={{
                  width: normalize(14),
                  height: normalize(14),
                }}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              ModalStyle.modalHeader,
              { paddingBottom: normalize(2) },
            ]}>
            ต้องการ
          </Text>
          <Text
            style={[
              ModalStyle.modalHeader,
              { paddingVertical: normalize(2) },
            ]}>
            จ้างนักบินโดรนเกษตร
          </Text>
          <Text
            style={[
              ModalStyle.modalHeader,
              { paddingTop: normalize(2), paddingBottom : normalize(20) },
            ]}>
            รูปแบบไหน?
          </Text>
          <MainButton
            label="จ้างนักบินที่เคยจ้าง"
            color={colors.greenLight}
            fontColor={colors.white}
            fontFamily={fonts.AnuphanMedium}
            onPress={onMainClick}
            width={width * 0.7}
          />
          <MainButton
            label="จ้างระบบค้นหานักบินอัตโนมัติ"
            borderColor={colors.fontBlack}
            color={colors.white}
            fontColor={colors.fontBlack}
            fontFamily={fonts.AnuphanMedium}
            onPress={onBottomClick}
            width={width * 0.7}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SelectDronerCouponModal;
