import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { font, image } from '../../assets';
import colors from '../../assets/colors/colors';
import { normalize } from '../../functions/Normalize';
import ProgressiveImage from '../ProgressingImage/ProgressingImage';
interface guruData {
  background: any;
}
export const CardGuruKaset: React.FC<guruData> = ({ background }) => {
  return (
    <View
      style={{
        padding: 10,
      }}>
      <View style={styles.card}>
        <ProgressiveImage
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          borderBottomLeftRadius={10}
          borderBottomRightRadius={10}
          style={{ height: normalize(130) }}
          source={background === '' ? image.bg_droner : { uri: background }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width - normalize(30),
    borderWidth: 0.3,
    borderColor: '#D9DCDF',
    margin: normalize(5),
    borderRadius: normalize(10),
  },
  text: {
    fontSize: 20,
    fontFamily: font.AnuphanBold,
    color: colors.fontGrey,
    lineHeight: 24,
  },
  textDate: {
    fontSize: 16,
    fontFamily: font.SarabunLight,
    color: colors.fontGrey,
    lineHeight: 24,
  },
});
