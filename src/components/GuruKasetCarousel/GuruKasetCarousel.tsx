import {Dimensions, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CardGuruKaset} from '../Carousel/CardGuruKaset';
import {colors} from '../../assets';
import {Carousel, Pagination} from 'react-native-snap-carousel';
import {CardGuru} from '../Guru/CardGuru';
import {momentExtend} from '../../function/utility';
import MaintenanceHeader from './MaintenanceHaeder';
import {useMaintenance} from '../../contexts/MaintenanceContext';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {normalize} from '../../function/Normalize';

interface Props {
  navigation?: any;
  guruKaset: {
    data: any[];
  };
  allScreen?: boolean;
  loading?: boolean;
}
export default function GuruKasetCarousel({
  navigation,
  guruKaset,
  allScreen = false,
  loading = false,
}: Props) {
  const isCarousel = useRef(null);
  const screen = Dimensions.get('window');
  const [index, setIndex] = React.useState(0);
  const {notiMaintenance, maintenanceData} = useMaintenance();

  const guruKasetData = useMemo(() => {
    if (notiMaintenance) {
      return [
        {
          ...maintenanceData,
          isMaintenance: true,
        },
        ...guruKaset.data,
      ];
    }

    return guruKaset.data;
  }, [notiMaintenance, guruKaset.data, maintenanceData]);
  return (
    <View>
      {allScreen ? (
        <>
          <Carousel
            autoplay={true}
            autoplayInterval={7000}
            autoplayDelay={5000}
            loop={true}
            hasParallaxImages
            ref={isCarousel}
            data={guruKaset.data.filter(el => el.pin_all)}
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
        </>
      ) : (
        <>
          {loading ? (
            <View
              style={{
                padding: 10,
                width: '100%',
              }}>
              <SkeletonPlaceholder
                backgroundColor={colors.skeleton}
                speed={2000}
                borderRadius={10}>
                <SkeletonPlaceholder.Item>
                  <View
                    style={{
                      height: normalize(120),
                      borderRadius: 10,
                    }}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            </View>
          ) : (
            <Carousel
              autoplay={true}
              autoplayInterval={7000}
              autoplayDelay={5000}
              loop={true}
              ref={isCarousel}
              data={guruKasetData}
              sliderWidth={screen.width}
              itemWidth={screen.width}
              onSnapToItem={(idx: number) => setIndex(idx)}
              useScrollView={true}
              vertical={false}
              renderItem={({item}: any) => {
                if (item?.isMaintenance) {
                  return (
                    <MaintenanceHeader
                      maintenance={maintenanceData}
                      checkDateNoti={notiMaintenance}
                      start={maintenanceData.dateStart}
                      end={maintenanceData.dateEnd}
                    />
                  );
                } else {
                  return (
                    <TouchableOpacity
                      onPress={async () => {
                        await AsyncStorage.setItem('guruId', `${item.id}`);
                        navigation.push('DetailGuruScreen');
                      }}>
                      <CardGuruKaset background={item.image_path} />
                    </TouchableOpacity>
                  );
                }
              }}
            />
          )}
        </>
      )}
      {allScreen ? (
        <View>
          <Pagination
            containerStyle={{
              paddingVertical: 0,
              marginBottom: 16,
            }}
            animatedDuration={100}
            dotsLength={guruKaset.data.filter(el => el.pin_all).length}
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
            width: '100%',
            top: '60%',
          }}>
          <Pagination
            dotsLength={guruKasetData.length}
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
