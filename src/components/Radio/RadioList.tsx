import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { colors, font } from '../../assets';
import Text from '../Text/Text';

interface Props {
  onPress: () => void;
  label: string;
  isSelected: boolean;
  belowComponent?: React.ReactNode;
  extra?: JSX.Element | null;
}
const RadioList = ({
  onPress,
  isSelected,
  label,
  belowComponent,
  extra,
}: Props) => {
  const scaleValue = useRef(new Animated.Value(1))?.current;

  const animate = () =>
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  const resetAnimate = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (isSelected) {
      animate();
    } else {
      resetAnimate();
    }
  }, [isSelected]);

  return (
    <View
      style={{
        marginBottom: 16,
      }}>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'flex-start' }}
        activeOpacity={0.8}
        onPress={() => {
          onPress();
        }}>
        <View
          style={{
            flex: 0.1,
          }}>
          <Animated.View
            style={[
              styles(isSelected).radioButton,
              {
                transform: [
                  {
                    scale: scaleValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1],
                    }),
                  },
                ],
              },
            ]}>
            {isSelected && (
              <Animated.View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 10,
                  backgroundColor: colors.greenLight,
                  transform: [
                    {
                      scale: scaleValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1.2],
                      }),
                    },
                  ],
                }}
              />
            )}
          </Animated.View>
        </View>
        <View
          style={{
            flex: 0.9,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: font.SarabunRegular,
                marginLeft: 8,
                lineHeight: 24,
              }}>
              {label}
            </Text>
            {extra ? extra : null}
          </View>

          {belowComponent ? belowComponent : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = (isSelected?: boolean) =>
  StyleSheet.create({
    radioListButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    radioButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: isSelected ? colors.white : colors.white,
      borderWidth: isSelected ? 1 : 1,
      borderColor: isSelected ? colors.greenLight : colors.grey20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
  });

export default RadioList;
