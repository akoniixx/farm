import {
  View,
  Text,
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {colors, font, icons} from '../../assets';

interface Props {
  children?: React.ReactNode;
  visible: boolean;
  title?: string | JSX.Element;
  subTitle?: string | JSX.Element;
  onPressPrimary?: () => void;
  onPressSecondary?: () => void;
  titlePrimary?: string;
  titleSecondary?: string;
  showClose?: boolean;
  onClose?: () => void;
  iconTop?: JSX.Element;
  disablePrimary?: boolean;
}
export default function Modal({
  visible,
  children,
  title,
  subTitle,
  onPressPrimary,
  onPressSecondary,
  titlePrimary = 'ยืนยัน',
  titleSecondary = 'ยกเลิก',
  showClose = false,
  onClose,
  disablePrimary = false,
  iconTop,
}: Props) {
  return (
    <RNModal transparent={true} visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}>
        {children ? (
          children
        ) : (
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingTop: 32,
              paddingBottom: 16,
              width: '100%',
              alignItems: 'center',
            }}>
            {showClose && (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 24,
                }}
                onPress={onClose}>
                <Image
                  source={icons.closeBlack}
                  style={{
                    width: 18,
                    height: 18,
                  }}
                />
              </TouchableOpacity>
            )}
            {iconTop && iconTop}

            {React.isValidElement(title) ? (
              title
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: font.medium,
                  color: colors.fontBlack,
                }}>
                {title}
              </Text>
            )}
            {React.isValidElement(subTitle) ? (
              subTitle
            ) : (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: font.light,
                  color: colors.inkLight,
                  marginTop: 8,
                }}>
                {subTitle}
              </Text>
            )}
            <TouchableOpacity
              disabled={disablePrimary}
              style={[styles.button, {marginTop: 16}]}
              onPress={() => {
                onPressPrimary && onPressPrimary();
              }}>
              <Text style={styles.textButton}>{titlePrimary}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.subButton}
              onPress={() => {
                onPressSecondary && onPressSecondary();
              }}>
              <Text style={styles.textSubButton}>{titleSecondary}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </RNModal>
  );
}
const styles = StyleSheet.create({
  textButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.white,
  },
  button: {
    width: '100%',
    backgroundColor: colors.orange,
    borderRadius: 8,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F86820',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  textSubButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.fontBlack,
  },
  subButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 8,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
});
