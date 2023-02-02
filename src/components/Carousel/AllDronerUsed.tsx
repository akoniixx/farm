import { Image, StyleSheet, Text, View, TextInput } from 'react-native';
import React from 'react';
import { normalize } from '../../functions/Normalize';
import { colors, font, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { Avatar } from '@rneui/themed';

interface DataDroner {
  index: number;
  img: string;
  name: string;
  rate: string;
  province: string;
  distance: string;
  total_task: any;
}
const AllDroner: React.FC<DataDroner> = ({
  index,
  img,
  name,
  rate,
  province,
  distance,
  total_task
}) => {
  return (
    <View
      key={index}
      style={{
        height: normalize(151),
        borderWidth: 0.5,
        borderColor: colors.gray,
        backgroundColor: colors.white,
        borderRadius: normalize(12),
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(20),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(10),
      }}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <View>
          <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
            <Avatar
              size={normalize(56)}
              source={img === null ? image.empty_plot : { uri: img }}
              avatarStyle={{
                borderRadius: normalize(40),
                borderColor: colors.white,
                borderWidth: 1,
              }}
            />
            <Text style={styles.title}>{name}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={icons.star}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            <Text style={styles.label}>{`${parseFloat(rate).toFixed(1)} คะแนน  `} </Text>
            <Text style={styles.label}>{total_task} </Text>

          </View>

          <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.SarabunMedium,
                fontSize: normalize(16),
                color: colors.fontGrey,
                marginRight: '10%',
                width: normalize(140),
              }}>
              {province}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.SarabunMedium,
                fontSize: normalize(16),
                color: colors.fontGrey,
                marginRight: '10%',
                width: normalize(140),
              }}>
              {`ห่างคุณ  ${parseFloat(distance).toFixed(0)}  กม.`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: font.SarabunBold,
    fontSize: normalize(18),
    color: '#0D381F',
  },
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(14),
    color: colors.fontGrey,
  },
});

export default AllDroner;
