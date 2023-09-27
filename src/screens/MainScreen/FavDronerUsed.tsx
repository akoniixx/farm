import React, { useEffect, useReducer, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import { colors, font, image } from '../../assets';
import { normalize } from '../../functions/Normalize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useIsFocused } from '@react-navigation/native';

import Spinner from 'react-native-loading-spinner-overlay/lib';
import { FavoriteDroner } from '../../datasource/FavoriteDroner';
import FavDronerUsedList from '../../components/Carousel/FavDronerUsedList';
import * as RootNavigation from '../../navigations/RootNavigation';
import Text from '../../components/Text/Text';

const FavDronerUsed: React.FC<any> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [statusFav, setStatusFav] = useState<any[]>([]);

  useEffect(() => {
    getFavDroner();
  }, [isFocused, refresh]);
  const getFavDroner = async () => {
    setLoading(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const plot_id = await AsyncStorage.getItem('plot_id');
    FavoriteDroner.findAllFav(farmer_id!, plot_id!)
      .then(res => {
        setStatusFav(res);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F8F9FA',
        width: '100%',
        alignItems: 'center',
      }}>
      <ScrollView>
        <View style={{ paddingVertical: 10 }}>
          {statusFav.length != 0 ? (
            <View>
              <ScrollView>
                {statusFav.length != undefined &&
                  statusFav.map((item: any, index: any) => (
                    <TouchableOpacity
                      key={index}
                      onPress={async () => {
                        await AsyncStorage.setItem(
                          'droner_id',
                          `${item.droner_id}`,
                        );
                        RootNavigation.navigate('Main', {
                          screen: 'DronerDetail',
                        });
                      }}>
                      <FavDronerUsedList
                        key={index}
                        img={item.image_droner}
                        name={item.firstname + ' ' + item.lastname}
                        rate={item.rating_avg}
                        total_task={item.count_rating}
                        province={item.province_name}
                        distance={item.distance}
                        status_used={item.status_ever_used}
                        status={item.status_favorite}
                        callBack={async () => {
                          setTimeout(async () => {
                            const farmer_id = await AsyncStorage.getItem(
                              'farmer_id',
                            );
                            const droner_id = statusFav.map(x => x.droner_id);
                            await FavoriteDroner.addUnaddFav(
                              farmer_id !== null ? farmer_id : '',
                              droner_id[index],
                            )
                              .then(res => {
                                setRefresh(!refresh);
                              })
                              .catch(err => console.log(err))
                              .finally(() => setLoading(false));
                          }, 500);
                        }}
                      />
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          ) : (
            <View>
              <View style={[styles.layout]}>
                <Image
                  source={image.empty_droner_his}
                  style={{ width: normalize(135), height: normalize(120) }}
                />
                <Text style={[styles.text]}>ไม่มีนักบินโดรนที่ถูกใจ</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  text: {
    marginTop: 15,
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.gray,
    fontWeight: '300',
    lineHeight: 30,
    paddingHorizontal: 10,
  },
});
export default FavDronerUsed;
