import { Avatar } from '@rneui/base/dist/Avatar/Avatar';
import React, { useEffect, useReducer, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons, image } from '../../assets';
import { MainButton } from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import { normalize } from '../../functions/Normalize';
import { stylesCentral } from '../../styles/StylesCentral';
import { TaskSuggestion } from '../../datasource/TaskSuggestion';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  detailDronerReducer,
  initDetailDronerState,
} from '../../hook/profilefield';
import { CardDetailDroner } from '../../components/Carousel/CardTaskDetailDroner';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { FavoriteDroner } from '../../datasource/FavoriteDroner';
import { momentExtend } from '../../utils/moment-buddha-year';
import { useIsFocused } from '@react-navigation/native';
import VerifyStatus from '../../components/Modal/VerifyStatus';
import Text from '../../components/Text/Text';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import moment from 'moment';

const DronerDetail: React.FC<any> = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const [data, setData] = useState<any[]>([]);
  const [review, setReview] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFav, setStatusFav] = useState<any>();
  const [profile, setProfile] = useState<any>();
  const [statusFarm, setStatusFarm] = useState<any>();
  const [detailState, dispatch] = useReducer(
    detailDronerReducer,
    initDetailDronerState,
  );
  const [refresh, setRefresh] = useState<boolean>(false);
  const { width } = Dimensions.get('window');
  const height = width * 0.6;
  const date = new Date();
  const [modalVerify, setModalVerify] = useState<boolean>(false);

  useEffect(() => {
    const statusFarmer = async () => {
      const statusFarmer = await AsyncStorage.getItem('farmer_status');
      setStatusFarm(statusFarmer);
    };
    dronerDetails();
    statusFarmer();
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
        console.log('res', JSON.stringify(res, null, 2));
        setStatusFav(res[0].favorite_status);
        setProfile(res[0]);
        setReview(res[0].review);
        setData(res[0].droner_queue);
        dispatch({
          type: 'InitDroner',
          name: `${res[0].firstname} ${res[0].lastname}`,
          distance: `${res[0].street_distance}`,
          imagePro: res[0].image_droner ? res[0].image_droner : icons.avatar,
          imageTask: res[0].image_task,
          rate: res[0].rating_avg,
          total_task: res[0].count_rating,
          district: `${res[0].subdistrict_name}`,
          province: `${res[0].province_name}`,
          droneBand: res[0].drone_brand,
          price: `${res[0].price_per_rai}`,
          dronerQueue: res[0].droner_queue,
          review: `${res[0].review}`,
          nickname: res[0].nickname,
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
    const streetDistance = profile.street_distance;
    await FavoriteDroner.addUnaddFav(
      farmer_id !== null ? farmer_id : '',
      droner_id !== null ? droner_id : '',
      streetDistance,
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

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title={'ข้อมูลนักบิน'}
        showBackBtn
        onPressBack={() => navigation.goBack()}
        image={() => (
          <TouchableOpacity onPress={favorite}>
            <Image
              source={statusFav === 'ACTIVE' ? icons.heart_active : icons.heart}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        )}
      />
      <ScrollView style={{ backgroundColor: '#F8F9FA' }}>
        {/* <View>
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
                    <ProgressiveImage
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
        </View> */}
        {/* <View
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
          </View> */}
        {/* {review !== null ? (
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
          )} */}
        <View style={{ height: 2, backgroundColor: '#F8F9FA' }} />
        <View style={[styles.section]}>
          <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
            <Avatar
              size={normalize(68)}
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
            {detailState.nickname !== null ? (
              <View style={{ left: 20, alignSelf: 'center' }}>
                <Text style={[styles.droner]}>{detailState.nickname}</Text>
                <Text style={[styles.dronerName]}>{detailState.name}</Text>
              </View>
            ) : (
              <View style={{ left: 20, alignSelf: 'center' }}>
                <Text style={[styles.droner]}>{detailState.name}</Text>
              </View>
            )}
          </View>
          <View style={{ paddingVertical: 14 }}>
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
          </View>
        </View>
        <View style={{ height: 10, backgroundColor: '#F8F9FA' }} />
        <View style={[styles.section]}>
          <Text style={[styles.text, { marginBottom: '3%' }]}>
            {`ราคา ${detailState.price || 0} บาท/ไร`}่
          </Text>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Image
                source={icons.star}
                style={{ width: 24, height: 24, right: 3 }}
              />
              {loading ? (
                <SkeletonPlaceholder
                  borderRadius={10}
                  backgroundColor={colors.skeleton}>
                  <SkeletonPlaceholder.Item>
                    <View
                      style={{
                        width: 100,
                        height: 22,
                      }}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              ) : (
                <>
                  <Text style={[styles.label]}>
                    {detailState.rate !== null
                      ? `${parseFloat(detailState.rate || 0).toFixed(1)}`
                      : `0`}
                  </Text>
                  <Text style={[styles.label, { color: colors.gray }]}>
                    {detailState.total_task !== null
                      ? ` (${detailState.total_task || 0})`
                      : ` (0)`}
                  </Text>
                </>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Image
                source={icons.distance}
                style={{ width: 24, height: 24, right: 3 }}
              />
              {loading ? (
                <SkeletonPlaceholder
                  borderRadius={10}
                  backgroundColor={colors.skeleton}>
                  <SkeletonPlaceholder.Item>
                    <View
                      style={{
                        width: 100,
                        height: 22,
                      }}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              ) : (
                <Text style={[styles.label]}>
                  ห่าง{' '}
                  {detailState.distance !== null
                    ? `${parseFloat(detailState.distance || 0).toFixed(1)}`
                    : 0}{' '}
                  กม.
                </Text>
              )}
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={icons.location}
              style={{ width: 24, height: 24, right: 3 }}
            />
            {loading ? (
              <SkeletonPlaceholder
                borderRadius={10}
                backgroundColor={colors.skeleton}>
                <SkeletonPlaceholder.Item>
                  <View
                    style={{
                      width: 100,
                      height: 22,
                    }}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            ) : (
              <Text style={[styles.label]}>
                {detailState.district && detailState.province
                  ? `${detailState.district} , จ. ${detailState.province}`
                  : '-'}
              </Text>
            )}
          </View>
        </View>
        <View style={{ height: 10, backgroundColor: '#F8F9FA' }} />
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
                style={[styles.label, { marginRight: 5, color: colors.gray }]}>
                ไม่สะดวก
              </Text>
            </View>
            <View>
              <Text style={[styles.label]}>
                วันนี้{' '}
                {momentExtend.toBuddhistYear(moment().toDate(), 'DD MMM YY')}
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
        <Modal transparent={true} visible={modalVerify}>
          <VerifyStatus
            text={statusFarm}
            show={modalVerify}
            onClose={() => {
              setModalVerify(false);
            }}
            onMainClick={() => {
              setModalVerify(false);
            }}
          />
        </Modal>
      </ScrollView>
      <View>
        <MainButton
          label="จ้างงาน"
          color={colors.greenLight}
          style={styles.button}
          onPress={() =>
            statusFarm !== 'ACTIVE'
              ? setModalVerify(true)
              : navigation.navigate('SelectDateScreen', {
                  isSelectDroner: true,
                  profile: profile,
                })
          }
        />
      </View>
    </SafeAreaView>
  );
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
    fontSize: normalize(20),
    textAlign: 'left',
    color: colors.fontBlack,
    lineHeight: 32,
  },
  dronerName: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    textAlign: 'left',
    color: colors.gray,
  },
  section: {
    display: 'flex',
    padding: normalize(15),
    backgroundColor: colors.white,
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
    lineHeight: normalize(26),
  },
});
