import {Avatar} from '@rneui/base/dist/Avatar/Avatar';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font, icons, image} from '../../assets';
import {MainButton} from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import {height, normalize} from '../../functions/Normalize';
import {stylesCentral} from '../../styles/StylesCentral';
import {TaskSuggestion} from '../../datasource/TaskSuggestion';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {initProfileState, profileReducer} from '../../hook/profilefield';
import fonts from '../../assets/fonts';
import CardReview from '../../components/Carousel/CardReview';

const SeeAllDronerUsed: React.FC<any> = ({navigation, route}) => {
  const [selectDate, setSelectDate] = useState();
  const timeSelect = useRef<any>();
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [taskSugUsed, setTaskSugUsed] = useState<any[]>([]);
  const date = new Date().toLocaleDateString();

  useEffect(() => {
    getProfile();
    dronerSugUsed();
  }, []);

  const getProfile = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    ProfileDatasource.getProfile(farmer_id!).then(res => {
      dispatch({
        type: 'InitProfile',
        name: `${res.firstname} ${res.lastname}`,
        plotItem: res.farmerPlot,
      });
    });
  };
  const dronerSugUsed = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const limit = 0;
    const offset = 0;
    TaskSuggestion.DronerUsed(
      farmer_id !== null ? farmer_id : '',
      profilestate.plotItem[0].id,
      date,
      limit,
      offset,
    ).then(res => {
      setTaskSugUsed(res);
    });
  };
  return (
    <SafeAreaView style={[stylesCentral.container]}>
      <CustomHeader
        title="ประวัติการจ้างนักบิน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={{padding: 15}}>
        {/* <TouchableOpacity
          onPress={() => {
            timeSelect.current.show();
          }}>
          <View
            style={{
              borderColor: colors.disable,
              borderWidth: 1,

              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              height: normalize(42),
              width: normalize(167),
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                fontSize: normalize(16),
                color: colors.gray,
                left: 10,
              }}>
              {!selectDate ? (
                <Text
                  style={{
                    fontFamily: font.SarabunLight,
                    color: colors.gray,
                  }}>
                  วันล่าสุด
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: font.SarabunLight,
                    color: colors.gray,
                  }}>
                  {selectDate}
                </Text>
              )}
            </Text>
            <Image
              source={icons.down}
              style={{
                width: normalize(24),
                height: normalize(22),
                marginRight: 10,
                tintColor: colors.gray,
              }}
            />
          </View>
        </TouchableOpacity> */}

        {/* <View style={{top: normalize(20)}}>
          <ScrollView>
            {taskSugUsed.map((item: any, index: any) => (
              <CardReview
              index={index}
              key={index}
                img={ item.image_droner !== null
                  ? item.image_droner
                  : image.empty_droner}
                name={item.firstname + ' ' + item.lastname}
                rate={
                  item.rating_avg !== null
                    ? parseFloat(item.rating_avg).toFixed(1)
                    : '0'
                }
                date={item.date_appointment}
                comment={''}
              />
            ))}
          </ScrollView>
        </View> */}
      </View>
    </SafeAreaView>
  );
};
export default SeeAllDronerUsed;
const styles = StyleSheet.create({
  button: {
    height: normalize(54),
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
