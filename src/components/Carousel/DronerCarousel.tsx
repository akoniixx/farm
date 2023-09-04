import {
  Image,
  StyleSheet,
  View,
  ImageBackground,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons, image } from '../../assets';
import { Avatar } from '@rneui/base';

import { mixpanel } from '../../../mixpanel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteDroner } from '../../datasource/FavoriteDroner';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Text from '../Text/Text';

interface dronerData {
  index: any;
  profile: any;
  background: any;
  name: any;
  rate: any;
  total_task: any;
  province: any;
  distance: any;
  status: any;
  callBack: () => void;
  dronerId: string;
  isLoading?: boolean;
}

const DronerSugg: React.FC<dronerData> = ({
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
  const onFavorite = async () => {
    setDisabled(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    await FavoriteDroner.addUnaddFav(
      farmer_id !== null ? farmer_id : '',
      dronerId,
    )
      .catch((err: any) => console.log(err))
      .finally(() => setDisabled(false));
  };

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
          style={{ height: normalize(70) }}
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
                    callBack();
                    await onFavorite();
                    if (status === 'ACTIVE') {
                      mixpanel.track(
                        'MainScreen_ButtonFavoriteDroner_PressUnFavorite',
                      );
                    } else {
                      mixpanel.track(
                        'MainScreen_ButtonFavoriteDroner_PressFavorite',
                      );
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
            <View style={{ alignSelf: 'center' }}>
              <Avatar
                size={normalize(56)}
                source={
                  profile === null ? image.empty_droner : { uri: profile }
                }
                avatarStyle={{
                  borderRadius: normalize(40),
                  borderColor: colors.white,
                  borderWidth: 1,
                }}
              />
            </View>
            <View style={{ paddingLeft: 10 }}>
              <Text numberOfLines={1} style={[styles.h1, { width: 150 }]}>
                {name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={icons.star}
                  style={{ width: 20, height: 20, marginRight: 5 }}
                />
                <Text style={styles.label}>
                  {' '}
                  {rate !== null
                    ? `${parseFloat(rate).toFixed(1)} คะแนน  `
                    : `0 คะแนน`}{' '}
                </Text>
                <Text style={[styles.label, { color: colors.gray }]}>
                  {total_task !== null ? `(${total_task})` : `  (0)`}{' '}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={icons.location}
                  style={{ width: 20, height: 20, marginRight: 10 }}
                />
                <Text numberOfLines={1} style={[styles.label, { width: 120 }]}>
                  {province !== null ? 'จ.' + ' ' + province : 'จ.' + '  -'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
        backgroundColor: colors.white,
        height: normalize(205),
        width: normalize(160),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.bg,
      },
      android: {
        backgroundColor: colors.white,
        height: normalize(240),
        width: normalize(160),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.bg,
        marginBottom: 10,
      },
    }),
  },
  mainButton: {
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: normalize(8),
    width: normalize(343),
  },
  headFont: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(26),
    color: 'black',
  },
  detail: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(14),
    color: 'black',
    textAlign: 'center',
    marginTop: normalize(16),
    flexShrink: 1,
  },
});

export default DronerSugg;
