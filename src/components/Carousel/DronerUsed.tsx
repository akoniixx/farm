import {Image, StyleSheet, Text, View, TextInput, ImageBackground} from 'react-native';
import React, {useState} from 'react';
import {normalize} from '../../functions/Normalize';
import {colors, font, icons, image} from '../../assets';
import fonts from '../../assets/fonts';
import {Avatar} from '@rneui/base';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface dronerUsedData {
  index: number;
  profile: string;
  background: string;
  name: string;
  rate: string;
  total_task: string;
  province: string;
  distance: number;
}

const DronerUsed: React.FC<dronerUsedData> = ({
  index,
  profile,
  background,
  name,
  rate,
  total_task,
  province,
  distance,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <View style={{flex: 1, top: '10%', paddingHorizontal: 8, left: '10%'}}>
      <View style={[styles.cards]}>
      <ImageBackground
        borderTopLeftRadius={10}
        borderTopRightRadius={10}
        style={{height: normalize(70)}}
          source={background === '' ? image.bg_droner : {uri: profile}}
        >
           <View
          key={index}
        >
          <Image source={profile === '' ? image.empty_plot : {uri: profile}} />
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
            <TouchableOpacity onPress={() => setChecked(!checked)}>
              <Image
                source={checked ? icons.heart_active : icons.heart}
                style={{alignSelf: 'center', width: 20, height: 20, top: 4}}
              />
            </TouchableOpacity>
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
              <Text style={styles.label}>{rate + ' ' + 'คะแนน'} </Text>
              <Text style={[styles.label,{color: colors.gray}]}>{ '(' + total_task + ')'} </Text>

            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={icons.location}
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text numberOfLines={1} style={[styles.label, {width: 120}]}>
                {'จ.' + ' ' + province}
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
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text style={styles.label}>
                {'ห่างคุณ' + ' ' + distance + ' ' + 'กม.'}
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
    backgroundColor: '#F7FFF0',
    height: normalize(220),
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

export default DronerUsed;
