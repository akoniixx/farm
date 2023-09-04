import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';
import Text from '../Text/Text';

interface Props {
  radioLists: {
    title: string;
    value: string;
    key: string;
  }[];
  style?: ViewStyle;
  onChange?: (value: string) => void;
  value?: string;
  label?: string;
  horizontal?: boolean;
}
export default function Radio({
  radioLists,
  value,
  onChange,
  horizontal = false,
  style,
}: Props): JSX.Element {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: horizontal ? 'space-between' : 'flex-start',
        flexDirection: horizontal ? 'row' : 'column',
        ...style,
      }}>
      {radioLists.map((item, idx) => {
        const isLast = !horizontal && idx === radioLists.length - 1;

        return (
          <TouchableOpacity
            onPress={() => onChange?.(item.value)}
            key={item.key}
            style={styles({ isLast, horizontal }).container}>
            <View
              style={
                styles({
                  selected: value === item.value,
                }).radio
              }>
              <View
                style={
                  styles({
                    selected: value === item.value,
                  }).radioInside
                }
              />
            </View>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.SarabunLight,
                lineHeight: 36,
                color: colors.fontBlack,
              }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = ({
  selected = false,
  isLast = false,
}: {
  selected?: boolean;
  isLast?: boolean;
  horizontal?: boolean;
}) => {
  return StyleSheet.create({
    radio: {
      borderColor: selected ? colors.greenLight : '#C0C5CA',
      backgroundColor: selected ? 'transparent' : 'transparent',
      borderWidth: 2,
      width: 28,
      height: 28,
      borderRadius: 14,
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioInside: {
      borderWidth: 5,
      backgroundColor: selected ? colors.greenLight : 'transparent',
      borderColor: 'transparent',
      height: '70%',
      width: '70%',

      borderRadius: 14,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: isLast ? 0 : 12,
    },
  });
};
