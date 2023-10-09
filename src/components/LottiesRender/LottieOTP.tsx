import { View, Text } from 'react-native';
import React from 'react';
import { normalize } from '../../functions/Normalize';
import Lottie from 'lottie-react-native';
import lotties from '../../assets/lotties';
export default function LottieOTP() {
  const refPlayAnimation = React.useRef<any>(null);
  React.useEffect(() => {
    refPlayAnimation.current.play();
  }, []);
  return (
    <View
      style={{
        width: normalize(116),
        height: normalize(116),
        marginBottom: normalize(8),
      }}>
      <Lottie
        ref={refPlayAnimation}
        source={lotties.inputOTP}
        autoPlay
        loop
        resizeMode="cover"
      />
    </View>
  );
}
