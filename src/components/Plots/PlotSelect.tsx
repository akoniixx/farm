import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors, font, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize } from '../../functions/Normalize';

interface Prop {
  id: string;
  plotName: string;
  raiAmount: number;
  plantName: string;
  locationName: string;
  onPress: () => void;
  selected: boolean;
}

const PlotSelect: React.FC<Prop> = ({
  id,
  plotName,
  raiAmount,
  plantName,
  locationName,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.card,
          selected && styles.selected,
          { justifyContent: 'center' },
        ]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.h1}>{plotName}</Text>
          <Image
            style={{ width: normalize(24), height: normalize(24) }}
            source={selected ? image.checked : image.uncheck}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
          <Image
            source={icons.plot}
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
              marginRight: '40%',
              bottom: 2,
            }}>
            {raiAmount + ' ' + 'ไร่'}
          </Text>
          <Image
            source={icons.plant}
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
              marginRight: '10%',
              bottom: 2,
            }}>
            {plantName}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
          <Image
            source={icons.location}
            style={{
              width: normalize(18),
              height: normalize(20),
              marginRight: normalize(10),
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.SarabunMedium,
              fontSize: normalize(16),
              color: colors.fontGrey,
              marginRight: '10%',

              bottom: 2,
            }}>
            {locationName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PlotSelect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: normalize(340),
    height: normalize(130),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#C0C5CA',
    margin: normalize(10),
    borderRadius: normalize(10),
    padding: normalize(10),
  },
  selected: {
    borderColor: '#2EC46D',
    backgroundColor: 'rgba(46, 196, 109, 0.05)',
    borderWidth: 2,
  },
  title: {
    fontWeight: 'bold',
  },
  h1: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(20),
    colors: '#0D381F',
  },
});
