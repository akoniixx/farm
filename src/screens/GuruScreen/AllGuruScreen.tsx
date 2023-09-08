import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import colors from '../../assets/colors/colors';
import icons from '../../assets/icons/icons';
import CustomHeader from '../../components/CustomHeader';
import { CardGuru, CardPinGuru } from '../../components/Guru/CardGuru';
import { normalize } from '../../functions/Normalize';
import { font } from '../../assets/index';
import { GuruKaset } from '../../datasource/GuruDatasource';
import { momentExtend } from '../../utils/moment-buddha-year';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mixpanel } from '../../../mixpanel';
import { Carousel, Pagination } from 'react-native-snap-carousel';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Text from '../../components/Text/Text';

const initialPage = 1;
const limit = 10;
const filterListSelect = [
  {
    id: 1,
    title: 'ล่าสุด',
    value: 'created_at',
    mixpanel: 'เลือกฟิลเตอร์กูรูเกษตรล่าสุด',
  },
  {
    id: 2,
    title: 'นิยมมากสุด',
    value: 'read',
    mixpanel: 'เลือกฟิลเตอร์กูรูเกษตรนิยมมากสุด',
  },
];
const AllGuruScreen: React.FC<any> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const filterNews = useRef<any>();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [data, setData] = useState<{
    data: any[];
    count: number;
  }>({
    data: [],
    count: 0,
  });
  const [pinAll, setPinAll] = useState<any>([]);
  const [index, setIndex] = React.useState(0);
  const screen = Dimensions.get('window');
  const isCarousel = React.useRef(null);
  const [page, setPage] = useState(initialPage);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getInitialData = async () => {
      await Promise.all([findAllNewsPin(), findAllNews()]);
    };
    getInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await findAllNews();
    setRefreshing(false);
  };
  const findAllNewsPin = async () => {
    try {
      const res = await GuruKaset.findAllNews({
        status: 'ACTIVE',
        application: 'FARMER',
        sortDirection: 'DESC',
        pageType: 'ALL',
        sortField: 'created_at',
        offset: 1,
        limit: 5,
      });
      setPinAll(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  console.log('length', data.data.length);
  const findAllNews = async () => {
    setLoading(true);
    GuruKaset.findAllNews({
      status: 'ACTIVE',
      application: 'FARMER',
      sortDirection: 'DESC',
      pageType: 'ALL',
      sortField: sortBy,
      offset: initialPage,
      limit: limit,
    })
      .then(res => {
        if (res) {
          setData(res);
          setPage(1);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    findAllNews();
  }, [sortBy]);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  const onLoadMore = async () => {
    if (data.data.length < data.count) {
      setLoadingMore(true);
      try {
        const res = await GuruKaset.findAllNews({
          status: 'ACTIVE',
          application: 'FARMER',
          sortDirection: 'DESC',
          pageType: 'ALL',
          sortField: sortBy,
          offset: page + 1,
          limit: limit,
        });
        setPage(page + 1);
        setData({
          data: [...data.data, ...res.data],
          count: res.count,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <CustomHeader
        title="กูรูเกษตร"
        showBackBtn
        onPressBack={() => {
          mixpanel.track('Tab back from All Guru Screen');
          navigation.goBack();
        }}
        image={() => (
          <TouchableOpacity
            onPress={async () => {
              filterNews.current.show();
            }}>
            <Image source={icons.filter} style={{ width: 28, height: 29 }} />
          </TouchableOpacity>
        )}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={async e => {
          if (isCloseToBottom(e.nativeEvent)) {
            await onLoadMore();
          }
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ backgroundColor: '#F8F9FA' }}>
        <View style={{ paddingVertical: 10 }}>
          {pinAll !== undefined && pinAll.length > 1 ? (
            <>
              <Carousel
                autoplay={true}
                autoplayInterval={7000}
                autoplayDelay={5000}
                loop={true}
                ref={isCarousel}
                data={pinAll}
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
                      <CardPinGuru
                        key={index}
                        index={item.index}
                        background={item.image_path}
                        title={item.title}
                        date={momentExtend.toBuddhistYear(
                          item.created_at,
                          'DD MMM YY',
                        )}
                        read={item.read}
                        pin={item.pin_all}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
              <View
                style={{
                  alignItems: 'center',
                  top: -5,
                  marginVertical: -20,
                }}>
                <Pagination
                  dotsLength={pinAll.length}
                  activeDotIndex={index}
                  carouselRef={isCarousel}
                  dotStyle={{
                    width: 8,
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: colors.fontGrey,
                    marginHorizontal: 0,
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.9}
                  tappableDots={true}
                />
              </View>
            </>
          ) : (
            pinAll.length > 0 &&
            pinAll.map((item: any, index: any) => (
              <TouchableOpacity
                key={index}
                onPress={async () => {
                  await AsyncStorage.setItem('guruId', `${item.id}`);
                  navigation.push('DetailGuruScreen');
                  mixpanel.track('Tab detail guru ');
                }}>
                <CardPinGuru
                  key={index}
                  index={item.index}
                  background={item.image_path}
                  title={item.title}
                  date={momentExtend.toBuddhistYear(
                    item.created_at,
                    'DD MMM YY',
                  )}
                  read={item.read}
                  pin={item.pin_all}
                />

                <View
                  style={{
                    alignItems: 'center',
                    alignSelf: 'center',
                    backgroundColor: colors.gray,
                    borderRadius: 20,
                    height: 8,
                    width: 8,
                  }}
                />
              </TouchableOpacity>
            ))
          )}

          {data.data.length > 0 ? (
            <>
              {data.data.map((item: any, index) => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={async () => {
                      await AsyncStorage.setItem('guruId', `${item.id}`);
                      navigation.push('DetailGuruScreen');
                      mixpanel.track('Tab detail guru ');
                    }}>
                    <CardGuru
                      key={index}
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
              })}
              {loadingMore ? (
                <View
                  style={{
                    marginTop: 16,
                  }}>
                  <SkeletonPlaceholder
                    borderRadius={10}
                    speed={2000}
                    backgroundColor={colors.skeleton}>
                    <SkeletonPlaceholder.Item
                      flexDirection="row"
                      alignItems="center"
                      style={{ paddingHorizontal: 16 }}>
                      <View style={{ width: '100%', height: 200 }} />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder>
                </View>
              ) : null}
            </>
          ) : null}
        </View>
      </ScrollView>

      <ActionSheet ref={filterNews}>
        <View
          style={{
            backgroundColor: 'white',
            paddingVertical: normalize(30),
            width: windowWidth,
            height: windowHeight * 0.28,
            borderRadius: normalize(20),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: normalize(20),
            }}>
            <Text style={{ fontSize: 22, fontFamily: font.AnuphanMedium }}>
              เรียงลำดับบทความ
            </Text>
            <Text
              style={{
                color: colors.greenLight,
                fontFamily: font.SarabunMedium,
                fontSize: normalize(16),
              }}
              onPress={() => {
                filterNews.current.hide();
              }}>
              ยกเลิก
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 0.3,
              paddingVertical: 5,
              borderColor: colors.disable,
            }}
          />
          <View style={{ flex: 1 }}>
            {filterListSelect.map((el, idx) => {
              const isFocus = sortBy === el.value;
              return (
                <View key={idx}>
                  <TouchableOpacity
                    onPress={async () => {
                      mixpanel.track(el.mixpanel);
                      filterNews.current.hide();
                      setSortBy(el.value);
                    }}
                    key={idx}
                    style={{
                      height: 60,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingRight: 16,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: normalize(30),
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: font.SarabunMedium,
                          color: colors.fontBlack,
                        }}>
                        {el.title}
                      </Text>
                    </View>

                    {isFocus && (
                      <Image
                        source={icons.correct}
                        style={{
                          width: 32,
                          height: 32,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                  <View
                    style={{
                      borderBottomWidth: 0.3,

                      borderColor: colors.disable,
                      width: Dimensions.get('screen').width * 0.9,
                      alignSelf: 'center',
                    }}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ActionSheet>
      {/* <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      /> */}
    </SafeAreaView>
  );
};

export default AllGuruScreen;
