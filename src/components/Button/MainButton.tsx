import { Button } from '@rneui/themed';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { colors, font } from '../../assets';
import { normalize } from '../../functions/Normalize';

interface MainButtonProps {
  label: string;
  color: string;
  fontSize?: number;
  fontWeight?: string;
  fontColor?: string;
  borderColor?: string;
  fontFamily?: string;
  disable?: boolean;
  width?: number | string;
  onPress?: () => void;
  style?: ViewStyle;
  marginVertical?: number;
  disabledStyle?: 'default' | 'light';
}

export const MainButton: React.FC<MainButtonProps> = props => {
  return (
    <Button
      disabled={props.disable}
      disabledStyle={
        props.disabledStyle === 'light' ? styles.disableLight : undefined
      }
      title={props.label}
      titleProps={{
        allowFontScaling: false,
      }}
      titleStyle={{
        color: props.fontColor ? props.fontColor : colors.white,
        fontSize: props.fontSize ?? normalize(20),
        fontFamily: props.fontFamily ?? font.AnuphanMedium,
      }}
      buttonStyle={[
        styles.mainButton,
        {
          backgroundColor: props.color,
          borderColor: props.borderColor ? props.borderColor : props.color,
          borderWidth: props.disable ? 0 : 0.5,
          width: props.width,
          marginVertical: props.marginVertical ? 10 : 5,
        },
        props.style,
      ]}
      onPress={props.onPress}
    />
  );
};

const styles = StyleSheet.create({
  mainButton: {
    width: normalize(343),
    height: normalize(54),
    borderRadius: normalize(8),
  },
  disableLight: {
    backgroundColor: colors.white,
    borderColor: colors.disable,
    borderWidth: 0.5,
    color: '#C0C5CA',
  },
});
