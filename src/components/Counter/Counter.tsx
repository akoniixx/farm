import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors, font} from '../../assets';
interface Props {
  count: number;
  setCount: (count: number) => void;
  isLimit?: boolean;
  isDisablePlus: boolean;
  isDisableMinus: boolean;
}

export default function Counter({
  count,
  setCount,
  isLimit = false,
  isDisablePlus = false,
  isDisableMinus = false,
}: Props) {
  const handleIncrease = () => {
    setCount(count + 1);
  };
  const handleDecrease = () => {
    setCount(count - 1);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={isDisableMinus}
        onPress={handleDecrease}
        style={styles.button}>
        <Text style={styles.fontButton}>-</Text>
      </TouchableOpacity>
      <Text style={styles.countText}>{count}</Text>
      <TouchableOpacity
        disabled={isLimit || isDisablePlus}
        onPress={handleIncrease}
        style={styles.button}>
        <Text style={styles.fontButton}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    padding: 16,
  },
  countText: {
    fontSize: 22,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'center',
  },
  button: {
    padding: 8,
    width: 30,
    height: 30,

    backgroundColor: colors.softGrey2,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontButton: {
    fontSize: 24,
    fontFamily: font.medium,
    color: colors.fontBlack,
    lineHeight: 22,
  },
});
