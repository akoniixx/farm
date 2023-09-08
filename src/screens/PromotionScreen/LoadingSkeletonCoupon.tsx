import { View, Text } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { colors } from '../../assets';

export default function LoadingSkeletonCoupon() {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        height: '100%',
        marginTop: 8,
      }}>
      <SkeletonPlaceholder
        speed={2000}
        backgroundColor={colors.skeleton}
        borderRadius={8}>
        <>
          {[1, 2, 3, 4].map(_ => {
            return (
              <SkeletonPlaceholder.Item
                flexDirection="row"
                alignItems="center"
                style={{
                  marginBottom: 12,
                }}>
                <View
                  style={{
                    width: '100%',
                    height: 100,
                  }}
                />
              </SkeletonPlaceholder.Item>
            );
          })}
        </>
      </SkeletonPlaceholder>
    </View>
  );
}
