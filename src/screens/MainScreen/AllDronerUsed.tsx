import React, { useEffect, useReducer, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
} from 'react-native';
import { colors, font, image } from '../../assets';
import { normalize } from '../../functions/Normalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskSuggestion } from '../../datasource/TaskSuggestion';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { initProfileState, profileReducer } from '../../hook/profilefield';
import { useIsFocused } from '@react-navigation/native';
import AllDroner from '../../components/Carousel/AllDronerUsed';

const AllDronerUsed: React.FC<any> = ({ navigation }) => {
  const date = new Date();
  const isFocused = useIsFocused();
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [taskSugUsed, setTaskSugUsed] = useState<any[]>([]);

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
            console.log(res[0])
            setTaskSugUsed(res);
          })
          .catch(err => console.log(err));
      }
    };
    dronerSugUsed();
  }, [profilestate.plotItem]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View>
        {taskSugUsed !== undefined ? (
          taskSugUsed.map((item, index) => (
            <AllDroner
              index={index}
              img={item.image_droner}
              name={item.firstname + ' ' + item.lastname}
              rate={item.rating_avg}
              total_task={item.total_task}    
              province={item.province_name}
              distance={item.distance}      />
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '50%',
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
