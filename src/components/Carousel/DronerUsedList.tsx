import {
  Image,
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Dimensions,
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
  card: any;
  nickname?: string;
}

const DronerUsedList: React.FC<dronerUsedData> = ({
  index,
  profile,
  background,
  name,
  rate,
  province,
  distance,
  status,
  callBack,
  isLoading,
  card,
  nickname = '',
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
      <View style={card !== 'taskSug' ? [styles.cards] : [styles.cardsTaskSug]}>
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
              <View>
                {card !== 'taskSug' && (
                  <View
                    style={{
                      backgroundColor: colors.white,
                      borderColor: colors.bg,
                      borderWidth: 1,
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      alignSelf: 'flex-end',
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
                            status === 'ACTIVE'
                              ? icons.heart_active
                              : icons.heart
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
                )}
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
                    ? `ห่างคุณ ${parseFloat(distance).toFixed(1)} กม.`
                    : `0 กม.`}
                </Text>
              </View>
              {card !== 'taskSug' && (
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 15,
                    borderColor: colors.greenLight,
                    backgroundColor: '#fff',
                    height: 26,
                    width: 'auto',
                    marginTop: 8,
                    paddingHorizontal: 4,
                    alignSelf: 'flex-start',
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
              )}
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
    lineHeight: 26,
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
    height: normalize(240),
    width: Dimensions.get('window').width * 0.6 - 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.bg,
    backgroundColor: '#F7FFF0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 1,
    shadowOpacity: 0.12,
    shadowRadius: 0.22,
  },
  cardsTaskSug: {
    height: normalize(210),
    width: Dimensions.get('window').width * 0.6 - 32,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.bg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 1,
    shadowOpacity: 0.12,
    shadowRadius: 0.22,
  },
});

export default DronerUsedList;
