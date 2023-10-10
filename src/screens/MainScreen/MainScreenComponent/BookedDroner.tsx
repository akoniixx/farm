import { View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { colors, font } from '../../../assets';
import { normalize } from '../../../functions/Normalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DronerUsedList from '../../../components/Carousel/DronerUsedList';
import Text from '../../../components/Text/Text';
import { Image } from 'react-native';
import image from '../../../assets/images/image';
import { FavoriteDroner } from '../../../datasource/FavoriteDroner';

interface Props {
  navigation: any;
  taskSugUsed: Array<any>;
  setTaskSugUsed: (taskSugUsed: Array<any>) => void;
  isLoading: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function BookedDroner({
  navigation,
  taskSugUsed = [],
  setTaskSugUsed,

  isLoading = false,
  setRefresh,
}: Props) {
  return (
    <>
      {taskSugUsed.length < 1 && !isLoading ? (
        <View style={{ alignItems: 'center' }}>
          <Image
            source={image.empty_droner}
            style={{
              width: normalize(136),
              height: normalize(130),
              top: '16%',
              marginBottom: normalize(32),
            }}
          />
          <Text
            style={{
              top: '10%',
              fontFamily: font.SarabunBold,
              fontSize: normalize(16),
              fontWeight: '300',
              color: colors.gray,
            }}>
            ไม่มีนักบินโดรนที่เคยจ้าง
          </Text>
        </View>
      ) : (
        <View style={{ height: 'auto' }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {(isLoading ? [1, 2] : taskSugUsed).map(
              (item: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={async () => {
                    await AsyncStorage.setItem(
                      'droner_id',
                      `${item.droner_id}`,
                    );
                    navigation.push('DronerDetail');
                  }}>
                  <DronerUsedList
                    card="taskSugUsed"
                    isLoading={isLoading}
                    key={index}
                    index={index}
                    dronerId={item.droner_id}
                    profile={item.image_droner}
                    background={item.task_image}
                    name={item.firstname + ' ' + item.lastname}
                    rate={item.rating_avg}
                    total_task={item.count_rating}
                    province={item.province_name}
                    distance={item.street_distance}
                    status={item.favorite_status}
                    callBack={async () => {
                      setTimeout(async () => {
                        const farmer_id = await AsyncStorage.getItem(
                          'farmer_id',
                        );
                        const droner_id = taskSugUsed.map(x => x.droner_id);
                        await FavoriteDroner.addUnaddFav(
                          farmer_id !== null ? farmer_id : '',
                          droner_id[index],
                          item.street_distance,
                        )
                          .then(() => {
                            setRefresh(prev => !prev);
                            let newTaskSugUsed = taskSugUsed.map(x => {
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
                          .finally();
                      }, 500);
                    }}
                  />
                </TouchableOpacity>
              ),
            )}
          </ScrollView>
        </View>
      )}
    </>
  );
}
