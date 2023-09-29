import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { DronerHired } from '.';
import { colors, font, image } from '../../assets';
import Text from '../../components/Text/Text';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import icons from '../../assets/icons/icons';
import { normalize } from '../../functions/Normalize';
import { ActivityIndicator } from 'react-native-paper';
import { FavoriteDroner } from '../../datasource/FavoriteDroner';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props extends DronerHired {
  setData: React.Dispatch<
    React.SetStateAction<{
      count: number;
      data: Array<DronerHired>;
    }>
  >;
  navigation: any;
}
export default function DronerItem({
  image_droner,
  firstname,
  lastname,
  total_task,
  rating_avg: rate,
  favorite_status: status,
  province_name: province,
  distance,
  droner_id: dronerId,
  navigation,
  setData,
  is_open_receive_task,
}: Props) {
  const [disabled, setDisabled] = useState(false);
  const { closedHired } = useMemo(() => {
    return {
      closedHired: is_open_receive_task === false ? true : false,
    };
  }, [is_open_receive_task]);
  const onToggleFav = async () => {
    setDisabled(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    await FavoriteDroner.addUnaddFav(
      farmer_id !== null ? farmer_id : '',
      dronerId,
    )
      .then(() => {
        setData(prev => {
          const newData = prev.data.map(item => {
            if (item.droner_id === dronerId) {
              return {
                ...item,
                favorite_status:
                  item.favorite_status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
              } as DronerHired;
            } else {
              return {
                ...item,
              } as DronerHired;
            }
          });
          return {
            ...prev,
            data: newData,
          };
        });
      })
      .catch((err: any) => console.log(err))
      .finally(() => setDisabled(false));
  };
  const onPressDronerItem = async () => {
    await AsyncStorage.setItem('droner_id', `${dronerId}`);
    navigation.navigate('DronerDetail');
  };
  return (
    <TouchableOpacity
      disabled={closedHired}
      style={styles({}).container}
      onPress={onPressDronerItem}>
      <View
        style={
          styles({
            closedHired,
          }).maskedView
        }>
        {closedHired && (
          <Image
            source={image.closedHired}
            resizeMode="contain"
            style={{
              position: 'absolute',
              alignSelf: 'center',
              width: 150,
              height: 150,

              zIndex: 1,
            }}
          />
        )}

        <View>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <ProgressiveImage
              borderRadius={24}
              resizeMode="cover"
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
              }}
              source={
                image_droner === null
                  ? icons.profile_blank
                  : { uri: image_droner }
              }
            />
            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  marginLeft: 16,
                  flex: 1,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: colors.primary60,
                    fontFamily: font.SarabunBold,
                    fontSize: 18,
                    lineHeight: 28,
                  }}>
                  {firstname} {lastname}
                </Text>
                <View
                  style={{
                    backgroundColor: colors.white,
                    borderColor: colors.bg,
                    borderWidth: 1,
                    width: 30,
                    height: 30,
                    borderRadius: 15,
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
                      onPress={onToggleFav}
                      disabled={closedHired}>
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
              </View>
              <View
                style={{
                  marginLeft: 16,
                  flex: 1,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 4,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 6,
                    marginBottom: 8,
                  }}>
                  <Image
                    source={icons.star}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                  <Text style={styles({}).label}>
                    {rate !== null
                      ? `${parseFloat(rate).toFixed(1)} คะแนน  `
                      : `0 คะแนน`}
                  </Text>
                  <Text style={[styles({}).label, { color: colors.gray }]}>
                    {total_task ? `(${total_task})` : ``}{' '}
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
          </View>
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: colors.greyDivider,
              marginVertical: 6,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={icons.location}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text
                numberOfLines={1}
                style={[styles({}).label, { width: 120 }]}>
                {province !== null ? 'จ.' + ' ' + province : 'จ.' + '  -'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={icons.distance}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text style={styles({}).label}>
                {distance !== null
                  ? `ห่างคุณ ${distance.toFixed(1)} กม.`
                  : `0 กม.`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = ({ closedHired }: any) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      minHeight: 128,
      borderRadius: 8,
      borderColor: colors.grey10,
      marginBottom: 16,
      backgroundColor: colors.greenBackground,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowRadius: 0.4,
      shadowOpacity: 0.1,
      elevation: 2,
    },
    label: {
      fontFamily: font.SarabunLight,
      fontSize: normalize(16),
      color: colors.fontBlack,
      justifyContent: 'center',
      alignItems: 'center',
    },
    maskedView: closedHired
      ? {
          minHeight: 128,
          borderRadius: 8,
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.2)',
          zIndex: 1,
          padding: 16,
        }
      : {
          padding: 16,
          width: '100%',
        },
  });
