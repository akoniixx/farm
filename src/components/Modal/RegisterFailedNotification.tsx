import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {normalize} from '../../function/Normalize';
import {responsiveHeigth, responsiveWidth} from '../../function/responsive';
import {icons} from '../../assets';
import fonts from '../../assets/fonts';
import colors from '../../assets/colors/colors';

interface RegisterFailedModalNotiFication {
  onClick?: () => void;
  onClose?: () => void;
  value: boolean;
}

const RegisterFailedNotification: React.FC<RegisterFailedModalNotiFication> = ({
  onClick,
  onClose,
  value,
}) => {
  return (
    <Modal transparent={true} visible={value}>
      <View style={styles.modal}>
        <TouchableOpacity onPress={onClick}>
          <View style={styles.modalBg}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={icons.closecircle}
                style={{
                  width: normalize(30),
                  height: normalize(30),
                }}
              />
              <View
                style={{
                  paddingLeft: normalize(12),
                }}>
                <Text style={styles.info}>ท่านยืนยันตัวตนไม่สำเร็จ</Text>
                <Text style={styles.info}>โปรดติดต่อเจ้าหน้าที่</Text>
                <Text style={styles.info}>โทร 02-1136159</Text>
              </View>
            </View>
            <View
              style={{
                height: responsiveHeigth(59),
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={onClose}>
                <Image
                  source={icons.closewhite}
                  style={{
                    width: normalize(12),
                    height: normalize(12),
                  }}
                />
              </TouchableOpacity>
              <View />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height:
      Platform.OS === 'ios' ? responsiveHeigth(170) : responsiveWidth(100),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBg: {
    width: responsiveWidth(345),
    height: responsiveHeigth(89),
    borderRadius: responsiveWidth(16),
    backgroundColor: '#EB5757',
    paddingVertical: responsiveHeigth(15),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    fontSize: normalize(16),
    fontFamily: fonts.medium,
    color: colors.white,
  },
});

export default RegisterFailedNotification;
