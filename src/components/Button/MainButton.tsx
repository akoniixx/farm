import {Button} from '@rneui/themed';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';

interface MainButtonProps {
  label: string;
  color: string;
  fontSize?: number;
  fontWeight?: string;
  fontColor?: string;
  borderColor?: string;
  disable?: boolean;
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
        fontFamily: font.medium,
      }}
      buttonStyle={[
        styles.mainButton,
        {
          backgroundColor: props.color,
          borderColor: props.borderColor ? props.borderColor : props.color,
          borderWidth: props.disable ? 0 : 0.5,
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
