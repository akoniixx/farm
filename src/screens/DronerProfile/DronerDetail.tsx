import { Avatar } from '@rneui/base/dist/Avatar/Avatar';
import React, { useEffect, useReducer, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
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
import { momentExtend } from '../../utils/moment-buddha-year';
import CardReview from '../../components/Carousel/CardReview';
import { useIsFocused } from '@react-navigation/native';

const DronerDetail: React.FC<any> = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const [data, setData] = useState<any[]>([]);
  const [review, setReview] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFav, setStatusFav] = useState<any>();
  const [profile, setProfile] = useState<any>();
  const [detailState, dispatch] = useReducer(
    detailDronerReducer,
    initDetailDronerState,
  );
  const [refresh, setRefresh] = useState<boolean>(false);
  const { width } = Dimensions.get('window');
  const height = width * 0.6;
  const date = new Date();

  useEffect(() => {
    dronerDetails();
  }, [isFocused]);

  const dronerDetails = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const droner_id = await AsyncStorage.getItem('droner_id');
    const plot_id = await AsyncStorage.getItem('plot_id');
    TaskSuggestion.DronerDetail(
      farmer_id!,
      plot_id!,
      droner_id!,
      date.toLocaleDateString(),
    )
      .then(res => {
        setStatusFav(res[0].favorite_status);
        setProfile(res[0]);
        setReview(res[0].review);
        setData(res[0].droner_queue);
        dispatch({
          type: 'InitDroner',
          name: `${res[0].firstname} ${res[0].lastname}`,
          distance: `${res[0].street_distance}`,
          imagePro: res[0].image_droner,
          imageTask: res[0].image_task,
          rate: res[0].rating_avg,
          total_task: res[0].count_rating,
          district: `${res[0].subdistrict_name}`,
          province: `${res[0].province_name}`,
          droneBand: res[0].drone_brand,
          price: `${res[0].price_per_rai}`,
          dronerQueue: res[0].droner_queue,
          review: `${res[0].review}`,
        });
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  const baseDate = new Date();
  const nextDay = new Date(baseDate);
  nextDay.setDate(baseDate.getDate() + 1);
  const weekDays: string[] = [];
  for (let i = 0; i < 5; i++) {
    weekDays.push(nextDay.toISOString());
    nextDay.setDate(nextDay.getDate() + 1);
  }
  const dronerQ = data !== null ? data.map(x => x.date_appointment) : weekDays;
  const arr1 = weekDays;
  const arr2 = dronerQ;
  const QDroner = arr1.map(el => {
    const convertDate = new Date(el);
    const day = convertDate.getDate();
    const find = arr2.find(item => {
      const d = new Date(item);
      return d.getDate() === day;
    });
    if (find) {
      return {
        status: 'ไม่สะดวก',
        date: find,
      };
    }
    return {
      status: 'สะดวก',
      date: el,
    };
  });
  const favorite = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const droner_id = profile.droner_id;
    await FavoriteDroner.addUnaddFav(
      farmer_id !== null ? farmer_id : '',
      droner_id !== null ? droner_id : '',
    )
      .then(res => {
        setRefresh(!refresh);
        if (statusFav === 'ACTIVE') {
          setStatusFav('INACTIVE');
        } else {
          setStatusFav('ACTIVE');
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  if (loading) {
    return (
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    );
  } else {
    return (
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title={`${detailState.name}`}
          showBackBtn
          onPressBack={() => navigation.goBack()}
          image={() => (
            <TouchableOpacity onPress={favorite}>
              <Image
                source={
                  statusFav === 'ACTIVE' ? icons.heart_active : icons.heart
                }
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>
          )}
        />
        <ScrollView>
          <View>
            {detailState.imageTask != null ? (
              <Text style={[styles.text, { paddingHorizontal: normalize(15) }]}>
                ภาพผลงานนักบิน
                <Text
                  style={{
                    color: colors.gray,
                  }}>{` (${detailState.imageTask.length})`}</Text>
              </Text>
            ) : (
              ''
            )}
            {detailState.imageTask !== null ? (
              <ScrollView
                style={{ marginTop: 20, width, height }}
                pagingEnabled
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {detailState.imageTask != undefined &&
                  detailState.imageTask.map((item: any, index: any) => (
                    <TouchableOpacity
                      key={index}
                      onPress={async () => {
                        await AsyncStorage.setItem('imgTask', `${item}`);
                        navigation.push('FullScreenTaskImg');
                      }}>
                      <Image
                        key={index}
                        source={{ uri: item ? item : icons.avatar }}
                        style={{
                          width,
                          height,
                          resizeMode: 'cover',
                        }}
                      />
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            ) : (
              <Image
                source={image.bg_droner}
                style={{
                  height: normalize(200),
                  width: screenWidth,
                  alignSelf: 'center',
                }}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: normalize(15),
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={[
                styles.text,
                { alignItems: 'center', paddingHorizontal: 10 },
              ]}>
              <Image
                source={icons.chat}
                style={{ width: normalize(20), height: normalize(20) }}
              />
              <Text style={[styles.text, { paddingHorizontal: normalize(15) }]}>
                {` รีวิวจากเกษตรกร`}
              </Text>
              {review != null ? (
                <Text
                  style={[styles.text, { paddingHorizontal: normalize(15) }]}>
                  <Text
                    style={{
                      color: colors.gray,
                    }}>{` (${review.length})`}</Text>
                </Text>
              ) : (
                ` (0)`
              )}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AllReviewDroner');
              }}>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: normalize(16),
                  color: colors.fontGrey,
                  height: 30,
                }}>
                ดูทั้งหมด
              </Text>
            </TouchableOpacity>
          </View>
          {review !== null ? (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {review != undefined &&
                review.map((item: any, index: any) => (
                  <CardReview
                    key={index}
                    index={index}
                    img={item.image_profile}
                    name={item.farmer_fname + ' ' + item.farmer_lname}
                    rate={item.rating}
                    date={item.date_appointment}
                    comment={item.comment_review.comment}
                  />
                ))}
            </ScrollView>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: '5%' }}>
              <Image
                source={image.empty_review}
                style={{ width: 69, height: 60 }}
              />
              <Text
                style={{
                  marginTop: '2%',
                  paddingHorizontal: 10,
                  fontFamily: font.SarabunBold,
                  fontSize: normalize(16),
                  fontWeight: '300',
                  alignItems: 'center',
                  color: colors.gray,
                }}>
                ไม่มีรีวิวเกษตรกร
              </Text>
            </View>
          )}
          <View style={{ height: 10, backgroundColor: '#F8F9FA' }}></View>
          <View style={[styles.section]}>
            <Text style={[styles.text, { marginBottom: '3%' }]}>
              {`ราคา ${detailState.price} บาท/ไร`}่
            </Text>
            <View
              style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: '3%',
                }}>
                <Image
                  source={icons.star}
                  style={{ width: 24, height: 24, right: 3 }}
                />
                <Text style={[styles.label]}>
                  {detailState.rate !== null
                    ? `${parseFloat(detailState.rate).toFixed(1)}`
                    : `0`}
                </Text>
                <Text style={[styles.label, { color: colors.gray }]}>
                  {detailState.total_task !== null
                    ? ` (${detailState.total_task})`
                    : ` (0)`}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={icons.distance}
                  style={{ width: 24, height: 24, right: 3 }}
                />
                <Text style={[styles.label]}>
                  ห่างคุณ{' '}
                  {detailState.distance !== null
                    ? `${parseFloat(detailState.distance).toFixed(1)}`
                    : 0}{' '}
                  กม.
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={icons.location}
                style={{ width: 24, height: 24, right: 3 }}
              />
              <Text
                style={[
                  styles.label,
                ]}>{`${detailState.district} , จ. ${detailState.province}`}</Text>
            </View>
          </View>
          <View style={{ height: 10, backgroundColor: '#F8F9FA' }}></View>
          <View style={[styles.section]}>
            <Text style={[styles.text]}>คิวงานของนักบินโดรน</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 10,
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.dotGreen}
                  style={{ width: 10, height: 10, marginRight: 5 }}
                />
                <Text style={[styles.label, { marginRight: 20 }]}>สะดวก</Text>
                <Image
                  source={icons.dotRed}
                  style={{ width: 10, height: 10, marginRight: 5 }}
                />
                <Text
                  style={[
                    styles.label,
                    { marginRight: 5, color: colors.gray },
                  ]}>
                  ไม่สะดวก
                </Text>
              </View>
              <View>
                <Text style={[styles.label]}>
                  วันนี้{' '}
                  {new Date(date).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ height: normalize(155) }}>
            {detailState.dronerQueue != null ? (
              <View style={{ height: '100%' }}>
                <View style={{ flexDirection: 'row' }}>
                  {detailState.dronerQueue.length != undefined &&
                    QDroner.map((item: any, index: any) => (
                      <CardDetailDroner
                        key={index}
                        index={index}
                        date={new Date(item.date).toLocaleDateString('th-TH', {
                          day: 'numeric',
                        })}
                        month={new Date(item.date).toLocaleDateString('th-TH', {
                          month: 'short',
                        })}
                        year={momentExtend.toBuddhistYear(date, 'YY')}
                        convenient={item.status}
                      />
                    ))}
                </View>
              </View>
            ) : (
              <View style={{ height: '110%' }}>
                <View style={{ flexDirection: 'row' }}>
                  {weekDays.map((item: any, index: any) => (
                    <CardDetailDroner
                      key={index}
                      index={index}
                      date={new Date(item).toLocaleDateString('th-TH', {
                        day: 'numeric',
                      })}
                      month={new Date(item).toLocaleDateString('th-TH', {
                        month: 'short',
                      })}
                      year={momentExtend.toBuddhistYear(date, 'YY')}
                      convenient={'สะดวก'}
                    />
                  ))}
                </View>
              </View>
            )}
          </View>
          <View style={{ height: 10, backgroundColor: '#F8F9FA' }}></View>
          <View style={[styles.section]}>
            <Text style={[styles.text]}>ข้อมูลนักบิน</Text>
            <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
              <Avatar
                size={normalize(56)}
                source={
                  detailState.imagePro !== null
                    ? { uri: detailState.imagePro }
                    : image.empty_droner
                }
                avatarStyle={{
                  borderRadius: normalize(40),
                  borderColor: colors.bg,
                  borderWidth: 1,
                }}
              />
              <View style={{ left: 20 }}>
                <Text style={[styles.droner]}>{detailState.name}</Text>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Image
                    source={icons.done_academy}
                    style={{ width: 24, height: 24, right: 5 }}
                  />
                  <Text
                    style={{
                      color: colors.gray,
                      fontFamily: font.SarabunLight,
                      fontSize: normalize(16),
                    }}>
                    ผ่านการยืนยันจาก ICP Academy
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <Text style={[styles.droner]}>
                ยี่ห้อโดรน :
                <Text
                  style={{
                    fontFamily: font.SarabunLight,
                    fontSize: normalize(18),
                    color: colors.fontBlack,
                  }}>
                  {detailState.droneBand !== null
                    ? `  ${detailState.droneBand}`
                    : ' -'}
                </Text>
              </Text>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: normalize(18),
                  color: colors.fontBlack,
                }}>
                ICP รับประกันคุณภาพการฉีดพ่นและยา 100%
              </Text>
            </View>
          </View>
          <View style={{ height: 20, backgroundColor: '#F8F9FA' }}></View>
        </ScrollView>
        <View>
          <MainButton
            label="จ้างงาน"
            color={colors.greenLight}
            style={styles.button}
            onPress={() =>
              navigation.navigate('SelectDateScreen', {
                isSelectDroner: true,
                profile: profile,
              })
            }
          />
        </View>
      </SafeAreaView>
    );
  }
};
export default DronerDetail;
const styles = StyleSheet.create({
  button: {
    height: 52,
    width: normalize(343),
    alignSelf: 'center',
    shadowColor: '#0CDF65',
  },
  droner: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    textAlign: 'left',
    color: colors.fontBlack,
  },
  section: {
    display: 'flex',
    padding: normalize(15),
  },
  text: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(18),
    textAlign: 'left',
    color: colors.fontBlack,
  },
  listTileIcon: {
    width: normalize(24),
    height: normalize(24),
  },
  label: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
});
