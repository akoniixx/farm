import {Avatar} from '@rneui/base/dist/Avatar/Avatar';
import React, {useEffect, useReducer, useState} from 'react';
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
import CardDetailDroner from '../../components/Carousel/CardTaskDetailDroner';

const DronerDetail: React.FC<any> = ({navigation, route}) => {
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const date = new Date().toLocaleDateString();
  const [data, setData] = useState<any>();
  const [taskSugUsed, setTaskSugUsed] = useState<any>();


  useEffect(() => {
    getProfile();
    // dronerSugUsed();
    dronerDetails();
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

  const dronerDetails = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const droner_id = await AsyncStorage.getItem('droner_id');
    console.log('droner', droner_id)

    const plot_id = await AsyncStorage.getItem('plot_id');
    console.log(plot_id)
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
      // console.log(res)
      // setData(res);
    });
  };
  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="นายโดรน เกษตร"
        showBackBtn
        onPressBack={() => navigation.goBack()}
        image={() => (
          <Image source={icons.heart} style={{width: 25, height: 25}} />
        )}
      />
      <ScrollView>
        <View style={[styles.section]}>
          <Text style={[styles.text]}>
            ภาพผลงานนักบิน <Text style={{color: colors.gray}}>(15)</Text>
          </Text>
          <Image
            source={image.empty_farmer}
            style={{
              alignSelf: 'center',
              width: normalize(375),
              height: normalize(200),
              top: 10,
            }}
          />
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
        </View>
        <View style={{height: 10, backgroundColor: '#F8F9FA'}}></View>
        <View style={[styles.section]}>
          <Text style={[styles.text, {marginBottom: '3%'}]}>
            ราคา 50 บาท/ไร่
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
              <Text style={[styles.label]}>5.0 คะแนน (10)</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={icons.distance}
                style={{width: 24, height: 24, right: 3}}
              />
              <Text style={[styles.label]}>ห่างคุณ 10 กม.</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={icons.location}
              style={{width: 24, height: 24, right: 3}}
            />
            <Text style={[styles.label]}>อู่ทอง, จ. สุพรรณบุรี</Text>
          </View>
        </View>
        <View style={{height: 10, backgroundColor: '#F8F9FA'}}></View>
        <View style={[styles.section]}>
          <Text style={[styles.text]}>คิวงานของนักบินโดรน</Text>
        </View>
        <View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <CardDetailDroner index={0} dateTime={''} convenient={''} />
          </ScrollView>
        </View>
        <View style={{height: 10, backgroundColor: '#F8F9FA'}}></View>
        <View style={[styles.section]}>
          <Text style={[styles.text]}>ข้อมูลนักบิน</Text>
          <View style={{flexDirection: 'row', paddingVertical: 10}}>
            <Avatar
              size={normalize(56)}
              source={image.empty_plot}
              avatarStyle={{
                borderRadius: normalize(40),
                borderColor: colors.bg,
                borderWidth: 1,
              }}
            />
            <View style={{left: 20}}>
              <Text style={[styles.droner]}></Text>
              <View style={{flexDirection: 'row', marginTop: 10}}>
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
              </View>
            </View>
          </View>
          <Text style={[styles.droner]}>
            ยี่ห้อโดรน :{' '}
            <Text
              style={{
                fontFamily: font.SarabunLight,
                fontSize: normalize(18),
                color: colors.fontBlack,
              }}>
              DJI T20
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
