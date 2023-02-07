import React, { useEffect, useReducer, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
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

const AllDronerUsed: React.FC<any> = ({ navigation }) => {
  const date = new Date();
  const isFocused = useIsFocused();
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [taskSugUsed, setTaskSugUsed] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFav, setStatusFav] = useState<any[]>([]);
  const [dataFav, setDataFav] = useState<any[]>([]);
  const [dataUsed, setDataUsed] = useState<any[]>([]);

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

  const dronerAll = [...new Set([...taskSugUsed, ...statusFav])];
  const baseStatus = taskSugUsed.map(x => x.droner_id);
  const dronerQ =
    statusFav !== null ? statusFav.map(x => x.droner_id) : baseStatus;
  const arr1 = baseStatus;
  const arr2 = dronerQ;
  
  const QDroner = arr1.map(el => {
    const getDroner = el;
    const find = arr2.find(item => {
      const data = statusFav.map((x)=>x.droner_id === item) && statusFav;
      console.log(data.length)
      const d = item;
      return d === getDroner;
    });
    if (find) {
      return {
        img: find,
        name: '',
        rate: '',
        province: '',
        distance: '',
        total_task: '',
        status_favorite: 'ACTIVE',
      };
    }
    return {
      img: el,
      name: '',
      rate: '',
      province: '',
      distance: '',
      total_task: '',
      status_favorite: 'INACTIVE',
    };
  });
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
          {statusFav.length !== 0 ? (
            <ScrollView>
              {statusFav.length !== 0 &&
                QDroner.map((item: any, index: any) => (
                  <AllDroner
                    key={index}
                    index={index}
                    img={item.img}
                    name={item.img}
                    rate={item.rate}
                    total_task={item.total_task}
                    province={item.province}
                    distance={item.distance}
                    status={item.status_favorite}
                  />
                ))}
            </ScrollView>
          ) : (
            <View style={{ height: '110%' }}>
              <ScrollView>
                {taskSugUsed.map((item: any, index: any) => (
                  <AllDroner
                    key={index}
                    index={index}
                    img={item.image_droner}
                    name={item.firstname + ' ' + item.lastname}
                    rate={item.rating_avg}
                    total_task={item.count_rating}
                    province={item.province_name}
                    distance={item.distance}
                    status={item.status_favorite}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        {/* <View style={{ paddingVertical: 10 }}>
          {taskSugUsed.length !== 0 ? (
            dronerAll.map((item, index) => (
              <AllDroner
                index={index}
                img={item.image_droner}
                name={item.firstname + ' ' + item.lastname}
                rate={item.rating_avg}
                total_task={item.count_rating}
                province={item.province_name}
                distance={item.distance}
                status={item.status_favorite}
              />
            ))
          ) : (
             <View style={[styles.layout]}>
              <Image
                source={image.empty_droner_his}
                style={{ width: normalize(135), height: normalize(120) }}
              />
              <Text style={[styles.text]}>ไม่มีนักบินโดรนที่เคยจ้าง</Text>
            </View>
          )} 
        </View> */}
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
