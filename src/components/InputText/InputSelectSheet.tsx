import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors, font } from '../../assets';
import { normalize } from '../../functions/Normalize';
import Text from '../Text/Text';
import { SheetManager } from 'react-native-actions-sheet';

type Props = {
  required?: boolean;
  label?: string;
  value?: {
    label: string;
    value: any;
  };
  onChange?: (value: { label: string; value: any }) => void;
  listData?: { label: string; value: any }[];
  titleSheet?: string;
  sheetId: string;
  placeholder?: string;
};

const InputSelectSheet = ({
  required = false,
  label,
  value,
  onChange,
  listData,
  placeholder,
  sheetId,
}: Props) => {
  const onPressOpenSheet = async () => {
    const result:
      | {
          label: string;
          value: any;
        }
      | undefined = await SheetManager.show(sheetId, {
      payload: {
        listData,
        value,
        titleSheet: label,
      },
    });
    if (result) {
      onChange?.(result);
    }
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>
          {label}{' '}
          {required ? (
            <Text
              style={{
                color: colors.errorText,
                fontSize: 24,
                fontFamily: font.AnuphanRegular,
              }}>
              *
            </Text>
          ) : null}
        </Text>
        <TouchableOpacity style={styles.fakeInput} onPress={onPressOpenSheet}>
          {value?.label ? (
            <Text style={styles.value}>{value.label}</Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputSelectSheet;

const styles = StyleSheet.create({
  container: {},
  label: {
    fontFamily: font.AnuphanSemiBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
    lineHeight: normalize(28),
  },
  fakeInput: {
    height: normalize(56),
    marginTop: 6,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderColor: colors.grey20,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontFamily: font.SarabunLight,
    fontSize: normalize(20),
    lineHeight: normalize(28),
    justifyContent: 'center',
  },
  placeholder: {
    color: colors.grey30,
    fontFamily: font.SarabunLight,
    fontSize: normalize(20),
    lineHeight: normalize(28),
  },
  value: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(20),
    lineHeight: normalize(28),
  },
});
