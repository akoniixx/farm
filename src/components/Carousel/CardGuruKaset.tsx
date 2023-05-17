import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {font, icons, image} from '../../assets';
import colors from '../../assets/colors/colors';
import {normalize} from '../../function/Normalize';

interface guruData {
  background: any;
}
export const CardGuruKaset: React.FC<guruData> = ({background}) => {
  return (
    <View
      style={{
        padding: normalize(10),
      }}>
      <View style={styles.card}>
        <Image
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          borderBottomLeftRadius={10}
          borderBottomRightRadius={10}
          style={{height: normalize(120)}}
          source={{uri: background}}
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
    fontFamily: font.bold,
    color: colors.gray,
    lineHeight: 24,
  },
  textDate: {
    fontSize: 16,
    fontFamily: font.light,
    color: colors.gray,
    lineHeight: 24,
  },
});
