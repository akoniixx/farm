import React from 'react';
import Lottie from 'lottie-react-native';
import lotties from '../../assets/lotties';
import { View } from 'react-native';
import { normalize } from '../../functions/Normalize';

export default function LottiePhoneNo() {
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
        source={lotties.inputPhoneNo}
        autoPlay
        loop
        resizeMode="cover"
      />
    </View>
  );
}
