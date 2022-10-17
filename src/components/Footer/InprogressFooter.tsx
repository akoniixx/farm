import {normalize} from '@rneui/themed';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font, icons} from '../../assets';
import Icon from 'react-native-vector-icons/AntDesign';
const insets = useSafeAreaInsets();

interface InprogressProp {
  mainFunc: () => void;
  togleModal: () => void;
}

export const InprogressFooter: React.FC<InprogressProp> = ({
  mainFunc,
  togleModal,
}) => {
  return (
    <View style={[styles.footer, {paddingBottom: insets.bottom}]}>
      <TouchableOpacity style={styles.startButton} onPress={() => mainFunc()}>
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
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(8),
    flexDirection: 'row',
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: normalize(10),
  },
});
