import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import React from 'react';
import { colors, font } from '../../assets';
import { normalize } from '../../functions/Normalize';
import Text from '../Text/Text';

interface Props extends TextInputProps {
  label: string;
  required?: boolean;
  optional?: boolean;
}
export default function InputTextLabel({
  label,
  required,
  style,
  optional,
  ...props
}: Props) {
  return (
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
        ) : optional ? (
          <Text style={{ color: colors.grey30 }}> (ไม่ระบุก็ได้)</Text>
        ) : null}
      </Text>
      <TextInput
        allowFontScaling={false}
        editable={true}
        placeholderTextColor={colors.grey30}
        style={[styles.input, style]}
        {...props}
        onChangeText={text => {
          if (text.length > 0 && text[0] === ' ') {
            text = text.slice(1);
          }
          props.onChangeText?.(text);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: font.AnuphanSemiBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
    lineHeight: normalize(28),
  },
  input: {
    fontFamily: font.SarabunLight,
    height: normalize(56),
    marginTop: 6,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderColor: colors.grey20,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontSize: normalize(20),
  },
});
