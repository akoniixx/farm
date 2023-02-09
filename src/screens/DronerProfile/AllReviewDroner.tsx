import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
} from 'react-native';
import { colors, font, image } from '../../assets';
import { normalize } from '../../functions/Normalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskSuggestion } from '../../datasource/TaskSuggestion';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import {
  detailDronerReducer,
  initDetailDronerState,
  initProfileState,
  profileReducer,
} from '../../hook/profilefield';
import { useIsFocused } from '@react-navigation/native';
import AllDroner from '../../components/Carousel/AllDronerUsed';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { FavoriteDroner } from '../../datasource/FavoriteDroner';
import FavDronerUsedList from '../../components/Carousel/FavDronerUsedList';
import { stylesCentral } from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import CardReview from '../../components/Carousel/CardReview';
import icons from '../../assets/icons/icons';
import ActionSheet from 'react-native-actions-sheet';
import { LocationSelect } from '../../components/Location/Location';

const AllReviewDroner: React.FC<any> = ({ navigation }) => {
  const [data, setData] = useState<any[]>([]);
  const [review, setReview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<any>([]);

  const [detailState, dispatch] = useReducer(
    detailDronerReducer,
    initDetailDronerState,
  );
  const filterSheet = useRef<any>();

  const { width } = Dimensions.get('window');
  const height = width * 0.6;
  const date = new Date();

  useEffect(() => {
    dronerDetails();
  }, []);

  const dronerDetails = async () => {
    setLoading(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const droner_id = await AsyncStorage.getItem('droner_id');
    const plot_id = await AsyncStorage.getItem('plot_id');
    const limit = 0;
    const offset = 0;
    TaskSuggestion.DronerDetail(
      farmer_id!,
      plot_id!,
      droner_id!,
      date.toLocaleDateString(),
      limit,
      offset,
    )
      .then(res => {
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
  const item = [
    { label: 'วันล่าสุด', value: 'NEW_DATE' },
    { label: 'คะแนนสูงสุด', value: 'HIGHT_RATE' },
    { label: 'คะแนนต่ำสุด', value: 'LOW_RATE' },
  ];
  const selectFilter = (value: any) => {
    setFilters(value);
    filterSheet.current.hide();
  };
  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title={'รีวิวจากเกษตรกร'}
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={{ backgroundColor: colors.grayBg, flex: 1 }}>
        <ScrollView>
          <View style={{ paddingVertical: 10}}>
            {review !== null ? (
              <View style={{ height: 'auto',alignSelf: 'center'  }}>
                <View style={{ paddingHorizontal: 15 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: normalize(10),
                    }}>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          filterSheet.current.show();
                        }}>
                        <View
                          style={{
                            borderWidth: 0.3,
                            padding: 10,
                            borderRadius: 10,
                            marginVertical: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            height: 'auto',
                            justifyContent: 'space-between',
                            width: 170,
                          }}>
                          <Text
                            style={{
                              fontFamily: font.AnuphanMedium,
                              fontSize: normalize(18),
                              color: colors.gray,
                              lineHeight: 30,
                            }}>
                            <Text
                              style={{
                                fontFamily: font.SarabunLight,
                                color: colors.disable,
                              }}>
                              {!filters.label ? (
                                <Text
                                  style={{
                                    fontFamily: font.SarabunLight,
                                    color: colors.gray,
                                  }}>
                                  วันที่ล่าสุด
                                </Text>
                              ) : (
                                <TextInput
                                  style={{
                                    fontFamily: font.SarabunLight,
                                    color: colors.gray,
                                  }}>
                                  {filters.label}
                                </TextInput>
                              )}
                            </Text>
                          </Text>
                          <Image
                            source={icons.chevron}
                            style={{
                              width: normalize(15),
                              height: normalize(8),
                              marginRight: 10,
                              tintColor: colors.gray,
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <ScrollView showsHorizontalScrollIndicator={false}>
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
              </View>
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: '50%' }}>
                <Text
                  style={{
                    top: '10%',
                    fontFamily: font.AnuphanMedium,
                    fontSize: normalize(16),
                    fontWeight: '300',
                    color: colors.gray,
                  }}>
                  ไม่มีรีวิว
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <ActionSheet ref={filterSheet}>
        <View
          style={{
            backgroundColor: 'white',
            paddingVertical: normalize(30),
            paddingHorizontal: normalize(20),
            borderRadius: normalize(20),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontFamily: font.AnuphanMedium, fontSize: 20 }}>
              เรียงลำดับรีวิว
            </Text>
            <Text
              style={{
                color: colors.greenLight,
                fontFamily: font.SarabunMedium,
                fontSize: normalize(16),
              }}
              onPress={() => {
                filterSheet.current.hide();
              }}>
              ยกเลิก
            </Text>
          </View>
          <View>
            <ScrollView>
              {item.map((item, index) => (
                <View
                  style={{
                    paddingVertical: 20,
                    borderBottomWidth: 0.2,
                    borderColor: colors.disable,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      filterSheet.current.hide();
                      selectFilter(item.value);
                    }}>
                    <Text
                      key={index}
                      style={{
                        fontFamily: font.SarabunLight,
                        fontSize: 18,
                        marginTop: 10,
                      }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ActionSheet>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layout: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  text: {
    top: 15,
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.gray,
    fontWeight: '300',
  },
});
export default AllReviewDroner;
