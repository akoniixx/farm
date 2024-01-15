import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { usePoint } from '../../contexts/PointContext';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons } from '../../assets';
import { formatNumberWithComma } from '../../utils/ formatNumberWithComma';

// type Props = {};

const ShowCurrentPoint = () => {
  const { currentPoint } = usePoint();
  return (
    <View style={styles.containerPoint}>
      <Image
        source={icons.ICKPoint}
        style={{
          width: normalize(35),
          height: normalize(35),
        }}
      />
      <Text style={styles.textPoint}>
        {formatNumberWithComma(currentPoint || '0')} แต้ม
      </Text>
    </View>
  );
};

export default ShowCurrentPoint;

const styles = StyleSheet.create({
  textPoint: {
    fontFamily: font.AnuphanBold,
    color: colors.fontBlack,
    fontSize: normalize(18),
    marginLeft: normalize(15),
    marginRight: normalize(5),
  },
  containerPoint: {
    borderRadius: normalize(10),
    borderWidth: normalize(1),
    borderColor: colors.greenLight,
    height: '100%',
    width: normalize(330),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowRadius: normalize(30),
    backgroundColor: colors.greenBackground,
    shadowColor: colors.greenLight,
    shadowOpacity: 0.4,
  },
});
