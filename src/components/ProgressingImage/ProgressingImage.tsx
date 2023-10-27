import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  ImageProps,
  Animated,
  ImageStyle,
  Image,
} from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import { useNetwork } from '../../contexts/NetworkContext';
import { image } from '../../assets';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import colors from '../../assets/colors/colors';

interface ProgressiveImageProps extends ImageProps {
  source: ImageProps['source'];
  style?: ImageStyle;
  resizeMode?: ImageProps['resizeMode'];
  borderRadius?: number;
  noLoadingAgain?: boolean;
  noAnimation?: boolean;
}
interface FastImageType extends FastImageProps {
  noAnimation?: boolean;
  borderRadius?: number;
}

const ProgressiveImage: React.FC<ProgressiveImageProps | FastImageType> = ({
  source,
  style = {},
  resizeMode,
  borderRadius = 10,
  noAnimation = false,
  ...props
}) => {
  const [highResImageLoaded, setHighResImageLoaded] = useState(false);
  const { isConnected } = useNetwork();
  const [opacity] = useState(new Animated.Value(0));
  const [isError, setIsError] = useState(false);
  const imageCantShow = isError || !isConnected;
  // Skeleton animation setup

  const onLoadHighResImage = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setHighResImageLoaded(true);
    });
  };
  return !noAnimation ? (
    <View style={style}>
      {!highResImageLoaded && !imageCantShow && (
        <SkeletonPlaceholder
          borderRadius={borderRadius}
          speed={2000}
          backgroundColor={colors.skeleton}>
          <SkeletonPlaceholder.Item style={style}>
            <View style={{ width: '100%', height: '100%' }} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      )}
      {imageCantShow ? (
        <Image
          source={image.loaderImage}
          style={[styles.imageOverlay, style as ImageStyle]}
          resizeMode={resizeMode || FastImage.resizeMode.cover}
        />
      ) : (
        <Animated.Image
          {...(props as ProgressiveImageProps)}
          source={source as any}
          style={[
            styles.imageOverlay,
            {
              opacity,
            },
            style as ImageStyle,
          ]}
          onError={errorNative => {
            setIsError(!!errorNative.nativeEvent.error);
          }}
          resizeMode={resizeMode || FastImage.resizeMode.cover}
          onLoad={onLoadHighResImage}
        />
      )}
    </View>
  ) : (
    <View style={style}>
      <FastImage
        source={isConnected ? source : image.loaderImage}
        {...(props as FastImageProps)}
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
