import React, { useEffect, useReducer, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { colors, font, image } from '../../assets';
import { normalize } from '../../functions/Normalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskSuggestion } from '../../datasource/TaskSuggestion';
import {
  detailDronerReducer,
  initDetailDronerState,
} from '../../hook/profilefield';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { stylesCentral } from '../../styles/StylesCentral';
import CustomHeader from '../../components/CustomHeader';
import CardReview from '../../components/Carousel/CardReview';
import { FilterReview } from '../../components/FilterReview';

const AllReviewDroner: React.FC<any> = ({ navigation }) => {
  const [data, setData] = useState<any[]>([]);
  const [review, setReview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [detailState, dispatch] = useReducer(
    detailDronerReducer,
    initDetailDronerState,
  );

  const { width } = Dimensions.get('window');
  const date = new Date();
  const [selectedField, setSelectedField] = useState({
    name: 'วันล่าสุด',
    value: 'date_appointment',
    direction: '',
  });
  const dronerDetails = async () => {
    setLoading(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const droner_id = await AsyncStorage.getItem('droner_id');
    const plot_id = await AsyncStorage.getItem('plot_id');
    const limit = 0;
    const offset = 0;
    const sortField = selectedField.value;
    const sortDirection = selectedField.direction;
    TaskSuggestion.DronerDetail(
      farmer_id!,
      plot_id!,
      droner_id!,
      date.toLocaleDateString(),
      limit,
      offset,
      sortField,
      sortDirection,
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
  useEffect(() => {
    dronerDetails();
  }, [selectedField]);
  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title={'รีวิวจากเกษตรกร'}
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={{ backgroundColor: colors.grayBg, flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: normalize(20),
            paddingHorizontal: 15,
          }}>
          <FilterReview
            selectedField={selectedField}
            setSelectedField={setSelectedField}
          />
        </View>
        <ScrollView>
          <View style={{ paddingVertical: 10 }}>
            {review !== null ? (
              <View style={{ height: 'auto', alignSelf: 'center' }}>
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
              <View style={{ alignItems: 'center', paddingVertical: '45%' }}>
                <Image
                  source={image.empty_review}
                  style={{ width: 129, height: 120 }}
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
          </View>
        </ScrollView>
      </View>
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
