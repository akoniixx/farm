import {
  View,
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { colors, font, icons } from '../../assets';
import AsyncButton from '../Button/AsyncButton';
import Text from '../Text/Text';

interface Props {
  children?: React.ReactNode;
  visible: boolean;
  title?: string | JSX.Element;
  subTitle?: string | JSX.Element;
  onPressPrimary?: () => void | Promise<void>;
  onPressSecondary?: () => void;
  titlePrimary?: string;
  titleSecondary?: string;
  showClose?: boolean;
  onClose?: () => void;
  iconTop?: JSX.Element;
  disablePrimary?: boolean;
  noBackdrop?: boolean;
  subButtonType?: 'noBorder' | 'border';
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
  noBackdrop = false,
  subButtonType = 'noBorder',
}: Props) {
  function isPromise(func: any) {
    return Promise.resolve(func) instanceof Promise;
  }
  const [loading, setLoading] = useState(false);
  return (
    <RNModal transparent={true} visible={visible} animationType="fade">
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: noBackdrop ? 'transparent' : 'rgba(0,0,0,0.5)',
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
              paddingTop: 20,
              paddingBottom: 16,
              width: '100%',
              alignItems: 'center',
            }}>
            {showClose && (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}
                onPress={onClose}>
                <Image
                  source={icons.closeBlack}
                  style={{
                    width: 32,
                    height: 32,
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
                  fontSize: 22,
                  fontFamily: font.AnuphanSemiBold,
                  color: colors.fontBlack,
                }}>
                {title}
              </Text>
            )}
            {React.isValidElement(subTitle) ? (
              subTitle
            ) : (
              <>
                {subTitle ? (
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: font.SarabunMedium,
                      color: colors.inkLight,
                      marginTop: 8,
                    }}>
                    {subTitle}
                  </Text>
                ) : null}
              </>
            )}
            <AsyncButton
              style={{
                marginTop: 24,
              }}
              disabled={disablePrimary}
              isLoading={loading}
              title={titlePrimary}
              onPress={async () => {
                const isPM = isPromise(onPressPrimary);
                if (isPM) {
                  try {
                    setLoading(true);
                    await onPressPrimary?.();
                  } catch (e) {
                    console.log(e);
                  } finally {
                    setLoading(false);
                  }
                } else {
                  onPressPrimary?.();
                }
              }}
            />
            <TouchableOpacity
              style={
                subButtonType === 'border'
                  ? styles.subButton
                  : styles.subButtonNoBorder
              }
              onPress={() => {
                onPressSecondary && onPressSecondary();
              }}>
              <Text style={styles.textSubButton}>{titleSecondary}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
    </RNModal>
  );
}
const styles = StyleSheet.create({
  textButton: {
    fontSize: 18,
    fontFamily: font.AnuphanSemiBold,

    color: colors.white,
  },
  button: {
    width: '100%',
    backgroundColor: colors.orange,
    borderRadius: 8,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.greenLight,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  textSubButton: {
    fontSize: 18,
    fontFamily: font.AnuphanSemiBold,
    color: colors.fontBlack,
  },
  subButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 8,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.grey40,
  },
  subButtonNoBorder: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 8,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
});
