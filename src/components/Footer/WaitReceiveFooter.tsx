import {normalize} from '@rneui/themed';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font, icons} from '../../assets';
const insets = useSafeAreaInsets();

interface WaitReceiveProp {
  mainFunc: () => void;
  togleModal: () => void;
  // updatedAt: string;
}

export const WaitReceiveFooter: React.FC<WaitReceiveProp> = ({
  mainFunc,
  togleModal,
}) => {
  return (
    <View style={[styles.footer, {paddingBottom: insets.bottom}]}>
      <TouchableOpacity style={styles.receiveFooter} onPress={() => mainFunc()}>
        <Text
          style={{
            fontFamily: font.bold,
            fontSize: normalize(19),
            color: colors.white,
          }}>
          รับงานนี้
        </Text>
        {/* <View>
          <Text
            style={{
              fontFamily: font.bold,
              fontSize: normalize(19),
              color: colors.white,
            }}>
            {'เวลา'}
          </Text>
        </View> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  receiveFooter: {
    width: normalize(355),
    height: normalize(52),
    backgroundColor: colors.green,
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
