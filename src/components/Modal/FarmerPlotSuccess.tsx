import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { ModalEntity } from './ModalEntity';
import { ModalStyle } from './ModalStyle';
import { MainButton } from '../Button/MainButton';
import { colors, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize, width } from '../../functions/Normalize';

const FarmerPlotSuccess: React.FC<ModalEntity> = ({
  show,
  onClose,
  onMainClick,
  onBottomClick,
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
          <Text style={ModalStyle.modalHeader}>แปลงเกษตรของท่าน</Text>
          <Text style={ModalStyle.modalHeader}>(แปลง 3 อ้อย)</Text>
          <Text
            style={[ModalStyle.modalHeader, { paddingBottom: normalize(20) }]}>
            ได้รับการยืนยันเรียบร้อยแล้ว
          </Text>
          <Image source={image.plotFailed} style={ModalStyle.image} />
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

export default FarmerPlotSuccess;
