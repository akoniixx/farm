import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
} from 'react-native';
import React from 'react';
import { normalize, width } from '../../functions/Normalize';
import { colors, font, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { Avatar } from '@rneui/base';

interface DetailData {
  index: number;
  date: string;
  month: string;
  year: string;
  convenient: string;
}

export const CardDetailDroner: React.FC<DetailData> = ({
  index,
  date,
  month,
  year,
  convenient,
}) => {
  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      {convenient == 'สะดวก' ? (
        <View>
          <View key={index} style={[styles.cardYes]}>
            <View>
              <Text style={[styles.label]}>{date}</Text>
              <Text style={[styles.label]}>{month}</Text>
              <Text style={[styles.label]}>{year}</Text>
              <Image
                source={icons.dotGreen}
                style={{ width: 10, height: 10, alignSelf: 'center' }}
              />
            </View>
          </View>
        </View>
      ) : (
        <View>
          <View key={index} style={[styles.cardNo]}>
            <View>
              <Text style={[styles.label, { color: colors.gray }]}>{date}</Text>
              <Text style={[styles.label, { color: colors.gray }]}>
                {month}
              </Text>
              <Text style={[styles.label, { color: colors.gray }]}>{year}</Text>
              <Image
                source={icons.dotRed}
                style={{ width: 10, height: 10, alignSelf: 'center' }}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardYes: {
    backgroundColor: '#ECFBF2',
    height: 'auto',
    width: normalize(60),
    borderRadius: 15,
    paddingVertical: 10,
  },
  cardNo: {
    backgroundColor: '#F8F9FA',
    height: 'auto',
    width: normalize(60),
    borderRadius: 15,
    paddingVertical: 10,
  },

  label: {
    ...Platform.select({
      ios: {
        fontFamily: font.SarabunMedium,
        fontSize: normalize(18),
        color: colors.fontBlack,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(5),
      },
      android: {
        fontFamily: font.SarabunMedium,
        fontSize: normalize(18),
        color: colors.fontBlack,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      },
    }),
  },
});
