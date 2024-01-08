import { normalize } from '@rneui/themed';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { dialCall } from '../../functions/utility';
import Text from '../Text/Text';
import ProgressiveImage from '../ProgressingImage/ProgressingImage';

interface props {
  name: string;
  nickname?: string;
  profile: string | null;
  telnumber?: string;
  confirmBook?: boolean;
}

export const DronerCard: React.FC<props> = ({
  name,
  nickname,
  profile,
  telnumber,
  confirmBook,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: confirmBook ? 0 : 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: confirmBook ? 'flex-start' : 'center',
        }}>
        <View
          style={{
            marginRight: normalize(10),
          }}>
          <ProgressiveImage
            borderRadius={28}
            source={
              profile === null ? image.defaultDronerImage : { uri: profile }
            }
            style={{
              borderRadius: normalize(28),
              borderColor: colors.white,
              borderWidth: 1,
              width: confirmBook !== true ? normalize(56) : normalize(20),
              height: confirmBook !== true ? normalize(56) : normalize(20),
              marginTop: confirmBook !== true ? 0 : normalize(2),
            }}
          />
        </View>
        {nickname ? (
          <View style={{ alignSelf: 'center' }}>
            <Text style={styles.name}>{nickname}</Text>
            <Text style={styles.fullname}>{name}</Text>
          </View>
        ) : (
          <View style={{ alignSelf: 'center' }}>
            <Text style={styles.name}>{name}</Text>
          </View>
        )}
      </View>
      {confirmBook !== true ? (
        <TouchableOpacity onPress={() => dialCall(telnumber)}>
          <Image
            source={icons.telephon}
            style={{ width: normalize(40), height: normalize(40) }}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  name: {
    fontFamily: fonts.SarabunLight,
    fontSize: normalize(18),
    color: colors.fontBlack,
    lineHeight: 30,
  },
  fullname: {
    fontFamily: fonts.SarabunLight,
    fontSize: normalize(16),
    color: colors.grey60,
    lineHeight: 30,
  },
});
