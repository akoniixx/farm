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
import { TaskSuggestion } from '../../datasource/TaskSuggestion';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { initProfileState, profileReducer } from '../../hook/profilefield';
import { useIsFocused } from '@react-navigation/native';
import AllDroner from '../../components/Carousel/AllDronerUsed';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { FavoriteDroner } from '../../datasource/FavoriteDroner';
import FavDronerUsedList from '../../components/Carousel/FavDronerUsedList';
import * as RootNavigation from '../../navigations/RootNavigation';
import Text from '../../components/Text/Text';

const AllDronerUsed: React.FC<any> = ({ navigation }) => {
  const date = new Date();
  const isFocused = useIsFocused();
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [taskSug, setTaskSug] = useState<any[]>([]);
  const [taskSugUsed, setTaskSugUsed] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFav, setStatusFav] = useState<any[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    getProfile();
  }, [isFocused]);
  const getProfile = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value) {
      const farmer_id = await AsyncStorage.getItem('farmer_id');
      ProfileDatasource.getProfile(farmer_id!)
        .then(async res => {
          await AsyncStorage.setItem('plot_id', `${res.farmerPlot[0].id}`);
          dispatch({
            type: 'InitProfile',
            name: `${res.firstname}`,
            plotItem: res.farmerPlot,
            status: res.status,
          });
        })
        .catch(err => console.log(err));
    }
  };
  useEffect(() => {
    const dronerSug = async () => {
      const value = await AsyncStorage.getItem('token');
      if (value) {
        const farmer_id = await AsyncStorage.getItem('farmer_id');
        TaskSuggestion.searchDroner(
          farmer_id !== null ? farmer_id : '',
          profilestate.plotItem[0].id,
          date.toDateString(),
        )
          .then(res => {
            setTaskSug(res);
          })
          .catch(err => console.log(err))
          .finally(() => setLoading(false));
      }
    };
    const dronerSugUsed = async () => {
      setLoading(true);
      const value = await AsyncStorage.getItem('token');
      if (value) {
        const farmer_id = await AsyncStorage.getItem('farmer_id');
        const limit = 0;
        const offset = 0;
        TaskSuggestion.DronerUsed(
          farmer_id !== null ? farmer_id : '',
          profilestate.plotItem[0].id,
          date.toDateString(),
          limit,
          offset,
        )
          .then(res => {
            setTaskSugUsed(res);
          })
          .catch(err => console.log(err))
          .finally(() => setLoading(false));
      }
    };
    dronerSug();
    dronerSugUsed();
  }, [profilestate.plotItem]);

  useEffect(() => {
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
    getFavDroner();
  }, []);

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
          {taskSugUsed.length > 0 ? (
            <View>
              <ScrollView>
                {taskSugUsed.length != undefined &&
                  taskSugUsed.map((item: any, index: any) => (
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
                      <AllDroner
                        key={index}
                        index={index}
                        img={item.image_droner}
                        name={item.firstname + ' ' + item.lastname}
                        rate={item.rating_avg}
                        total_task={item.count_rating}
                        province={item.province_name}
                        distance={item.distance}
                        status={item.favorite_status}
                        callBack={async () => {
                          setLoading(true);
                          const farmer_id = await AsyncStorage.getItem(
                            'farmer_id',
                          );
                          const droner_id = taskSugUsed.map(x => x.droner_id);
                          await FavoriteDroner.addUnaddFav(
                            farmer_id !== null ? farmer_id : '',
                            droner_id[index],
                          )
                            .then(res => {
                              setRefresh(!refresh);
                              let newTaskSugUsed = taskSugUsed.map((x, i) => {
                                let result = {};
                                if (x.droner_id === item.droner_id) {
                                  let a =
                                    x.favorite_status === 'ACTIVE'
                                      ? 'INACTIVE'
                                      : 'ACTIVE';
                                  result = { ...x, favorite_status: a };
                                } else {
                                  result = { ...x };
                                }
                                return result;
                              });
                              setTaskSugUsed(newTaskSugUsed);
                            })
                            .catch(err => console.log(err))
                            .finally(() => setLoading(false));
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
    top: 15,
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.gray,
    fontWeight: '300',
  },
});
export default AllDronerUsed;
