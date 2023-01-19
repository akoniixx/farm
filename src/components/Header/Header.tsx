import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  Text,
} from 'react-native';
import React from 'react';

import { useNavigation } from '@react-navigation/native';
import icons from '../../assets/icons/icons';

interface Props {
  title?: string;
  componentLeft?: React.ReactNode;
  componentRight?: React.ReactNode;
  style?: ViewStyle;
  titleColor?: string;
}
export default function Header({
  title,
  componentLeft,
  componentRight,
  titleColor = '#202326',
  style,
}: Props) {
  const navigation = useNavigation();
  return (
    <View style={[styled.container, style]}>
      {componentLeft ? (
        componentLeft
      ) : (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.arrowLeft}
            style={{
              width: 24,
              height: 24,
            }}
          />
        </TouchableOpacity>
      )}
      <Text
        style={{
          fontSize: 22,
          fontFamily: 'AnuphanBold',
          color: titleColor,
        }}>
        {title}
      </Text>
      {componentRight ? (
        componentRight
      ) : (
        <View
          style={{
            width: 24,
          }}
        />
      )}
    </View>
  );
}
const styled = StyleSheet.create({
  container: {
    minHeight: 60,
    padding: 16,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});
