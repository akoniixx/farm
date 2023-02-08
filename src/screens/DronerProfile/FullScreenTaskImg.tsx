import { Avatar } from '@rneui/base/dist/Avatar/Avatar';
import React, { useEffect, useReducer, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlightBase,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons, image } from '../../assets';
import { MainButton } from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import { height, normalize } from '../../functions/Normalize';
import { stylesCentral } from '../../styles/StylesCentral';
import { TaskSuggestion } from '../../datasource/TaskSuggestion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageSlider } from 'react-native-image-slider-banner';

import {
  detailDronerReducer,
  initDetailDronerState,
} from '../../hook/profilefield';
import moment from 'moment';
import { CardDetailDroner } from '../../components/Carousel/CardTaskDetailDroner';
import { SliderHeader } from 'react-native-image-slider-banner/src/sliderHeader';
import Animated from 'react-native-reanimated';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { FavoriteDroner } from '../../datasource/FavoriteDroner';

const FullScreenTaskImg: React.FC<any> = ({ navigation, route }) => {
  const { width } = Dimensions.get('window');
  const height = width * 0.6;
  const [imageTask, setImageTask] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [getImg, setGetImg] = useState<any>();
  const date = new Date().toLocaleDateString();
  useEffect(() => {
    dronerDetails();
    mathImg();
  }, []);
  const dronerDetails = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const droner_id = await AsyncStorage.getItem('droner_id');
    const plot_id = await AsyncStorage.getItem('plot_id');
    const limit = 0;
    const offset = 0;
    TaskSuggestion.DronerDetail(
      farmer_id!,
      plot_id!,
      droner_id!,
      date,
      limit,
      offset,
    )
      .then(res => {
        setImageTask(res[0].image_task);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  const mathImg = async () => {
    const taskImg = await AsyncStorage.getItem('imgTask');
    const words = imageTask.map((x)=>x);
        setGetImg(taskImg);
  };
  return (
    <SafeAreaView
      style={{ backgroundColor: '#020804', width: '100%', height: '100%' }}>
      <View style={{ padding: 15 }}>
        <TouchableOpacity onPress={() => navigation.navigate('DronerDetail')}>
          <Image source={icons.closeImg} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
        <View style={{ marginTop: '50%', alignItems: 'center' }}>
          <ScrollView
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ width, height }}>
          {imageTask.map((item, index) => (
             <ImageBackground key={index} source={{ uri: item }} style={{ width, height }}>
           </ImageBackground>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default FullScreenTaskImg;
