import {normalize} from '@rneui/themed';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, font, icons} from '../../assets';
import Icon from 'react-native-vector-icons/AntDesign'
const insets = useSafeAreaInsets();

interface CanceledProp {
  mainFunc: () => void;
}

export const CanceledFooter: React.FC<CanceledProp> = ({
  mainFunc,
}) => {
  return (
    <View style={[styles.footer, {paddingBottom: insets.bottom}]}>
      <TouchableOpacity style={styles.startButton} onPress={() => mainFunc()}>
        <Text
          style={{
            fontFamily: font.bold,
            fontSize: normalize(19),
            color: '#EB5757',
          }}>
          ติดต่อเจ้าหน้าที่
        </Text>
      </TouchableOpacity>

     
    </View>
  );
};

const styles = StyleSheet.create({
  startButton: {
    flex:1,
    height: normalize(52),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(8),
    flexDirection:'row',
    borderColor: colors.greyWhite,
    borderWidth:1,
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: normalize(10),
  },
});
