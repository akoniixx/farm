import { View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { mixpanel } from '../../../../mixpanel';
import DronerSugg from '../../../components/Carousel/DronerCarousel';
import { FavoriteDroner } from '../../../datasource/FavoriteDroner';
import Text from '../../../components/Text/Text';

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
                await AsyncStorage.setItem('droner_id', `${item.droner_id}`);
                mixpanel.track('MainScreen_ButtonDronerSuggest_Press', {
                  dronerId: item.droner_id,
                  navigateTo: 'DronerDetailScreen',
                });
                navigation.push('DronerDetail');
              }}>
              <Text>test</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}
