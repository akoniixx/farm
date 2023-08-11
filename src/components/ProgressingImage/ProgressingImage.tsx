import React, {useState} from 'react';
import {StyleSheet, View, ImageProps, Animated} from 'react-native';
import FastImage from 'react-native-fast-image';

interface ProgressiveImageProps {
  source: ImageProps['source'];
  style?: object;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  source,
  style = {},
}) => {
  const [highResImageLoaded, setHighResImageLoaded] = useState(false);
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
    outputRange: ['#E0E0E0', '#F5F5F5'],
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
        source={source}
        style={[
          styles.imageOverlay,
          {
            ...style,
            opacity,
          },
        ]}
        resizeMode={FastImage.resizeMode.cover}
        onLoad={onLoadHighResImage}
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
