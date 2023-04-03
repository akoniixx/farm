import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { Avatar } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteDroner } from '../../datasource/FavoriteDroner';
import { TaskSuggestion } from '../../datasource/TaskSuggestion';

interface data {
  index: any;
  img: any;
  name: any;
  rate: any;
  province: any;
  distance: any;
  total_task: any;
  status: any;
  callBack: () => void;
}

const AllDronerUsed: React.FC<data> = ({
  index,
  img,
  name,
  rate,
  province,
  distance,
  total_task,
  status,
  callBack,
}) => {
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 5,
        alignSelf: 'center',
        paddingHorizontal: 10,
        width: 'auto',
      }}>
      <View key={index} style={[styles.cards]}>
        <View>
          <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
            <Avatar
              size={56}
              source={img === null ? image.empty_plot : { uri: img }}
              avatarStyle={{
                width: 56,
                height: 56,
                borderRadius: normalize(40),
                borderColor: colors.white,
                borderWidth: 1,
              }}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.title}>{name}</Text>
                <View>
                  <View
                    style={{
                      backgroundColor: colors.white,
                      borderColor: colors.bg,
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      borderWidth: 0.5,
                      marginLeft: Dimensions.get('window').width - 380,
                    }}>
                    <TouchableOpacity onPress={callBack}>
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
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.star}
                  style={{
                    width: normalize(18),
                    height: normalize(20),
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.fontGrey,
                    bottom: 2,
                    marginLeft: 5,
                    width: 130,
                  }}>
                  {rate !== null
                    ? `${parseFloat(rate).toFixed(1)} คะแนน  `
                    : `0 คะแนน`}{' '}
                  <Text
                    style={{
                      fontFamily: fonts.SarabunLight,
                      fontSize: normalize(16),
                      color: colors.fontGrey,
                      fontWeight: '100',
                    }}>
                    {total_task !== null ? `(${total_task})` : `  (0)`}
                  </Text>
                </Text>
                <View style={{ marginHorizontal: '15%' }}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 15,
                      borderColor: colors.greenLight,
                      backgroundColor: '#fff',
                      height: 26,
                      width: 60,
                      marginLeft: Dimensions.get('window').width - 390,
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
          </View>
          <View
            style={{
              borderColor: '#F2F3F4',
              borderBottomWidth: 1,
              width: 20,
              marginTop: 8,
              minWidth: Dimensions.get('window').width - 50,
            }}></View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: normalize(10),
              alignItems: 'center',
              paddingVertical: 5,
            }}>
            <Image
              source={icons.location}
              style={{
                width: normalize(18),
                height: normalize(20),
                marginRight: normalize(10),
              }}
            />
            <Text
              style={{
                fontFamily: fonts.SarabunMedium,
                fontSize: normalize(16),
                color: colors.fontGrey,
                marginRight: '2%',
                bottom: 2,
                height: 'auto',
                lineHeight: 30,
                width: 140,
              }}>
              {'จ.' + province}
            </Text>
            <Image
              source={icons.distance}
              style={{
                width: normalize(18),
                height: normalize(20),
                marginRight: normalize(10),
              }}
            />
            <Text
              style={{
                fontFamily: fonts.SarabunMedium,
                fontSize: normalize(16),
                color: colors.fontGrey,
                bottom: 2,
                height: 'auto',
                lineHeight: 30,
              }}>
              {distance !== null
                ? `ห่างคุณ ${parseFloat(distance).toFixed(1)} กม.`
                : `0 กม.`}{' '}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.primary,
    fontWeight: '600',
    marginHorizontal: 10,
    marginLeft: 10,
    lineHeight: 40,
    width: 200,
  },
  cards: {
    backgroundColor: '#F7FFF0',
    width: Dimensions.get('window').width - normalize(20),
    height: 'auto',
    borderWidth: 0.5,
    borderColor: '#D9DCDF',
    margin: normalize(5),
    borderRadius: normalize(10),
    padding: normalize(10),
  },
});

export default AllDronerUsed;
