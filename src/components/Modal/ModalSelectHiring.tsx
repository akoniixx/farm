import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React, { useMemo } from 'react';
import Modal from './Modal';
import Text from '../Text/Text';
import { colors, font, icons, image } from '../../assets';
import { mixpanel } from '../../../mixpanel';
import { callcenterNumber } from '../../definitions/callCenterNumber';

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  taskSugUsed: any[];
  onPressAutoBooking: () => void;
  onPressManualBooking: () => void;
}
export default function ModalSelectHiring({
  visible,
  setVisible,
  onPressAutoBooking,
  onPressManualBooking,
  taskSugUsed,
}: Props) {
  const { listButtons, isDisableTaskSugUsed } = useMemo(() => {
    const list = [
      {
        title: 'ระบบเลือกให้',
        onPress: onPressAutoBooking,
        image: image.autoBookingHire,
        disabled: false,
        backgroundColor: colors.greenLight,
        disableImage: '',
      },
    ];
    list.push({
      title: 'เลือกนักบินเอง',
      onPress: onPressManualBooking,
      image: image.manualBookingHire,
      disableImage: image.disableManualBooking,
      disabled: taskSugUsed.length > 0 ? false : true,
      backgroundColor: colors.orange,
    });
    return {
      listButtons: list,
      isDisableTaskSugUsed: taskSugUsed.length > 0 ? false : true,
    };
  }, [taskSugUsed, onPressAutoBooking, onPressManualBooking]);
  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setVisible(false);
          }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}>
          <Image
            source={icons.close}
            style={{
              width: 18,
              height: 18,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: font.AnuphanSemiBold,
            fontSize: 22,
          }}>
          คุณต้องการ
        </Text>
        <Text
          style={{
            fontFamily: font.AnuphanSemiBold,
            fontSize: 22,
          }}>
          จ้างนักบินโดรนเกษตรแบบไหน?
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginTop: 16,
          }}>
          {listButtons.map(el => {
            return (
              <TouchableOpacity
                disabled={el.disabled}
                onPress={el.onPress}
                style={[
                  styles.button,
                  {
                    backgroundColor: el.disabled
                      ? colors.greyDivider
                      : el.backgroundColor,
                  },
                ]}>
                <Image
                  source={el.disabled ? el.disableImage : el.image}
                  style={{
                    width: 80,
                    height: 80,
                  }}
                />

                <Text
                  style={[
                    styles.textButton,
                    el.disabled && {
                      color: colors.grey20,
                    },
                  ]}>
                  {el.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {isDisableTaskSugUsed && (
          <View style={styles.containerWarning}>
            <View
              style={{
                backgroundColor: '#FFF9F2',
                padding: 16,
                borderRadius: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Image
                  source={icons.warningIcon}
                  style={{
                    marginTop: 4,
                    width: 18,
                    height: 18,
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    fontFamily: font.SarabunLight,
                    fontSize: 18,
                    paddingRight: 16,
                    alignSelf: 'flex-start',
                  }}>
                  คุณยังไม่เคยจ้างนักบินในแอปฯ หาก ต้องการ “เลือกนักบินเอง” หรือ
                  นักบินที่ เคยจ้างในพื้นที่ กรุณาติดต่อเจ้าหน้าที่
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  mixpanel.track('Tab callcenter from select hiring');
                  Linking.openURL(`tel:${callcenterNumber}`);
                }}
                style={{
                  backgroundColor: colors.white,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.blueBorder,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 50,
                  marginTop: 16,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 8,
                    }}
                    source={icons.callingDarkblue}
                  />
                  <Text
                    style={{
                      fontFamily: font.AnuphanMedium,
                      color: colors.blueDark,
                      fontSize: 20,
                    }}>
                    โทรหาเจ้าหน้าที่
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 250,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },

  button: {
    flex: 0.48,
    height: 150,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    fontFamily: font.AnuphanSemiBold,
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
    marginTop: 8,
  },
  containerWarning: {
    padding: 16,
    backgroundColor: colors.white,
  },
});
