import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {colors, font} from '../../assets';

interface TypeButton {
  primary: string;
  secondary: string;
}

interface Props extends TouchableOpacityProps {
  title: string;
  type?: 'primary' | 'secondary';
  noBorder?: boolean;
}
export default function AsyncButton({
  title,
  style,
  type = 'primary',
  onPress,
  noBorder = false,
  ...props
}: Props) {
  const mappingText = {
    primary: 'primaryText',
    secondary: 'secondaryText',
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles({noBorder})[type as keyof TypeButton], style]}
      {...props}>
      <Text
        style={
          styles({noBorder})[
            mappingText[type as keyof typeof mappingText] as keyof typeof styles
          ]
        }>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = (props: {noBorder: boolean}) =>
  StyleSheet.create({
    primary: {
      backgroundColor: colors.orange,
      minHeight: 54,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: 8,
      shadowColor: '#F86820',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 16,
    },
    primaryText: {
      color: colors.white,
      fontFamily: font.bold,
      fontSize: 20,
    },
    secondaryText: {
      color: colors.fontBlack,
      fontFamily: font.bold,
      fontSize: 20,
    },

    secondary: {
      backgroundColor: colors.white,
      minHeight: 54,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: 8,
      borderWidth: props.noBorder ? 0 : 1,
      borderColor: colors.disable,
    },
  });
