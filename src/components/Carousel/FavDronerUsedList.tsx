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
import Spinner from 'react-native-loading-spinner-overlay/lib';

interface data {
  img: any;
  name: any;
  rate: any;
  province: any;
  distance: any;
  total_task: any;
  status: any;
  status_used: any;
  callBack: () => void;
}
const FavDronerUsedList: React.FC<data> = ({
  img,
  name,
  rate,
  province,
  distance,
  total_task,
  status,
  status_used,
  callBack,
}) => {
  const [favAll, setFavAll] = useState<any[]>([]);
  const [taskSug, setTaskSug] = useState<any[]>([]);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const date = new Date();

  useEffect(() => {
    getFavDroner();
  }, []);
  const getFavDroner = async () => {
    setLoading(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const plot_id = await AsyncStorage.getItem('plot_id');
    FavoriteDroner.findAllFav(farmer_id!, plot_id!)
      .then(res => {
        setFavAll(res);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 5,
        alignSelf: 'center',
        paddingHorizontal: 10,
        width: '100%',
      }}>
      <View
        style={[
          styles.cards,
          { backgroundColor: !status_used ? colors.white : '#F7FFF0' },
        ]}>
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
                }}>
                <Text style={styles.title}>{name}</Text>
                <View style={{ marginLeft: 45 }}>
                  <View
                    style={{
                      backgroundColor: colors.white,
                      borderColor: colors.bg,
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      borderWidth: 0.5,
                    }}>
                    <TouchableOpacity onPress={callBack}>
                      <Image
                        source={
                          status === 'ACTIVE' ? icons.heart_active : icons.heart
                        }
                        style={{
                          alignSelf: 'center',
                          width: 20,
                          height: 20,
                          top: 4,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.star}
                  style={{
                    width: normalize(18),
                    height: normalize(20),
                    marginLeft: 10,
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.SarabunMedium,
                    fontSize: normalize(16),
                    color: colors.fontGrey,
                    bottom: 2,
                    marginLeft: 5,
                    width: 130,
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
                {status_used === true ? (
                  <View style={{ marginLeft: 70 }}>
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
                ) : null}
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
                width: 140,
              }}>
              {province !== null ? 'จ.' + province : 'จ. -'}
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
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
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
    width: 200,
  },
  cards: {
    height: 'auto',
    width: normalize(355),
    borderWidth: 0.5,
    borderColor: '#D9DCDF',
    // backgroundColor: '#F7FFF0',
    borderRadius: normalize(12),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    marginBottom: normalize(5),
  },
  cardsSugg: {
    height: 'auto',
    width: normalize(355),
    borderWidth: 0.5,
    borderColor: '#D9DCDF',
    backgroundColor: colors.white,
    borderRadius: normalize(12),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    flexDirection: 'row',
    marginBottom: normalize(5),
  },
});

export default FavDronerUsedList;
