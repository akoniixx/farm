import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ImageProps,
  Animated,
  ImageStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNetwork } from '../../contexts/NetworkContext';
import { image } from '../../assets';

interface ProgressiveImageProps extends ImageProps {
  source: ImageProps['source'];
  style?: ImageStyle;
  resizeMode?: ImageProps['resizeMode'];
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  source,
  style = {},
  resizeMode,
  ...props
}) => {
  const [highResImageLoaded, setHighResImageLoaded] = useState(false);
  const { isConnected } = useNetwork();
  const [opacity] = useState(new Animated.Value(0));

  // Skeleton animation setup
  const [skeletonAnimation] = useState(new Animated.Value(0));
  Animated.loop(
    Animated.sequence([
      Animated.timing(skeletonAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(skeletonAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]),
  ).start();
  const skeletonBackgroundColor = skeletonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', '#E3E3E3'],
  });

  const onLoadHighResImage = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setHighResImageLoaded(true);
    });
  };

  return (
    <View style={style}>
      {!highResImageLoaded && (
        <Animated.View
          style={[
            style,
            {
              backgroundColor: skeletonBackgroundColor,
            },
          ]}
        />
      )}
      <Animated.Image
        source={isConnected ? source : image.loaderImage}
        style={[
          styles.imageOverlay,
          {
            ...style,
            opacity,
          },
        ]}
        resizeMode={resizeMode || FastImage.resizeMode.cover}
        onLoad={onLoadHighResImage}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default ProgressiveImage;
