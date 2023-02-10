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
  date: any;
  comment: any;
}

const CardReview: React.FC<data> = ({
  index,
  img,
  name,
  rate,
  date,
  comment,
}) => {
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 5,
        alignSelf: 'center',
        paddingHorizontal: 10,
        width: '100%',
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
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={styles.title}>
                  {' '}
                  {name.length > 2
                    ? name.slice(0, 2) + '*****' + name.charAt(name.length - 1)
                    : name}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.SarabunLight,
                    fontSize: normalize(14),
                    color: colors.fontGrey,
                    fontWeight: '100',
                  }}>
                  {new Date(date).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit',
                  })}
                </Text>
                <View style={{ marginLeft: 45 }}>
                  <View
                    style={{
                      backgroundColor: colors.white,
                      borderColor: colors.bg,
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                    }}></View>
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
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: normalize(10),
              alignItems: 'center',
              paddingVertical: 5,
            }}>
            {!comment ? (
              <Text
                style={{
                  fontFamily: fonts.SarabunLight,
                  fontSize: normalize(16),
                  color: colors.gray,
                  marginRight: '10%',
                  bottom: 2,
                  height: 'auto',
                  lineHeight: 30,
                }}>
                ไม่แสดงความคิดเห็น
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: fonts.SarabunLight,
                  fontSize: normalize(16),
                  color: colors.fontGrey,
                  marginRight: '10%',
                  bottom: 2,
                  height: 'auto',
                  lineHeight: 30,
                }}>
                {comment}
              </Text>
            )}
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
    color: colors.fontBlack,
    fontWeight: '600',
    marginHorizontal: 10,
    marginLeft: 10,
    lineHeight: 40,
    width: 200,
  },
  cards: {
    height: 'auto',
    width: normalize(355),
    borderWidth: 0.5,
    borderColor: '#D9DCDF',
    backgroundColor: colors.white,
    borderRadius: normalize(12),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    marginBottom: normalize(5),
  },
});

export default CardReview;
