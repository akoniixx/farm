import {normalize} from '@rneui/themed';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font, icons} from '../../assets';
import Icon from 'react-native-vector-icons/AntDesign';

interface InprogressProp {
  mainFunc: () => void;
  togleModal: () => void;
  isProblem: boolean;
  togleModalExtend?: () => void;
  statusDelay: string;
}

export const InprogressFooter: React.FC<InprogressProp> = ({
  mainFunc,
  togleModal,
  togleModalExtend,
  statusDelay,
  isProblem,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footer, {paddingBottom: insets.bottom}]}>
      <TouchableOpacity
        style={styles.startButton}
        disabled={statusDelay === 'WAIT_APPROVE'}
        onPress={() => mainFunc()}>
        <Icon name="checkcircleo" size={22} color="white" />
        <Text
          style={{
            fontFamily: font.bold,
            fontSize: normalize(19),
            color: colors.white,
            marginLeft: 10,
          }}>
          งานเสร็จสิ้น
        </Text>
      </TouchableOpacity>
      <View
        style={{
          marginVertical: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={
            // eslint-disable-next-line no-extra-boolean-cast
            !!statusDelay || isProblem
              ? styles.extendButtonDisable
              : styles.extendButton
          }
          disabled={!!statusDelay || isProblem}
          onPress={togleModalExtend}>
          <Text
            style={{
              fontFamily: font.bold,
              fontSize: normalize(19),
              color: colors.white,
              marginLeft: 10,
            }}>
            ขยายเวลา
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => togleModal()} style={styles.telButton}>
          <Image
            source={icons.callSolid}
            style={{width: normalize(20), height: normalize(20)}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  startButton: {
    width: '100%',
    height: normalize(52),
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(8),
    flexDirection: 'row',
  },
  extendButton: {
    height: normalize(52),
    flex: 1,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(8),
    flexDirection: 'row',
    marginRight: 8,
  },
  extendButtonDisable: {
    height: normalize(52),
    flex: 1,
    backgroundColor: colors.disable,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(8),
    flexDirection: 'row',
    marginRight: 8,
  },
  telButton: {
    width: 52,
    height: normalize(52),

    backgroundColor: colors.darkBlue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(8),
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: normalize(15),
    justifyContent: 'center',
    paddingVertical: normalize(10),
    minHeight: 100,
    alignItems: 'center',
  },
});
