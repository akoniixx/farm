import {normalize} from '@rneui/themed';
import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, Image, RefreshControl, Text, View} from 'react-native';
import {colors, image} from '../../assets';
import MainTasklist from '../../components/TaskList/MainTasklist';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import {stylesCentral} from '../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {calTotalPrice} from '../../function/utility';
import {useAuth} from '../../contexts/AuthContext';
import WarningDocumentBox from '../../components/WarningDocumentBox/WarningDocumentBox';
import Loading from '../../components/Loading/Loading';
import NetworkLost from '../../components/NetworkLost/NetworkLost';

const initialPage = 1;
const limit = 10;
const InprogressTask: React.FC = () => {
  const {
    state: {isDoneAuth},
  } = useAuth();
  const [data, setData] = useState<{
    data: any[];
    count: number;
  }>({
    data: [],
    count: 0,
  });
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [checkResIsComplete, setCheckResIsComplete] = useState(false);
  const [loadingInfinite, setLoadingInfinite] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const getData = useCallback(async () => {
    setLoading(true);
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskById(droner_id, ['IN_PROGRESS'], initialPage, limit)
      .then(res => {
        setTimeout(() => setLoading(false), 200);
        setData(res);
        setCheckResIsComplete(true);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, [getData]);

  const getMoreData = useCallback(async () => {
    if (data.data.length < data.count) {
      setLoadingInfinite(true);
      const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
      TaskDatasource.getTaskById(
        droner_id,
        ['IN_PROGRESS'],
        page + 1,
        limit,
      ).then(res => {
        setData(prev => ({
          data: [...prev.data, ...res.data],
          count: res.count,
        }));
        setPage(prev => prev + 1);
        setLoadingInfinite(false);
      });
    }
  }, [page, data]);
  const RenderWarningDoc = useMemo(() => {
    if (!isDoneAuth) {
      return (
        <View
          style={{
            paddingBottom: 8,
          }}>
          <WarningDocumentBox />
        </View>
      );
    } else {
      return (
        <View
          style={{
            paddingBottom: 8,
          }}
        />
      );
    }
  }, [isDoneAuth]);

  const RenderWarningDocEmpty = useMemo(() => {
    if (!isDoneAuth && data.data.length < 1) {
      return () => (
        <View
          style={{
            paddingBottom: 8,
            paddingHorizontal: 8,
            height: normalize(80),
            backgroundColor: colors.grayBg,
          }}>
          <WarningDocumentBox />
        </View>
      );
    } else {
      return () => <View />;
    }
  }, [isDoneAuth, data]);

  return (
    <NetworkLost onPress={onRefresh}>
      <RenderWarningDocEmpty />
      {data.data.length !== 0 && checkResIsComplete ? (
        <View style={[{flex: 1}]}>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={RenderWarningDoc}
            contentContainerStyle={{paddingHorizontal: 8}}
            ListFooterComponent={
              loadingInfinite ? (
                <View
                  style={{
                    padding: 16,
                  }}>
                  <Loading spinnerSize={40} />
                </View>
              ) : (
                <View style={{height: 40}} />
              )
            }
            keyExtractor={element => element.item.taskNo}
            data={data.data}
            onEndReached={getMoreData}
            extraData={data.data}
            renderItem={({item}: any) => (
              <MainTasklist
                {...item.item}
                id={item.item.taskNo}
                status={item.item.status}
                title={item.item.farmerPlot.plantName}
                price={calTotalPrice(
                  item.item.price,
                  item.item.revenuePromotion,
                )}
                date={item.item.dateAppointment}
                address={item.item.farmerPlot.locationName}
                distance={item.item.distance}
                user={`${item.item.farmer.firstname} ${item.item.farmer.lastname}`}
                img={item.image_profile_url}
                preparation={item.item.preparationBy}
                tel={item.item.farmer.telephoneNo}
                taskId={item.item.id}
                farmArea={item.item.farmAreaAmount}
              />
            )}
          />
        </View>
      ) : (
        <View
          style={[
            stylesCentral.center,
            {flex: 1, backgroundColor: colors.grayBg, padding: 8},
          ]}>
          <Image
            source={image.blankTask}
            style={{width: normalize(136), height: normalize(111)}}
          />
          <Text style={stylesCentral.blankFont}>
            ยังไม่มีงานที่เริ่มดำเนินการ
          </Text>
        </View>
      )}
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </NetworkLost>
  );
};
export default InprogressTask;
