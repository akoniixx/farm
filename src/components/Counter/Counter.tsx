import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors, font} from '../../assets';
import Text from '../Text';
interface Props {
  count: number;
  setCount: (count: number) => void;
  isLimit?: boolean;
  isDisablePlus: boolean;
  isDisableMinus: boolean;
  remaining?: number;
}

export default function Counter({
  count,
  setCount,
  isLimit = false,
  isDisablePlus = false,
  isDisableMinus = false,
  remaining,
}: Props) {
  const handleIncrease = () => {
    setCount(count + 1);
  };
  const handleDecrease = () => {
    setCount(count - 1);
  };
  const checkRemaining = remaining && remaining <= count;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={isDisableMinus}
        onPress={handleDecrease}
        style={[
          styles.button,
          {
            opacity: isDisableMinus ? 0.5 : 1,
          },
        ]}>
        <Text style={styles.fontButton}>-</Text>
      </TouchableOpacity>
      <Text
        style={[
          styles.countText,
          {
            opacity: isDisablePlus || isLimit ? 0.5 : 1,
          },
        ]}>
        {count}
      </Text>
      <TouchableOpacity
        disabled={isLimit || isDisablePlus || !!checkRemaining}
        onPress={handleIncrease}
        style={[
          styles.button,
          {
            opacity: isDisablePlus ? 0.5 : 1,
          },
        ]}>
        <Text style={[styles.fontButton]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    padding: 4,
  },
  countText: {
    fontSize: 22,
    fontFamily: font.bold,
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
