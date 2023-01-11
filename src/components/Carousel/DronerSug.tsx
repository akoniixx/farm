import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {normalize} from '../../functions/Normalize';
import {colors, font, icons, image} from '../../assets';
import fonts from '../../assets/fonts';
import {Avatar} from '@rneui/base';

interface dronerData {
  index: any;
  profile: any;
  background: any;
  name: any;
  rate: any;
  total_task: any;
  province: any;
  distance: any;
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
}) => {
  return (
    <View style={{left: 10}}>
      <View style={[styles.cards]}>
        <ImageBackground
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          style={{height: normalize(70)}}
          source={background === '' ? image.bg_droner : {uri: profile}}>
          <View key={index}>
            <Image
              source={profile === '' ? image.empty_plot : {uri: profile}}
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
              <Image
                source={icons.heart}
                style={{alignSelf: 'center', width: 20, height: 20, top: 4}}
              />
            </View>
            <View style={{alignSelf: 'center'}}>
              <Avatar
                size={normalize(56)}
                source={profile === null ? image.empty_plot : {uri: profile}}
                avatarStyle={{
                  borderRadius: normalize(40),
                  borderColor: colors.white,
                  borderWidth: 1,
                }}
              />
            </View>
            <View style={{paddingLeft: 10}}>
              <Text numberOfLines={1} style={[styles.h1, {width: 150}]}>
                {name}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={icons.star}
                  style={{width: 20, height: 20, marginRight: 10}}
                />
                <Text style={styles.label}>
                  {' '}
                  {rate !== null
                    ? `${parseFloat(rate).toFixed(1)} คะแนน`
                    : `0 คะแนน`}{' '}
                </Text>
                <Text style={[styles.label, {color: colors.gray}]}>
                  {total_task !== null ? `(${total_task})` : `  (0)`}{' '}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={icons.location}
                  style={{width: 20, height: 20, marginRight: 10}}
                />
                <Text numberOfLines={1} style={[styles.label, {width: 120}]}>
                  {province !== null ? ' จ.' + ' ' + province : ' จ.' + '  -'}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={icons.distance}
                  style={{width: 20, height: 20, marginRight: 10}}
                />
                <Text style={styles.label}>
                  {distance !== null
                    ? ` ห่างคุณ ${parseFloat(distance).toFixed(0)} กม.`
                    : `0 กม.`}{' '}
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

export default DronerSugg;
