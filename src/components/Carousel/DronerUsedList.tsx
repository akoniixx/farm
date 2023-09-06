import {
  Image,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons, image } from '../../assets';
import { Avatar } from '@rneui/base';

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
  callBack: () => Promise<void>;
  dronerId: string;
  isLoading?: boolean;
}

const DronerUsedList: React.FC<dronerUsedData> = ({
  index,
  profile,
  background,
  name,
  rate,
  total_task,
  province,
  distance,
  status,
  callBack,
  dronerId,
  isLoading,
}) => {
  const [disabled, setDisabled] = useState(false);
  // const onFavorite = async () => {
  //   setDisabled(true);
  //   const farmer_id = await AsyncStorage.getItem('farmer_id');
  //   await FavoriteDroner.addUnaddFav(
  //     farmer_id !== null ? farmer_id : '',
  //     dronerId,
  //   )
  //     .catch((err: any) => console.log(err))
  //     .finally(() => setDisabled(false));
  // };

  return isLoading ? (
    <View
      style={{
        width: normalize(160),
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
    <View style={{ paddingHorizontal: 8 }}>
      <View style={[styles.cards]}>
        <ImageBackground
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          style={{ height: normalize(60) }}
          source={background === null ? image.bg_droner : { uri: background }}>
          <View key={index}>
            <Image
              source={profile === '' ? image.empty_plot : { uri: profile }}
            />
            <View
              style={{
                backgroundColor: colors.white,
                borderColor: colors.bg,
                borderWidth: 1,
                width: 30,
                height: 30,
                borderRadius: 15,
                alignSelf: 'flex-end',
                margin: 10,
              }}>
              {disabled ? (
                <View
                  style={{
                    backgroundColor: colors.white,

                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 4,
                  }}>
                  <ActivityIndicator />
                </View>
              ) : (
                <TouchableOpacity
                  disabled={disabled}
                  onPress={async () => {
                    try {
                      setDisabled(true);
                      await callBack();
                    } catch (err) {
                      console.log(err);
                    } finally {
                      setDisabled(false);
                    }
                  }}>
                  <Image
                    source={
                      status === 'ACTIVE' ? icons.heart_active : icons.heart
                    }
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      top: 4,
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ alignSelf: 'center', bottom: 15 }}>
              <ProgressiveImage
                borderRadius={28}
                source={profile === null ? image.empty_plot : { uri: profile }}
                style={{
                  borderRadius: normalize(28),
                  borderColor: colors.white,
                  borderWidth: 1,
                  width: normalize(56),
                  height: normalize(56),
                }}
              />
            </View>
            <View style={{ paddingLeft: 5, bottom: 15 }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.h1,
                  { width: 150, lineHeight: 40, marginLeft: 6 },
                ]}>
                {name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 6,
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
                <Text style={[styles.label, { color: colors.gray }]}>
                  {total_task !== null ? `(${total_task})` : `  (0)`}{' '}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 6,
                }}>
                <Image
                  source={icons.location}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text numberOfLines={1} style={[styles.label, { width: 120 }]}>
                  {province !== null ? 'จ.' + ' ' + province : 'จ.' + '  -'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom: 3,
                  marginLeft: 6,
                }}>
                <Image
                  source={icons.distance}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text style={styles.label}>
                  {distance !== null
                    ? `ห่างคุณ ${parseFloat(distance).toFixed(1)} กม.`
                    : `0 กม.`}
                </Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 15,
                  borderColor: colors.greenLight,
                  backgroundColor: '#fff',
                  height: 26,
                  width: 60,
                  marginLeft: 6,
                }}>
                <Text
                  style={{
                    fontFamily: font.AnuphanMedium,
                    fontSize: normalize(14),
                    color: colors.greenDark,
                    alignSelf: 'center',
                  }}>
                  เคยจ้าง
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
  },
  cards: {
    ...Platform.select({
      ios: {
        backgroundColor: '#F7FFF0',
        height: normalize(229),
        width: normalize(160),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.bg,
      },
      android: {
        backgroundColor: '#F7FFF0',
        height: normalize(250),
        width: normalize(160),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.bg,
      },
    }),
  },
});

export default DronerUsedList;
