import {Button} from '@rneui/themed';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';

interface MainButtonProps {
  label: string;
  color: string;
  fontColor?: string;
  disable?: boolean;
  onPress?: () => void;
}

export const MainButton: React.FC<MainButtonProps> = props => {
  return (
    
      <Button
     disabled={props.disable}
        title={props.label}
        titleStyle={{
          color: props.fontColor ? props.fontColor : colors.white,
          fontSize: normalize(18),
          fontFamily: font.medium
        }}
        buttonStyle={[styles.mainButton, {backgroundColor: props.color}]}
        onPress ={props.onPress}
      />
   
  );
};

const styles = StyleSheet.create({
  mainButton: {
    marginVertical: normalize(10),
    borderRadius: normalize(8),
  },
});
