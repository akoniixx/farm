import { View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { mixpanel } from '../../../../mixpanel';
import DronerNearMeList from '../../../components/Carousel/DronerNearMeList';

interface Props {
  navigation: any;
  data: Array<any>;
  isLoading: boolean;
}
export default function DronerNearMe({ navigation, isLoading, data }: Props) {
  return (
    <View style={{ height: 'auto' }}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {data.length !== undefined &&
          (isLoading ? [1, 2, 3] : data).map((item: any, index: any) => (
            <TouchableOpacity
              key={index}
              onPress={async () => {
                navigation.navigate('BeforeLoginScreen');
              }}>
              <DronerNearMeList
                isLoading={isLoading}
                index={index}
                profile={item.image_droner}
                background={item.task_image}
                name={item.firstname + ' ' + item.lastname}
                rate={item.rating_avg}
                total_task={item.count_rating}
                province={item.province_name}
                distance={item.street_distance}
                status={item.favorite_status}
              />
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}
