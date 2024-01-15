import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import icons from '../../assets/icons/icons';
import Text from '../Text/Text';
import { colors } from '../../assets';

type Props = {
  preparationRemark?: string;
};

const PreparationRemark = ({ preparationRemark }: Props) => {
  if (!preparationRemark) {
    return null;
  }
  return (
    <View style={styles.containerRow}>
      <Image source={icons.document} style={styles.icon} />
      <Text style={styles.text}>{preparationRemark}</Text>
    </View>
  );
};

export default PreparationRemark;

const styles = StyleSheet.create({
  containerRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 6,
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 5,
  },
  text: {
    color: colors.grey60,
    fontSize: 16,
  },
});
