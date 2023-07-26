import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../assets';

interface Props {
  color?: string;
  spinnerSize?: number;
  style?: ViewStyle;
}

const Loading = ({ color, spinnerSize = 27, style }: Props) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false, // Changed here
      }),
    ).start();
  }, [rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const isAndroid = Platform.OS === 'android';

  return isAndroid ? (
    <ActivityIndicator
      style={style}
      size={'large'}
      color={color || colors.greenLight}
    />
  ) : (
    <View style={[styles({ color, spinnerSize }).container, style]}>
      <Animated.View
        style={[
          styles({ color, spinnerSize }).spinner,
          { transform: [{ rotate: rotation }] },
        ]}
      />
    </View>
  );
};

export default Loading;

const styles = (props: Props) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    spinner: {
      width: props.spinnerSize,
      height: props.spinnerSize,
      borderRadius: props.spinnerSize ? props.spinnerSize / 2 : 18,
      borderWidth: 3,
      borderColor: props.color || colors.greenLight,
      borderTopColor: 'transparent',
    },
  });
};
