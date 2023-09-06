import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { colors, icons } from '../assets';
import Icon from 'react-native-vector-icons/AntDesign';
import { normalize } from '@rneui/themed';
import { font } from '../assets/index';
import Text from './Text/Text';

interface InputPhoneProps {
  value: string;
  onChangeText?: (text: string) => void;
  maxLength: number;
  autoFocus?: boolean;
  onError?: boolean;
  errorMessage: string;
}
export const InputPhone: React.FC<InputPhoneProps> = ({
  value,
  maxLength,
  autoFocus,
  onChangeText,
  onError,
  errorMessage,
}) => {
  const [number, setNumber] = React.useState(value ? value : '');
  const onTextChange = (text: string) => {
    setNumber(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={!onError ? styles.boder : styles.boderError}>
        <View style={!onError ? styles.flagBorder : styles.flagBorderError}>
          <Image
            source={icons.th}
            style={{ width: 32, height: 24, borderRadius: 3 }}
          />
        </View>
        <TextInput
          style={styles.numberText}
          keyboardType="number-pad"
          editable={true}
          value={number}
          allowFontScaling={false}
          onChangeText={onTextChange}
          maxLength={maxLength}
          autoFocus={autoFocus}
          placeholder={'หมายเลขโทรศัพท์'}
          placeholderTextColor={colors.gray}
        />
        {number ? (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setNumber('')}>
            <Icon name="close" />
          </TouchableOpacity>
        ) : null}
      </View>
      {!onError ? null : <Text style={styles.textError}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  boder: {
    alignItems: 'center',
    height: normalize(56),
    flexDirection: 'row',
    borderColor: '#E8E8E8',
    borderRadius: 10,
    borderWidth: 1,
  },
  boderError: {
    alignItems: 'center',
    height: normalize(56),
    flexDirection: 'row',
    borderColor: '#EB2C21',
    borderRadius: 10,
    borderWidth: 1,
  },
  flag: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  flagBorder: {
    alignItems: 'center',
    height: normalize(56),
    flexDirection: 'row',
    borderColor: '#E8E8E8',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    paddingHorizontal: normalize(12),
  },
  flagBorderError: {
    alignItems: 'center',
    height: normalize(56),
    flexDirection: 'row',
    borderColor: '#EB2C21',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    paddingHorizontal: normalize(12),
  },
  countryCode: {
    fontSize: 16,
    lineHeight: 15,
  },
  pipe: {
    width: 1,
    height: 15,
    backgroundColor: '#E5E5E5',
    borderRadius: 100,
  },
  numberText: {
    marginLeft: 5,
    height: 60,
    justifyContent: 'center',
    lineHeight: 24,
    fontSize: 19,
    flex: 1,
    width: '100%',
    color: colors.fontBlack,
    fontFamily: font.SarabunLight,
  },
  textError: {
    color: '#EB2C21',
    alignSelf: 'center',
    marginTop: 15,
    fontSize: 12,
  },
  clearBtn: {
    flex: 0.1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
