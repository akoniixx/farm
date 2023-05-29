import {Text as TextRN, TextProps, StyleSheet} from 'react-native';
import React from 'react';
import {colors, font} from '../../assets';

interface Props extends TextProps {
  title?: boolean;
}
export default function Text({children, ...props}: Props) {
  return (
    <TextRN
      {...props}
      style={[styles(props).text, props.style]}
      allowFontScaling={false}>
      {children}
    </TextRN>
  );
}
const styles = ({...rest}: Props) => {
  return StyleSheet.create({
    text: {
      fontFamily: rest.title ? font.semiBold : font.light,
      color: colors.fontBlack,
      fontSize: rest.title ? 24 : 16,
    },
  });
};
