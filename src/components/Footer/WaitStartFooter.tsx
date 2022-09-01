import {normalize} from '@rneui/themed';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font, icons} from '../../assets';
const insets = useSafeAreaInsets();

interface WaitStartProp {
  mainFunc: () => void;
  togleModal: () => void;
}

export const WaitStartFooter: React.FC<WaitStartProp> = ({
  mainFunc,
  togleModal,
}) => {
  return (
    <View style={[styles.footer, {paddingBottom: insets.bottom}]}>
      <TouchableOpacity style={styles.startButton} onPress={() => mainFunc()}>
        <Text
          style={{
            fontFamily: font.bold,
            fontSize: normalize(19),
            color: colors.white,
          }}>
          เริ่มทำงาน
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => togleModal()}
        style={{
          width: 52,
          height: 52,
          backgroundColor: colors.darkBlue,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: normalize(8),
        }}>
        <Image
          source={icons.callSolid}
          style={{width: normalize(20), height: normalize(20)}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  startButton: {
    width: normalize(275),
    height: normalize(52),
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(8),
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: normalize(10),
  },
});
