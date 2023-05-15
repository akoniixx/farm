import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import HTML from 'react-native-render-html';
import colors from '../../assets/colors/colors';
import CustomHeader from '../../components/CustomHeader';
import { CardGuru } from '../../components/Guru/CardGuru';

import { font } from '../../assets/index';
import { useIsFocused } from '@react-navigation/native';
import { GuruKaset } from '../../datasource/GuruDatasource';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import image from '../../assets/images/image';
import { momentExtend } from '../../function/utility';
import { normalize } from '../../function/Normalize';

const DetailGuruScreen: React.FC<any> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    getGuruById();
  }, [isFocused]);
  const getGuruById = async () => {
    setLoading(true);
    const guruId = await AsyncStorage.getItem('guruId');
    GuruKaset.getById(guruId!)
      .then(res => {
        if (res) {
          setData(res);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const getReadGuru = async () => {
      const guruId = await AsyncStorage.getItem('guruId');
      await GuruKaset.updateId(guruId!, 1);
    };
    getReadGuru();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, flex: 1 }}>
      <CustomHeader showBackBtn onPressBack={() => navigation.goBack()} />
      {data != undefined ? (
        <ScrollView>
          <View>
            <View>
              <Image
                style={{ height: normalize(150) }}
                source={
                  !data.imagePath ? image.loading : { uri: data.imagePath }
                }
              />
              <View style={{ paddingHorizontal: 15, top: 15 }}>
                <Text style={styles.text}>{data.title}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 20,
                  paddingHorizontal: 15,
                }}>
                <Text style={styles.textDate} numberOfLines={1}>
                  {momentExtend.toBuddhistYear(data.createAt, 'DD MMM YY')}
                </Text>
                <Text style={[styles.textDate, { left: 15 }]} numberOfLines={1}>
                  {`อ่านแล้ว ` + data.read + ` ครั้ง`}
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 0.3,
                  borderColor: colors.disable,
                  width: Dimensions.get('screen').width * 0.9,
                  alignSelf: 'center',
                }}></View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 20,
                  paddingHorizontal: 15,
                }}>
                <HTML
                  source={{ html: data.details }}
                  contentWidth={Dimensions.get('screen').width}
                  tagsStyles={{
                    strong: {
                      color: colors.fontGrey,
                      fontSize: normalize(18),
                      fontWeight: '400',
                      lineHeight: 28,
                    },
                    em: {
                      color: colors.fontGrey,
                      fontSize: normalize(18),
                      fontWeight: '200',
                      lineHeight: 28,
                    },
                    ul: {
                      color: colors.fontGrey,
                      fontSize: normalize(18),
                      fontWeight: '200',
                      lineHeight: 28,
                    },
                    u: {
                      color: colors.fontGrey,
                      fontSize: normalize(18),
                      fontWeight: '200',
                      lineHeight: 28,
                    },
                    p: {
                      color: colors.fontGrey,
                      fontSize: normalize(18),
                      fontWeight: '200',
                      lineHeight: 28,
                    },
                    ol: {
                      color: colors.fontGrey,
                      fontSize: normalize(18),
                      fontWeight: '200',
                      lineHeight: 28,
                    },
                    li: {
                      color: colors.fontGrey,
                      fontSize: normalize(18),
                      fontWeight: '200',
                      lineHeight: 28,
                    },
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      ) : null}
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </SafeAreaView>
  );
};

export default DetailGuruScreen;
const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width - normalize(25),
    height: 'auto',
    borderWidth: 1,
    borderColor: '#D9DCDF',
    margin: normalize(5),
    borderRadius: normalize(10),
  },
  text: {
    fontSize: 20,
    fontFamily: font.bold,
    color: colors.fontBlack,
    lineHeight: 28,
  },
  textDate: {
    fontSize: 16,
    fontFamily: font.light,
    color: colors.fontBlack,
    lineHeight: 28,
  },
});
