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

const FavDronerUsed: React.FC<any> = ({ navigation }) => {
  const date = new Date();
  const [taskSugUsed, setTaskSugUsed] = useState<any[]>([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [statusFav, setStatusFav] = useState<any[]>([]);

  const dronerSugUsed = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value) {
      const farmer_id = await AsyncStorage.getItem('farmer_id');
      const plot_id = await AsyncStorage.getItem('plot_id');
      const limit = 8;
      const offset = 0;
      TaskSuggestion.DronerUsed(
        farmer_id!,
        plot_id!,
        date.toDateString(),
        limit,
        offset,
      )
        .then(res => {
          setTaskSugUsed(res);
        })
        .catch(err => console.log(err));
    }
  };
  
  useEffect(() => {
    const getFavDroner = async () => {
      setLoading(true);
      const farmer_id = await AsyncStorage.getItem('farmer_id');
      const plot_id = await AsyncStorage.getItem('plot_id');
      FavoriteDroner.findAllFav(
          farmer_id!,
          plot_id!,
        )
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
        alignItems: 'center'
      }}>
      <ScrollView>
        <View style={{paddingVertical:10}}>
          {statusFav.length !== 0 ? (
            statusFav.map((item:any, index:any) => (
              <FavDronerUsedList
                index={index}
                img={item.image_droner}
                name={item.firstname + ' ' + item.lastname}
                rate={item.rating_avg}
                total_task={item.count_rating}
                province={item.province_name}
                distance={item.distance}
              />
            ))
          ) : (
            <View style={[styles.layout]}>
              <Image
                source={image.empty_droner_his}
                style={{ width: normalize(135), height: normalize(120) }}
              />
              <Text style={[styles.text]}>ไม่มีนักบินโดรนที่ถูกใจ</Text>
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
    marginTop: 150
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
