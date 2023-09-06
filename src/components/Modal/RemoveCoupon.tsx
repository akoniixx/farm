import { Image, Modal, StyleSheet, View } from 'react-native';
import React from 'react';
import { ModalEntity } from './ModalEntity';
import { ModalStyle } from './ModalStyle';
import { colors, icons, image } from '../../assets';
import { MainButton } from '../Button/MainButton';
import fonts from '../../assets/fonts';
import { width } from '../../functions/Normalize';
import { normalize } from '@rneui/themed';
import Text from '../Text/Text';

const RemoveCoupon: React.FC<ModalEntity> = ({
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
          <Image source={icons.delete} style={styles.imgModal} />
          <Text
            style={[
              ModalStyle.modalHeader,
              {
                paddingVertical: normalize(10),
              },
            ]}>
            ลบคูปองส่วนลด
          </Text>
          <Text
            style={[
              ModalStyle.modalMain,
              {
                fontFamily: fonts.SarabunMedium,
                paddingVertical: normalize(10),
              },
            ]}>
            คุณแน่ใจที่จะลบคูปองส่วนลดที่เลือก?
          </Text>
          <MainButton
            label="ยกเลิก"
            color={colors.white}
            borderColor={colors.fontBlack}
            fontColor={colors.fontBlack}
            fontFamily={fonts.AnuphanMedium}
            onPress={onClose}
            width={width * 0.7}
          />
          <MainButton
            label="ลบ"
            color={colors.error}
            fontColor={colors.white}
            fontFamily={fonts.AnuphanMedium}
            onPress={onMainClick}
            width={width * 0.7}
          />
        </View>
      </View>
    </Modal>
  );
};

export default RemoveCoupon;

const styles = StyleSheet.create({
  imgModal: {
    width: normalize(25),
    height: normalize(27),
  },
});
