import {Avatar} from '@rneui/base/dist/Avatar/Avatar';
import React, {useEffect, useReducer, useState} from 'react';
import {Dimensions, Image, Modal, StyleSheet, Text, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font, icons, image} from '../../assets';
import {MainButton} from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import {height, normalize} from '../../functions/Normalize';
import {stylesCentral} from '../../styles/StylesCentral';
import {TaskSuggestion} from '../../datasource/TaskSuggestion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ImageSlider} from 'react-native-image-slider-banner';

import {
  detailDronerReducer,
  initDetailDronerState,
} from '../../hook/profilefield';
import moment from 'moment';
import {CardDetailDroner} from '../../components/Carousel/CardTaskDetailDroner';
import {SliderHeader} from 'react-native-image-slider-banner/src/sliderHeader';
import Animated from 'react-native-reanimated';

const DronerDetail: React.FC<any> = ({navigation, route}) => {
  const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
  const [visible, setIsVisible] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [detailState, dispatch] = useReducer(
    detailDronerReducer,
    initDetailDronerState,
  );
  const date = new Date().toLocaleDateString();

  useEffect(() => {
    dronerDetails();
  }, []);

  const dronerDetails = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const droner_id = await AsyncStorage.getItem('droner_id');
    const plot_id = await AsyncStorage.getItem('plot_id');
    const limit = 0;
    const offset = 0;
    TaskSuggestion.DronerDetail(
      farmer_id !== null ? farmer_id : '',
      plot_id !== null ? plot_id : '',
      droner_id !== null ? droner_id : '',
      date,
      limit,
      offset,
    ).then(res => {
      setData(res[0].droner_queue);
      dispatch({
        type: 'InitDroner',
        name: `${res[0].firstname} ${res[0].lastname}`,
        distance: `${res[0].street_distance}`,
        imagePro: `${res[0].image_droner}`,
        imageTask: res[0].image_task,
        rate: res[0].rating_avg,
        total_task: res[0].count_rating,
        district: `${res[0].subdistrict_name}`,
        province: `${res[0].province_name}`,
        droneBand: `${res[0].drone_brand}`,
        price: `${res[0].price_per_rai}`,
        dronerQueue: res[0].droner_queue,
      });
    });
  };

  const baseDate = new Date();
  const weekDays: string[] = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(baseDate.toISOString());
    baseDate.setDate(baseDate.getDate() + 1);
  }  
  const DAYS = ["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัส","ศุกร์","เสาร์"];
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++)
  {
    const nameDay = new Date(today);
    nameDay.setDate(today.getDate() + i);
    days.push(DAYS[nameDay.getDay()]);
  }
  const dronerQ = data !== null ? data.map(x => x.date_appointment) : weekDays;
  const arr1 = weekDays;
  const arr2 = dronerQ;
  const arr3 = days;
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
        // dayName: nameDate
      };
    }
    return {
      status: 'สะดวก',
      date: el,
      // dayName: nameDate
    };
  });

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title={`${detailState.name}`}
        showBackBtn
        onPressBack={() => navigation.goBack()}
        image={() => (
          <Image source={icons.heart} style={{width: 25, height: 25}} />
        )}
      />
      <ScrollView>
        <View style={[styles.section]}>
          {detailState.imageTask != null ? (
            <Text style={[styles.text]}>
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
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {detailState.imageTask != undefined &&
                detailState.imageTask.map((item: any, _index: any) => (
                  <ImageSlider
                    preview={true}
                    previewImageStyle={{}}
                    data={[
                      {
                        img: item,
                      },
                    ]}
                    previewImageContainerStyle={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#020804',
                    }}
                    autoPlay={true}
                    closeIconColor="#fff"
                    onItemChanged={() => setIsVisible(false)}
                  />
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
              {alignItems: 'center', paddingHorizontal: 10},
            ]}>
            <Image
              source={icons.chat}
              style={{width: normalize(20), height: normalize(20)}}
            />
            รีวิวจากเกษตรกร (7)
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontFamily: font.SarabunLight,
                fontSize: normalize(16),
                color: colors.fontGrey,
                height: 25,
              }}>
              ดูทั้งหมด
            </Text>
          </TouchableOpacity>
        </View> */}
        <View style={{height: 10, backgroundColor: '#F8F9FA'}}></View>
        <View style={[styles.section]}>
          <Text style={[styles.text, {marginBottom: '3%'}]}>
            {`ราคา ${detailState.price} บาท/ไร`}่
          </Text>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: '3%',
              }}>
              <Image
                source={icons.star}
                style={{width: 24, height: 24, right: 3}}
              />
              <Text style={[styles.label]}>
                {detailState.rate !== null
                  ? `${parseFloat(detailState.rate).toFixed(1)}`
                  : `0`}
              </Text>
              <Text style={[styles.label, {color: colors.gray}]}>
                {detailState.total_task !== null
                  ? ` (${detailState.total_task})`
                  : ` (0)`}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={icons.distance}
                style={{width: 24, height: 24, right: 3}}
              />
              <Text style={[styles.label]}>
                ห่างคุณ{' '}
                {detailState.distance !== null
                  ? `${parseFloat(detailState.distance).toFixed(0)}`
                  : 0}{' '}
                กม.
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={icons.location}
              style={{width: 24, height: 24, right: 3}}
            />
            <Text
              style={[
                styles.label,
              ]}>{`${detailState.district} , จ. ${detailState.province}`}</Text>
          </View>
        </View>
        <View style={{height: 10, backgroundColor: '#F8F9FA'}}></View>
        <View style={[styles.section]}>
          <Text style={[styles.text]}>คิวงานของนักบินโดรน</Text>
        </View>
        <View style={{height: normalize(155)}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {detailState.dronerQueue !== null ?
              QDroner.map((item: any, index: any) => (
                <CardDetailDroner
                  key={index}
                  index={index}
                  days={moment(item.date).locale('th').format('dddd')}
                  dateTime={new Date(item.date).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit',
                  })}
                  convenient={item.status}
                />
              )):
              weekDays.map((item: any, index: any) => (
                <CardDetailDroner
                  key={index}
                  index={index}
                  days={moment(item).locale('th').format('dddd')}
                  dateTime={new Date(item).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit',
                  })}
                  convenient={'สะดวก'}
                />
               ) )
            }
          </ScrollView>
        </View>
        <View style={{height: 10, backgroundColor: '#F8F9FA'}}></View>
        <View style={[styles.section]}>
          <Text style={[styles.text]}>ข้อมูลนักบิน</Text>
          <View style={{flexDirection: 'row', paddingVertical: 10}}>
            <Avatar
              size={normalize(56)}
              source={
                detailState.imagePro !== null
                  ? {uri: detailState.imagePro}
                  : image.empty_droner
              }
              avatarStyle={{
                borderRadius: normalize(40),
                borderColor: colors.bg,
                borderWidth: 1,
              }}
            />
            <View style={{left: 20}}>
              <Text style={[styles.droner]}>{detailState.name}</Text>
              <Text style={[styles.droner, {top: 10}]}>
            ยี่ห้อโดรน :
            <Text
              style={{
                fontFamily: font.SarabunLight,
                fontSize: normalize(18),
                color: colors.fontBlack,
              }}>
              {`  ${detailState.droneBand}`}
            </Text>
          </Text>
              {/* <View style={{flexDirection: 'row', marginTop: 10}}>
                <Image
                  source={icons.done_academy}
                  style={{width: 24, height: 24, right: 5}}
                />
                <Text
                  style={{
                    color: colors.gray,
                    fontFamily: font.SarabunLight,
                    fontSize: normalize(16),
                  }}>
                  ผ่านการยืนยันจาก ICP Academy
                </Text>
              </View> */}
            </View>
          </View>
          <Text
            style={{
              fontFamily: font.SarabunLight,
              fontSize: normalize(18),
              color: colors.fontBlack,
            }}>
            {/* ICP รับประกันคุณภาพการฉีดพ่นและยา 100% */}
          </Text>
        </View>
        <View style={{height: 20, backgroundColor: '#F8F9FA'}}></View>
      </ScrollView>
      <View>
        <MainButton
          label="จ้างงาน"
          color={colors.greenLight}
          style={styles.button}
          onPress={() => navigation.navigate('')}
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
