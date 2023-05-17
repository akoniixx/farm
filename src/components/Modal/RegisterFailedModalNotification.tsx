import {
  View,
  Text,
  Modal,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {normalize} from '@rneui/themed';
import {colors, icons} from '../../assets';
import {MainButton} from '../Button/MainButton';
import fonts from '../../assets/fonts';
import image from '../../assets/images/image';
import {
  callCenterDash,
  callcenterNumber,
} from '../../definitions/callCenterNumber';

interface RegisterFailedModalNotiFication {
  onClick?: () => void;
  onClose?: () => void;
  value: boolean;
}
const width = Dimensions.get('screen').width;
const RegisterFailedModal: React.FC<RegisterFailedModalNotiFication> = ({
  onClick,
  onClose,
  value,
}) => {
  return (
    <Modal transparent={true} visible={value}>
      <View style={styles.modal}>
        <View style={styles.modalBg}>
          <View style={styles.close}>
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
          <Image
            source={image.registerfailednoti}
            style={{
              marginVertical: normalize(20),
            }}
          />
          <Text style={styles.modalHeader}>ท่านยืนยันตัวตนไม่สำเร็จ</Text>
          <Text style={styles.modalMain}>
            โปรดติดต่อเจ้าหน้าที่ โทร {callCenterDash()}
          </Text>
          <View
            style={{
              width: '100%',
            }}>
            <MainButton
              label="ติดต่อเจ้าหน้าที่"
              color={colors.orange}
              fontColor={colors.white}
              onPress={onClick}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    top: normalize(20),
    right: normalize(20),
  },
  modalBg: {
    position: 'relative',
    backgroundColor: colors.white,
    width: width * 0.8,
    paddingVertical: normalize(30),
    paddingHorizontal: normalize(20),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(8),
  },
  modalHeader: {
    color: colors.fontBlack,
    fontFamily: fonts.medium,
    fontSize: normalize(19),
  },
  modalMain: {
    color: colors.disable,
    fontFamily: fonts.medium,
    fontSize: normalize(16),
    paddingTop: normalize(5),
    paddingBottom: normalize(10),
  },
});
export default RegisterFailedModal;
