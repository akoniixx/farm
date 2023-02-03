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
  province: any;
  distance: any;
  total_task: any;
}
export function StatusObject(status: string) {
  switch (status) {
    case 'ACTIVE':
      return {
        status: 'รอการตรวจสอบ',
        colorBg: '#FFF2E3',
        fontColor: '#E27904',
        borderColor: colors.darkOrange,
      };
    case 'INACTIVE':
      return {
        status: 'ตรวจสอบแล้ว',
        colorBg: colors.white,
        fontColor: colors.greenLight,
        borderColor: colors.greenLight,
      };
    default:
      return {
        status: 'รอการตรวจสอบ',
        colorBg: '#FFF2E3',
        fontColor: '#E27904',
        borderColor: colors.darkOrange,
      };
  }
}
const FavDronerUsedList: React.FC<data> = ({
  index,
  img,
  name,
  rate,
  province,
  distance,
  total_task,
}) => {
  const [statusFav, setStatusFav] = useState<any>();

  useEffect(() => {
    favDroner();
  }, []);
  const favDroner = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const plot_id = await AsyncStorage.getItem('plot_id');
    FavoriteDroner.findAllFav(farmer_id!, plot_id!).then(res =>
      setStatusFav(res),
    );
  };
  console.log(1,statusFav)

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
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.title}>{name}</Text>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                  }}>
                  <Image
                    source={icons.heart_active}
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      top: 4,
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={icons.star}
                  style={{
                    width: normalize(18),
                    height: normalize(20),
                    marginHorizontal: -50,
                    marginLeft: 10,
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.fontGrey,
                    bottom: 2,
                  }}>
                  {rate !== null
                    ? `${parseFloat(rate).toFixed(1)} คะแนน  `
                    : `0 คะแนน`}{' '}
                  <Text
                    style={{
                      fontFamily: fonts.SarabunLight,
                      fontSize: normalize(16),
                      color: colors.fontGrey,
                      fontWeight: '100',
                    }}>
                    {total_task !== null ? `(${total_task})` : `  (0)`}
                  </Text>
                </Text>
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
          </View>
          <View
            style={{
              borderColor: '#F2F3F4',
              borderBottomWidth: 1,
              width: 20,
              marginTop: 8,
              minWidth: 340,
            }}></View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: normalize(10),
              alignItems: 'center',
              paddingVertical: 5,
            }}>
            <Image
              source={icons.location}
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
                height: 'auto',
                lineHeight: 30,
              }}>
              {'จ.' + province}
            </Text>
            <Image
              source={icons.distance}
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
                height: 'auto',
                lineHeight: 30,
              }}>
              {distance !== null
                ? `ห่างคุณ ${parseFloat(distance).toFixed(0)} กม.`
                : `0 กม.`}{' '}
            </Text>
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
    color: colors.primary,
    fontWeight: '600',
    marginHorizontal: 10,
    marginLeft: 10,
    lineHeight: 40,
  },
  cards: {
    height: 'auto',
    width: normalize(355),
    borderWidth: 0.5,
    borderColor: '#D9DCDF',
    backgroundColor: '#F7FFF0',
    borderRadius: normalize(12),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    marginBottom: normalize(5),
  },
});

export default FavDronerUsedList;
