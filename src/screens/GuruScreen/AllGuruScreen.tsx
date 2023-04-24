import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import colors from '../../assets/colors/colors';
import icons from '../../assets/icons/icons';
import CustomHeader from '../../components/CustomHeader';
import { CardGuru } from '../../components/Guru/CardGuru';
import { normalize } from '../../functions/Normalize';
import { font } from '../../assets/index';
import { useIsFocused } from '@react-navigation/native';
import { GuruKaset } from '../../datasource/GuruDatasource';
import { momentExtend } from '../../utils/moment-buddha-year';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AllGuruScreen: React.FC<any> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const filterNews = useRef<any>();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [data, setData] = useState<any>();

  useEffect(() => {
    findAllNews();
  }, [isFocused]);
  const findAllNews = async () => {
    setLoading(true);
    GuruKaset.findAllNews('ACTIVE', 'FARMER', 'created_at', 'DESC')
      .then(res => {
        if (res) {
          setData(res);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <CustomHeader
        title="กูรูเกษตร"
        showBackBtn
        onPressBack={() => navigation.goBack()}
        image={() => (
          <TouchableOpacity
            onPress={async() => {
              filterNews.current.show();
            }}>
            <Image source={icons.filter} style={{ width: 28, height: 29 }} />
          </TouchableOpacity>
        )}
      />
      <ScrollView style={{ backgroundColor: '#F8F9FA' }}>
        <View style={{ paddingVertical: 10 }}>
          {data != undefined ? (
            <View>
              <ScrollView>
                {data != undefined &&
                  data.data.map((item: any, index: any) => (
                    <TouchableOpacity
                      key={index}
                      onPress={async () => {
                        await AsyncStorage.setItem('guruId', `${item.id}`);
                        navigation.push('DetailGuruScreen');
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
                  ))}
              </ScrollView>
            </View>
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
            }}></View>
          <View style={{ flex: 1 }}>
            <View style={{ paddingVertical: 20 }}>
              <TouchableOpacity
                onPress={async () => {
                  filterNews.current.hide();
                  await GuruKaset.findAllNews(
                    'ACTIVE',
                    'FARMER',
                    'created_at',
                    'DESC',
                  ).then(res => {
                    setData(res);
                  });
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
                      fontFamily: font.SarabunLight,
                      color: colors.fontGrey,
                    }}>
                    ล่าสุด
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  borderBottomWidth: 0.3,
                  paddingVertical: 10,
                  borderColor: colors.disable,
                  width: Dimensions.get('screen').width * 0.9,
                  alignSelf: 'center',
                }}></View>
            </View>
            <View style={{ paddingVertical: 5 }}>
              <TouchableOpacity
                onPress={async () => {
                  filterNews.current.hide();
                  await GuruKaset.findAllNews(
                    'ACTIVE',
                    'FARMER',
                    'read',
                    'DESC',
                  ).then(res => {
                    setData(res);
                  });
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
                      fontFamily: font.SarabunLight,
                      color: colors.fontGrey,
                    }}>
                    นิยมมากสุด
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  borderBottomWidth: 0.3,
                  paddingVertical: 10,
                  borderColor: colors.disable,
                  width: Dimensions.get('screen').width * 0.9,
                  alignSelf: 'center',
                }}></View>
            </View>
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

export default AllGuruScreen;
