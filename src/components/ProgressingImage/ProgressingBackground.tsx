import { Image, View, ViewProps } from 'react-native';
import React, { useState } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { colors, image } from '../../assets';
import { useNetwork } from '../../contexts/NetworkContext';
import FastImage, { FastImageProps } from 'react-native-fast-image';

interface ProgressiveImageProps extends FastImageProps {
  source: FastImageProps['source'];
  style?: FastImageProps['style'];
  resizeMode?: FastImageProps['resizeMode'];
  borderRadius?: number;
  children?: React.ReactNode;
  progressiveStyle?: ViewProps['style'];
  skeletonItemProps?: any;
}
export default function ProgressingBackground({
  source,
  style,
  resizeMode,
  borderRadius = 10,
  children,
  progressiveStyle,
  skeletonItemProps,
}: ProgressiveImageProps) {
  const { isConnected } = useNetwork();
  const [highResImageLoaded, setHighResImageLoaded] = useState(true);
  return (
    <View style={style}>
      {/* {!isConnected ? (
        <Image
          source={image.loaderImage}
          style={{ width: '100%', height: '100%', position: 'absolute' }} // make it cover the full container
          resizeMode={resizeMode || FastImage.resizeMode.cover}
        />
      ) : (
        <FastImage
          source={source}
          style={{ width: '100%', height: '100%', position: 'absolute' }} // make it cover the full container
          resizeMode={resizeMode || FastImage.resizeMode.cover}
          onLoad={() => setHighResImageLoaded(true)}
        />
      )} */}

      {highResImageLoaded && (
        <View style={[progressiveStyle]}>
          <SkeletonPlaceholder
            borderRadius={borderRadius}
            speed={2000}
            backgroundColor={colors.skeleton}>
            <SkeletonPlaceholder.Item {...skeletonItemProps} />
          </SkeletonPlaceholder>
        </View>
      )}
      {children}
    </View>
  );
}
