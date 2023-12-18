import { View, useWindowDimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { Carousel, Pagination } from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardGuruKaset } from '../../../components/Carousel/GuruKaset';
import { colors } from '../../../assets';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

interface Props {
  data: {
    data: {
      image_path: string;
    }[];
  };
  navigation: any;
  isLoading: boolean;
}
export default function CarouselMainScreen({
  data,
  navigation,
  isLoading,
}: Props) {
  const screen = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const isCarousel = React.useRef(null);
  if (isLoading) {
    return (
      <View>
        <SkeletonPlaceholder
          borderRadius={10}
          speed={2000}
          backgroundColor={colors.skeleton}>
          <SkeletonPlaceholder.Item
            flexDirection="row"
            alignItems="center"
            style={{ paddingHorizontal: 16 }}>
            <View style={{ width: '100%', height: 130 }} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>

        <View
          style={{
            alignItems: 'center',
            top: -10,
            marginVertical: -10,
          }}>
          <Pagination
            dotsLength={Array.from(Array(5).keys()).length}
            activeDotIndex={index}
            carouselRef={isCarousel}
            dotStyle={{
              width: 8,
              height: 8,
              borderRadius: 5,
              backgroundColor: colors.fontGrey,
            }}
            dotContainerStyle={{ marginHorizontal: 4 }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.9}
            tappableDots={true}
          />
        </View>
      </View>
    );
  }
  return (
    <View>
      <Carousel
        autoplay={true}
        autoplayInterval={7000}
        autoplayDelay={5000}
        loop={true}
        ref={isCarousel}
        data={data.data}
        sliderWidth={screen.width}
        itemWidth={screen.width}
        onSnapToItem={index => setIndex(index)}
        useScrollView={true}
        vertical={false}
        renderItem={({ item }: any) => {
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
      <View
        style={{
          alignItems: 'center',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          height: 'auto',
        }}>
        <Pagination
          dotsLength={data.data.length}
          activeDotIndex={index}
          containerStyle={{
            paddingVertical: 0,
            paddingHorizontal: 0,
            marginTop: 4,
            marginBottom: 12,
            marginHorizontal: 0,
          }}
          carouselRef={isCarousel}
          dotStyle={{
            width: 8,
            height: 8,
            borderRadius: 5,
            backgroundColor: colors.fontGrey,
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.9}
          tappableDots={true}
          dotContainerStyle={{ marginHorizontal: 4 }}
        />
      </View>
    </View>
  );
}
