import {Image, StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {normalize} from '../../functions/Normalize';
import {colors, font, icons, image} from '../../assets';
import fonts from '../../assets/fonts';
import {Avatar} from '@rneui/base';

interface DetailData {
  index: number;
  days: string;
  dateTime: string;
  convenient: string;
}

export const CardDetailDroner: React.FC<DetailData> = ({
  index,
  days,
  dateTime,
  convenient,
}) => {
  return (
    <View style={{flex: 1, paddingHorizontal: 5, left: '10%'}}>
        {convenient == 'สะดวก' ? 
          <View style={[styles.cards]}>
          <View key={index} style={[styles.cardYes]}>
            <Text style={[styles.label,{alignSelf: 'center', top: 20}]}>
              {days}
            </Text>
            <Text style={[styles.label,{paddingHorizontal: normalize(30), top: 30} ]}>{dateTime}</Text>
            <Text style={[styles.label, {top: 50,color: colors.white}]}>
              {convenient}
            </Text>
          </View>
        </View>
       :   <View style={[styles.cardsNo]}>
       <View key={index} style={[styles.cardNo]}>
         <Text style={[styles.label,,{alignSelf: 'center', top: 20}]}>
           {days}
         </Text>
         <Text style={[styles.label,{paddingHorizontal: normalize(30), top: 30} ]}>{dateTime}</Text>
         <Text style={[styles.label, {top: 50,color: colors.error}]}>
           {convenient}
         </Text>
       </View>
     </View>}
    
    </View>
  );
};

const styles = StyleSheet.create({
  cardYes: {
    backgroundColor: colors.white,
    height: '65%',
    width: normalize(136),
    borderWidth: 1,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderColor: colors.greenLight,
  },
  cardNo: {
    backgroundColor: colors.white,
    height: '65%',
    width: normalize(136),
    borderWidth: 0.3,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderColor: colors.gray,
  },

  label: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(16),
    color: colors.fontBlack,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  h1: {
    color: colors.primary,
    fontFamily: font.SarabunBold,
    fontSize: normalize(18),
  },
  cardsNo: {
    backgroundColor: '#FFD9D9',
    height: normalize(116),
    width: normalize(136),
    borderRadius: 15,
    borderWidth: 0.3,
    borderColor: colors.gray,
  },
  cards: {
    backgroundColor:colors.greenLight,
    height: normalize(116),
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.greenLight,
  },
});

