import {Image, StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {normalize} from '../../functions/Normalize';
import {colors, font, icons, image} from '../../assets';
import fonts from '../../assets/fonts';
import {Avatar} from '@rneui/base';

interface dronerData {
  index: number;
  profile: string;
  background: string;
  name: string;
  rate: string;
  province: string;
  distance: number;
}
const dronerSugUI: React.FC<dronerData> = ({
  index,
  profile,
  background,
  name,
  rate,
  province,
  distance,
}) => {
  return (
    <View style={{flex: 1, top: '10%', paddingHorizontal: 8, left: '10%'}}>
      <View style={[styles.cards]}>
        <View
          style={[
            {
              backgroundColor: colors.greenDark,
              height: '33%',
              width: normalize(160),
              borderWidth: 0.3,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            },
          ]}>
            <Image   source={
                profile === ''
                  ? image.empty_plot
                  : {uri: profile}
              }/>
          <View
            style={{
              borderColor: colors.bg,
              borderWidth: 1,
              width: 30,
              height: 30,
              borderRadius: 15,
              alignSelf: 'flex-end',
              margin: 10,
            }}>
            <Image
              source={icons.heart}
              style={{alignSelf: 'center', width: 20, height: 20, top: 4}}
            />
          </View>
          <View style={{alignSelf: 'center'}}>
            <Avatar
              size={normalize(56)}
              source={
                profile === null
                  ? image.empty_plot
                  : {uri: profile}
              }
              avatarStyle={{
                borderRadius: normalize(40),
                borderColor: colors.white,
                borderWidth: 1,
              }}
            />
          </View>
          <View style={{paddingLeft: 10}}>
            <Text  numberOfLines={1} style={[styles.h1, {width: 150}]}>{name}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={icons.star}
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text style={styles.label}>{rate + ' ' + 'คะแนน'} </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={icons.location}
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text numberOfLines={1} style={[styles.label, {width: 120}]}>{'จ.' + ' ' + province}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={icons.distance}
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text style={styles.label}>
                {'ห่างคุณ' + ' ' + distance + ' ' + 'กม.'}
              </Text>
            </View>
          </View>
        </View>
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
    backgroundColor: colors.white,
    height: normalize(205),
    width: normalize(160),
    borderRadius: 10,
    borderWidth: 0.3,
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

export default dronerSugUI;
