import { Text as TextRN, TextProps, StyleSheet } from 'react-native';
import React from 'react';
import { colors } from '../../assets';
import fonts from '../../assets/fonts';

interface Props extends TextProps {
  title?: boolean;
  fontFamily?: keyof typeof fonts;
}
export default function Text({ children, ...props }: Props) {
  return (
    <TextRN
      {...props}
      style={[styles(props).text, props.style]}
      allowFontScaling={false}>
      {children}
    </TextRN>
  );
}
const styles = ({ ...rest }: Props) => {
  return StyleSheet.create({
    text: {
      fontFamily: rest.fontFamily || fonts.AnuphanLight,
      color: colors.fontBlack,
      fontSize: rest.title ? 24 : 16,
    },
  });
};
