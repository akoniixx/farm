import {
  Pressable,
  StyleSheet,
  TextInputProps,
  TextInput,
  ViewStyle,
} from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts';
import colors from '../../assets/colors/colors';
interface InputStyledProps {
  isError?: boolean;
  styleContainer?: ViewStyle;
  suffixComponent?: React.ReactNode;
}
interface Props extends TextInputProps, InputStyledProps {}
export default function InputWithSuffix({
  style,
  styleContainer,
  suffixComponent,
  ...props
}: Props) {
  const refInput = React.useRef<TextInput>(null);
  return (
    <Pressable
      style={[styles().container, styleContainer]}
      onPress={() => {
        refInput.current?.focus();
      }}>
      <TextInput {...props} ref={refInput} style={[styles().input, style]} />
      {suffixComponent && suffixComponent}
    </Pressable>
  );
}
const styles = () => {
  return StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: '#A7AEB5',
      borderRadius: 10,
      paddingHorizontal: 16,
      height: 52,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      backgroundColor: colors.white,
    },
    input: {
      fontSize: 20,
      fontFamily: fonts.SarabunMedium,
      width: '80%',
    },
  });
};
