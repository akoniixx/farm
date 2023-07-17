import {Dimensions, TouchableOpacity, View} from 'react-native';
import React, {useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CardGuruKaset} from '../Carousel/CardGuruKaset';
import {colors} from '../../assets';
import {Carousel, Pagination} from 'react-native-snap-carousel';
import {CardGuru} from '../Guru/CardGuru';
import {momentExtend} from '../../function/utility';

interface Props {
  navigation?: any;
  guruKaset: {
    data: any[];
  };
  allScreen?: boolean;
}
export default function GuruKasetCarousel({
  navigation,
  guruKaset,
  allScreen = false,
}: Props) {
  const isCarousel = useRef(null);
  const screen = Dimensions.get('window');
  const [index, setIndex] = React.useState(0);

  return (
    <View>
      {allScreen ? (
        <Carousel
          autoplay={true}
          autoplayInterval={7000}
          autoplayDelay={5000}
          loop={true}
          hasParallaxImages
          ref={isCarousel}
          data={guruKaset.data}
          sliderWidth={screen.width}
          itemWidth={screen.width - 48}
          onSnapToItem={(idx: number) => setIndex(idx)}
          useScrollView={true}
          vertical={false}
          renderItem={({item}: any) => {
            return (
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 32,
                }}
                onPress={async () => {
                  await AsyncStorage.setItem('guruId', `${item.id}`);
                  navigation.push('DetailGuruScreen');
                }}>
                <CardGuru
                  key={index}
                  isPinned
                  index={item.index}
                  background={item.image_path}
                  title={item.title}
                  date={momentExtend.toBuddhistYear(
                    item.created_at,
                    'DD MMM YY',
                  )}
                  read={item.read}
                />
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <Carousel
          autoplay={true}
          autoplayInterval={7000}
          autoplayDelay={5000}
          loop={true}
          ref={isCarousel}
          data={guruKaset.data}
          sliderWidth={screen.width}
          itemWidth={screen.width}
          onSnapToItem={(idx: number) => setIndex(idx)}
          useScrollView={true}
          vertical={false}
          renderItem={({item}: any) => {
            return (
              <TouchableOpacity
                onPress={async () => {
                  await AsyncStorage.setItem('guruId', `${item.id}`);
                  navigation.push('DetailGuruScreen');
                }}>
                <CardGuruKaset background={item.image_path} />
              </TouchableOpacity>
            );
          }}
        />
      )}
      {allScreen ? (
        <View>
          <Pagination
            containerStyle={{
              paddingVertical: 0,
              marginBottom: 16,
            }}
            dotsLength={guruKaset?.data?.length}
            activeDotIndex={index}
            carouselRef={isCarousel}
            dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 5,
              marginHorizontal: 0,
              backgroundColor: colors.fontBlack,
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.9}
            tappableDots={true}
          />
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
            right: Dimensions.get('window').width / 2 - 72,
            top: '60%',
          }}>
          <Pagination
            dotsLength={guruKaset?.data?.length}
            activeDotIndex={index}
            carouselRef={isCarousel}
            dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 5,
              marginHorizontal: 0,
              backgroundColor: colors.fontBlack,
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.9}
            tappableDots={true}
          />
        </View>
      )}
    </View>
  );
}
