import { View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { mixpanel } from '../../../../mixpanel';
import DronerSugg from '../../../components/Carousel/DronerCarousel';
import { FavoriteDroner } from '../../../datasource/FavoriteDroner';
import DronerUsedList from '../../../components/Carousel/DronerUsedList';

interface Props {
  navigation: any;
  taskSug: Array<any>;
  setTaskSug: (taskSug: Array<any>) => void;
  isLoading: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function DronerSuggestion({
  navigation,
  isLoading,
  setTaskSug,
  taskSug,
  setRefresh,
}: Props) {
  return (
    <View style={{ height: 'auto' }}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {taskSug.length !== undefined &&
          (isLoading ? [1, 2, 3] : taskSug).map((item: any, index: any) => (
            <TouchableOpacity
              key={index}
              onPress={async () => {
                await AsyncStorage.setItem('droner_id', `${item.droner_id}`);
                mixpanel.track('MainScreen_ButtonDronerSuggest_Press', {
                  dronerId: item.droner_id,
                  navigateTo: 'DronerDetailScreen',
                });
                navigation.push('DronerDetail');
              }}>
              <DronerUsedList
                card="taskSug"
                key={index}
                index={index}
                profile={item.image_droner}
                background={item.task_image}
                name={item.firstname + ' ' + item.lastname}
                rate={item.rating_avg}
                total_task={item.count_rating}
                province={item.province_name}
                distance={item.street_distance}
                status={item.favorite_status}
                isLoading={isLoading}
                dronerId={item.droner_id}
                callBack={async () => {
                  setTimeout(async () => {
                    const farmer_id = await AsyncStorage.getItem('farmer_id');
                    const droner_id = taskSug.map(x => x.droner_id);
                    await FavoriteDroner.addUnaddFav(
                      farmer_id !== null ? farmer_id : '',
                      droner_id[index],
                      item.street_distance
                    )
                      .then(() => {
                        setRefresh(prev => !prev);
                        let newTaskSug = taskSug.map(x => {
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
                        console.log(newTaskSug);
                        setTaskSug(newTaskSug);
                      })
                      .catch(err => console.log(err))
                      .finally();
                  }, 500);
                }}
              />
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}
