import {Image, StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {normalize} from '../../functions/Normalize';
import {colors, font, icons, image} from '../../assets';
import fonts from '../../assets/fonts';
import {Avatar} from '@rneui/base';

interface DetailData {
  index: number;
  day: string;
  dateTime: string;
  convenient: string;
}

const CardDetailDroner: React.FC<DetailData> = ({
  index,
  day,
  dateTime,
  convenient,
}) => {
  return (
    <View style={{flex: 1, paddingHorizontal: 5, left: '10%'}}>
      <View style={[styles.cards]}>
        <View key={index} style={[styles.cardYes]}>
          <Text style={[styles.label, {alignSelf: 'center', top: '5%'}]}>
            {day}
          </Text>
          <Text style={[styles.label, {padding: '15%'}]}>{dateTime}</Text>
          <Text style={[styles.label, {alignSelf: 'center', top: '5%',color: colors.white}]}>
            {convenient}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardYes: {
    backgroundColor: colors.white,
    height: '65%',
    width: normalize(136),
    borderWidth: 0.3,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderColor: colors.greenDark,
  },
  cardNo: {
    backgroundColor: colors.white,
    height: '65%',
    width: normalize(136),
    borderWidth: 0.3,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderColor: colors.bg,
  },
  label: {
    fontFamily: font.SarabunMedium,
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
    backgroundColor: '#56D88C',
    height: normalize(116),
    width: normalize(136),
    borderRadius: 15,
    borderWidth: 0.3,
    borderColor: colors.greenDark,
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

export default CardDetailDroner;
