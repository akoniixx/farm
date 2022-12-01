import {Button} from '@rneui/themed';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import {colors, font} from '../../assets';
import {normalize} from '../../functions/Normalize';

interface MainButtonProps {
  label: string;
  color: string;
  fontSize?: number;
  fontWeight?: string;
  fontColor?: string;
  borderColor?: string;
  fontFamily?: string;
  disable?: boolean;
  width?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export const MainButton: React.FC<MainButtonProps> = props => {
  return (
    <Button
      disabled={props.disable}
      title={props.label}
      titleStyle={{
        color: props.fontColor ? props.fontColor : colors.white,
        fontSize: props.fontSize ?? normalize(18),
        fontFamily: props.fontFamily ?? font.AnuphanMedium,
      }}
      buttonStyle={[
        styles.mainButton,
        {
          backgroundColor: props.color,
          borderColor: props.borderColor ? props.borderColor : props.color,
          borderWidth: props.disable ? 0 : 0.5,
          width: props.width,
        },
        props.style,
      ]}
      onPress={props.onPress}
    />
  );
};

const styles = StyleSheet.create({
  mainButton: {
    marginVertical: normalize(10),
    borderRadius: normalize(8),
  },
});
