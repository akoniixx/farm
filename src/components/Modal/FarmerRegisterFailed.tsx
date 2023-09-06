import { View, Modal, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { ModalEntity } from './ModalEntity';
import { ModalStyle } from './ModalStyle';
import { MainButton } from '../Button/MainButton';
import { colors, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize, width } from '../../functions/Normalize';
import Text from '../Text/Text';

const FarmerRegisterFailed: React.FC<ModalEntity> = ({
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
              { paddingVertical: normalize(20) },
            ]}>
            {'ท่านยืนยันตัวตนไม่สำเร็จ โปรดติดต่อเจ้าหน้าที่ โทร. 02-233-9000'}
          </Text>
          <Image source={image.registerFailed} style={ModalStyle.image} />
          <MainButton
            label="ตกลง"
            color={colors.greenLight}
            fontColor={colors.white}
            fontFamily={fonts.AnuphanMedium}
            onPress={onMainClick}
            width={width * 0.65}
          />
        </View>
      </View>
    </Modal>
  );
};

export default FarmerRegisterFailed;
