import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import { colors, font, icons } from '../../assets';
import { normalize } from '../../functions/Normalize';
import image from '../../assets/images/image';
import CustomHeader from '../../components/CustomHeader';
import { HistoryPoint } from '../../components/Point/HistoryPoint';
import {
  getAllHistoryPoint,
  historyPoint,
} from '../../datasource/HistoryPointDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatNumberWithComma } from '../../utils/ formatNumberWithComma';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Text from '../../components/Text/Text';

const DetailPointScreen: React.FC<any> = ({ navigation, route }) => {
  const [dataPoint, setDataPoint] = useState<any>();
  const [dataAllPoint, setDataAllPoint] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [total, setTotal] = useState(0);
  const row = 10;
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    getPointFarmer();
    getAllPoint();
  }, []);
  const getPointFarmer = async () => {
    const farmer_id: any = await AsyncStorage.getItem('farmer_id');
    await historyPoint
      .getPoint(farmer_id)
      .then(res => {
        setDataPoint(res.balance);
      })
      .catch(err => console.log(err));
  };
  const getAllPoint = async () => {
    setLoading(true);
    const farmer_id: any = await AsyncStorage.getItem('farmer_id');
    await getAllHistoryPoint(farmer_id, 1, row)
      .then(res => {
        setTotal(res.count);
        setDataAllPoint(res.history);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAllPoint();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const loadMoreData = useCallback(async () => {
    if (dataAllPoint.length >= total) {
      return;
    }
    try {
      setLoading(true);
      const farmer_id: any = await AsyncStorage.getItem('farmer_id');
      await getAllHistoryPoint(farmer_id, current + 1, row)
        .then(res => {
          setDataAllPoint([...dataAllPoint, ...res.history]);
          setLoading(false);
        })
        .catch(err => console.log(err));
      setCurrent(current + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [current, dataAllPoint, total]);
  return (
    <View
      style={{
        backgroundColor: colors.white,
        flex: 1,
      }}>
      <View
        style={{
          position: 'relative',
        }}>
        <View style={styles.HeadBg} />
        <View
          style={{
            width: '100%',
            position: 'absolute',
          }}>
          <View>
            <CustomHeader
              title="แต้มของฉัน"
              titleColor="white"
              showBackBtn
              onPressBack={() => navigation.goBack()}
              backgroundColor={colors.greenLight}
            />
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            top: '82%',
            height: normalize(50),
            alignSelf: 'center',
          }}>
          <View
            style={{
              borderRadius: normalize(10),
              borderWidth: normalize(1),
              borderColor: colors.greenLight,
              height: '100%',
              width: normalize(330),
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              shadowRadius: normalize(30),
              backgroundColor: colors.white,
              shadowColor: colors.greenLight,
              shadowOpacity: 0.4,
            }}>
            <Image
              source={icons.ICKPoint}
              style={{
                width: normalize(35),
                height: normalize(35),
              }}
            />
            <Text
              style={{
                fontFamily: font.AnuphanBold,
                color: colors.fontBlack,
                fontSize: normalize(18),
                marginLeft: normalize(15),
                marginRight: normalize(5),
              }}>
              {formatNumberWithComma(dataPoint || '0')} แต้ม
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.inner}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: normalize(10),
          }}>
          <Text
            style={{
              fontFamily: font.AnuphanMedium,
              fontSize: normalize(20),
              color: colors.fontBlack,
            }}>
            ประวัติการได้รับ/ใช้แต้ม
          </Text>
        </View>
      </View>
      {dataAllPoint ? (
        <View
          style={{
            backgroundColor: colors.white,
          }}>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onEndReached={loadMoreData}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={<View style={{ height: normalize(450) }} />}
            data={dataAllPoint}
            renderItem={({ item, index }) => (
              <HistoryPoint
                index={index}
                date={item.createAt}
                point={item.amountValue}
                action={item.action}
                taskId={item.taskId}
                taskNo={item.taskNo != null ? item.taskNo : ''}
                campaign={item?.campaign}
                isSpecialPointFarmer={item.isSpecialPointFarmer}
              />
            )}
          />
        </View>
      ) : (
        <View
          style={{
            alignSelf: 'center',
            paddingVertical: normalize(150),
            height: '100%',
          }}>
          <Image
            source={image.empty_coupon}
            style={{ width: normalize(130), height: normalize(120) }}
          />
          <View style={{ top: normalize(20) }}>
            <Text style={styles.textEmpty}>ไม่มีแต้มที่ได้รับ</Text>
            <Text style={styles.textEmpty}>และการที่ใช้แต้ม</Text>
          </View>
        </View>
      )}
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </View>
  );
};
export default DetailPointScreen;

const styles = StyleSheet.create({
  inner: {
    marginTop: normalize(50),
    paddingHorizontal: normalize(17),
  },
  container: {
    flex: 1,
  },
  HeadBg: {
    width: '100%',
    height: normalize(140),
    backgroundColor: colors.greenLight,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    display: 'flex',
    paddingVertical: '50%',
  },
  textEmpty: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    lineHeight: normalize(30),
    textAlign: 'center',
    color: colors.grey40,
  },
});
