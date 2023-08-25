import {
  Animated,
  Easing,
  Image,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Text from '../Text';
import colors from '../../assets/colors/colors';
import {image} from '../../assets';
import fonts from '../../assets/fonts';
import {useNetwork} from '../../contexts/NetworkContext';

interface Props {
  onPress?: () => Promise<void> | void;
  children?: React.ReactNode;
  height?: number;
  style?: ViewStyle;
}

const initialTimer = 5;

const wordingConnectFail = 'การเชื่อมต่ออินเทอร์เน็ตล้มเหลว';
// const initialDot = '...';
export default function NetworkLost({onPress, children, height, style}: Props) {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const [error, setError] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  // const [dot, setDot] = useState(initialDot);
  const [isSpining, setIsSpinning] = useState(false);
  const {isConnected, onReconnect} = useNetwork();
  const [timer, setTimer] = useState(0);
  const startRotation = useCallback(() => {
    rotateValue.setValue(0);
    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished && isSpining) {
        startRotation();
      } else {
        rotateValue.stopAnimation();
      }
    });
  }, [rotateValue, isSpining]);

  const handleStart = async () => {
    setIsSpinning(true);
    setIsReconnecting(true);
    setTimer(initialTimer);
    setError(false);
    await onReconnect?.();
    await onPress?.();
  };
  useEffect(() => {
    startRotation();
  }, [isSpining, startRotation]);

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer === 0) {
        clearInterval(interval);
        setIsSpinning(false);
        rotateValue.stopAnimation();

        return;
      }
      setTimer(timer - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      setIsReconnecting(false);
    };
  }, [timer, rotateValue]);

  useEffect(() => {
    if (timer <= 0 && isReconnecting) {
      setTimeout(() => {
        setError(true);
      }, 1000);
    }
  }, [timer, isReconnecting]);

  // useEffect(() => {
  //   const loopDot = () => {
  //     setDot(prev => {
  //       if (prev === initialDot) {
  //         return '';
  //       }
  //       return prev + '.';
  //     });
  //   };
  //   if (timer > 0) {
  //     loopDot();
  //   } else {
  //     setDot(initialDot);
  //   }
  // }, [timer]);

  return isConnected ? (
    children
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor: colors.grayBg,
        minHeight: height,
        ...style,
      }}>
      <Image
        source={image.lostNetwork}
        style={{
          width: 60,
          height: 60,
        }}
        resizeMode="contain"
      />
      <Text
        style={{
          fontSize: 16,
          color: colors.grey3,
          textAlign: 'center',
          fontFamily: fonts.medium,
          marginTop: 20,
        }}>
        เครือข่ายขัดข้อง กรุณาตรวจสอบการเชื่อมต่อ และลองใหม่อีกครั้ง
      </Text>
      <TouchableOpacity
        onPress={handleStart}
        disabled={isSpining}
        style={{
          marginTop: 8,
          padding: 8,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        {isSpining ? (
          <Animated.View
            style={{
              transform: [{rotate: rotation}],
              marginRight: 8,
            }}>
            <Image
              source={image.refresh}
              style={{width: 24, height: 24}}
              resizeMode="contain"
            />
          </Animated.View>
        ) : (
          <Image
            source={image.refresh}
            style={{width: 24, height: 24, marginRight: 8}}
            resizeMode="contain"
          />
        )}

        {isSpining ? (
          <Text
            style={{
              fontSize: 16,
              color: colors.orange,
              textAlign: 'center',
              fontFamily: fonts.bold,
              alignSelf: 'flex-start',
            }}>
            กำลังเชื่อมต่อ
          </Text>
        ) : (
          <Text
            style={{
              fontSize: 16,
              color: colors.orange,
              textAlign: 'center',
              fontFamily: fonts.bold,
            }}>
            ลองอีกครั้ง
          </Text>
        )}
      </TouchableOpacity>
      <View
        style={{
          marginTop: 8,
        }}>
        {error && (
          <Text
            style={{
              fontSize: 16,
              color: colors.decreasePoint,
              textAlign: 'center',
              fontFamily: fonts.medium,
            }}>
            {wordingConnectFail}
          </Text>
        )}
      </View>
    </View>
  );
}
