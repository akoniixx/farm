import {
  Image,
  StyleSheet,
  View,
  ImageBackground,
  Platform,
  Dimensions,
} from 'react-native';
import React from 'react';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons, image } from '../../assets';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Text from '../Text/Text';
import ProgressiveImage from '../ProgressingImage/ProgressingImage';

interface dronerUsedData {
  index: any;
  profile: any;
  background: any;
  name: any;
  rate: any;
  total_task: any;
  province: any;
  distance: any;
  status: any;
  isLoading?: boolean;
  nickname?: string;
}

const DronerNearMeList: React.FC<dronerUsedData> = ({
  index,
  profile,
  background,
  name,
  rate,
  total_task,
  province,
  distance,
  isLoading,
  nickname,
}) => {
  return isLoading ? (
    <View
      style={{
        width: Dimensions.get('window').width * 0.6 - 32,
      }}>
      <SkeletonPlaceholder
        borderRadius={10}
        speed={2000}
        backgroundColor={colors.skeleton}>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          style={{ marginLeft: 16, width: '100%' }}>
          <View
            style={{
              width: '100%',
              height: 200,
            }}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  ) : (
    <View style={{ paddingHorizontal: 8, marginBottom: 4 }}>
      <View style={[styles.cards]}>
        <ImageBackground
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          style={{
            height: normalize(50),
            paddingVertical: 4,
            paddingHorizontal: 12,
          }}
          source={background === null ? image.bg_droner : { uri: background }}>
          <View key={index}>
            <Image
              source={profile === '' ? image.empty_plot : { uri: profile }}
            />
            <View
              style={{
                flexDirection: 'row',
                marginTop: 8,
                justifyContent: 'space-between',
              }}>
              <View>
                <ProgressiveImage
                  borderRadius={28}
                  source={
                    profile === null ? image.empty_plot : { uri: profile }
                  }
                  style={{
                    borderRadius: normalize(28),
                    borderColor: colors.white,
                    borderWidth: 1,
                    width: normalize(56),
                    height: normalize(56),
                  }}
                />
              </View>
            </View>

            <View
              style={{
                marginTop: 8,
              }}>
              <View
                style={{
                  minHeight: 50,
                }}>
                {nickname ? (
                  <>
                    <Text numberOfLines={1} style={[styles.h1]}>
                      {nickname}
                    </Text>
                    <Text numberOfLines={1} style={[styles.h2]}>
                      {name}
                    </Text>
                  </>
                ) : (
                  <Text numberOfLines={1} style={[styles.h1]}>
                    {name}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.star}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text style={styles.label}>
                  {rate !== null
                    ? `${parseFloat(rate).toFixed(1)} คะแนน  `
                    : `0 คะแนน`}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.location}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text numberOfLines={1} style={[styles.label]}>
                  {province !== null ? 'จ.' + ' ' + province : 'จ.' + '  -'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom: 3,
                }}>
                <Image
                  source={icons.distance}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text style={styles.label}>
                  {distance !== null
                    ? `ห่าง ${parseFloat(distance).toFixed(1)} กม.`
                    : `0 กม.`}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  h1: {
    color: colors.primary,
    fontFamily: font.SarabunBold,
    fontSize: normalize(18),
    lineHeight: 30,
  },
  h2: {
    color: colors.grey40,
    fontFamily: font.SarabunBold,
    fontSize: normalize(14),
    lineHeight: 30,
  },
  cards: {
    ...Platform.select({
      ios: {
        backgroundColor: colors.white,
        height: normalize(210),
        width: normalize(160),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.bg,
      },
      android: {
        backgroundColor: colors.white,
        height: normalize(220),
        width: normalize(160),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.bg,
      },
    }),
  },
});

export default DronerNearMeList;
