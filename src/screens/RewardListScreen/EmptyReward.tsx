import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors, font, image } from '../../assets';

type Props = {};

const EmptyReward = (props: Props) => {
  return (
    <View style={styles.container}>
      <Image source={image.emptyReward} style={styles.image} />
      <Text style={styles.text}>ยังไม่มีของรางวัล</Text>
    </View>
  );
};

export default EmptyReward;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: font.AnuphanMedium,
    color: colors.grey30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height - 400,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
});
