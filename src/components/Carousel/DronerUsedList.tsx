import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { Avatar } from '@rneui/base';
import { color } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteDroner } from '../../datasource/FavoriteDroner';
import { TaskSuggestion } from '../../datasource/TaskSuggestion';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import Spinner from 'react-native-loading-spinner-overlay/lib';

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
  callBack: () => void;
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
}) => {
  return (
    <View style={{ paddingHorizontal: 5 }}>
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
            <View style={{ alignSelf: 'center', bottom: 15 }}>
              <Avatar
                size={normalize(56)}
                source={profile === null ? image.empty_plot : { uri: profile }}
                avatarStyle={{
                  borderRadius: normalize(40),
                  borderColor: colors.white,
                  borderWidth: 1,
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
