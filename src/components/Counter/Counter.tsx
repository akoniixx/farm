import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import { colors, font } from '../../assets';
import Text from '../Text/Text';
import icons from '../../assets/icons/icons';

interface Props {
  currentCount: number;
  unitIncrement?: number;
  minimum?: number;
  maximum: number;
  disabledIncrement?: boolean;
  setCurrentCount: React.Dispatch<React.SetStateAction<number>>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setDisabled?: React.Dispatch<React.SetStateAction<boolean>>;
  styleType?: 'default' | 'reward';
}
export default function Counter({
  unitIncrement = 10,
  currentCount,
  minimum = 100,
  maximum,
  setCurrentCount,
  setDisabled,
  styleType = 'default',
  disabledIncrement = false,
}: Props) {
  const refInput = React.useRef<TextInput>(null);

  const onIncrement = () => {
    setCurrentCount(
      currentCount + unitIncrement > maximum
        ? maximum
        : currentCount + unitIncrement,
    );
    setDisabled?.(true);
  };
  const onDecrement = () => {
    if (currentCount > minimum) {
      setCurrentCount(prev =>
        prev - unitIncrement < minimum ? minimum : prev - unitIncrement,
      );
    }
    setDisabled?.(true);
  };
  const onChangeText = (text: string) => {
    const valueNumber = text.replace(/,/g, '');
    setCurrentCount(
      Number(valueNumber) > maximum ? maximum : Number(valueNumber),
    );
    setDisabled?.(true);
  };
  const onBlur = () => {
    setCurrentCount(prev => {
      if (prev === currentCount && prev > minimum) {
        return Math.floor(prev / 10) * 10;
      }
      return currentCount > minimum
        ? Math.floor(currentCount / 10) * 10
        : minimum;
    });
  };

  return styleType === 'default' ? (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={currentCount <= minimum}
        onPress={onDecrement}
        style={styles.button}>
        <Text style={styles.textButton}>-</Text>
      </TouchableOpacity>
      <Pressable
        style={styles.containerText}
        onPress={() => {
          if (refInput.current) {
            refInput.current.focus();
          }
        }}>
        <TextInput
          ref={refInput}
          style={styles.textCounter}
          scrollEnabled={false}
          maxLength={7}
          allowFontScaling={false}
          returnKeyType="done"
          keyboardType="number-pad"
          onBlur={() => onBlur()}
          value={currentCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          onChangeText={onChangeText}
        />
      </Pressable>
      <TouchableOpacity
        disabled={currentCount + unitIncrement > maximum}
        onPress={onIncrement}
        style={styles.button}>
        <Text style={styles.textButton}>+</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={currentCount <= minimum}
        onPress={onDecrement}
        style={
          currentCount <= minimum
            ? styles.buttonRewardDisabled
            : styles.buttonReward
        }>
        <Image
          source={
            currentCount <= minimum
              ? icons.minusButtonDisableIcon
              : icons.minusButtonIcon
          }
          style={styles.icons}
        />
      </TouchableOpacity>
      <View style={styles.containerTextReward}>
        <Text style={styles.textCounterReward}>{currentCount}</Text>
      </View>
      <TouchableOpacity
        disabled={currentCount + unitIncrement > maximum || disabledIncrement}
        onPress={onIncrement}
        style={
          currentCount + unitIncrement > maximum || disabledIncrement
            ? styles.buttonRewardDisabled
            : styles.buttonReward
        }>
        <Image source={icons.plusButtonIcon} style={styles.icons} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textButton: {
    fontSize: 28,
    color: colors.fontBlack,
    fontFamily: font.SarabunLight,
    lineHeight: 28,
  },

  containerText: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.yellowBorder,
    minWidth: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerTextReward: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.grey20,
    minWidth: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCounter: {
    fontSize: 20,
    fontFamily: font.SarabunMedium,
    color: colors.primary,
  },
  textCounterReward: {
    fontSize: 20,
    fontFamily: font.SarabunMedium,
    color: colors.primary,
  },
  button: {
    width: 30,
    height: 30,
    backgroundColor: colors.white,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonReward: {
    width: 40,
    height: 40,
    backgroundColor: colors.greenLight,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRewardDisabled: {
    width: 40,
    height: 40,
    backgroundColor: colors.grey5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icons: {
    width: 40,
    height: 40,
  },
});
