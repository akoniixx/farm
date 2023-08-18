import {normalize} from '@rneui/themed';
import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import {colors, image} from '../../assets';
import MainTasklist from '../../components/TaskList/MainTasklist';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import {stylesCentral} from '../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {calTotalPrice} from '../../function/utility';
import WarningDocumentBox from '../../components/WarningDocumentBox/WarningDocumentBox';
import {useAuth} from '../../contexts/AuthContext';
import {RefreshControl} from 'react-native';
import Loading from '../../components/Loading/Loading';
import NetworkLost from '../../components/NetworkLost/NetworkLost';

const initialPage = 1;
const limit = 10;
const WaitStartTask: React.FC = () => {
  const [data, setData] = useState<{
    data: any[];
    count: number;
  }>({
    data: [],
    count: 0,
  });
  const [page, setPage] = useState(initialPage);
  const {
    state: {isDoneAuth},
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingInfinite, setLoadingInfinite] = useState(false);
  const [checkResIsComplete, setCheckResIsComplete] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, []);
  const getData = async () => {
    setLoading(true);
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskById(droner_id, ['WAIT_START'], initialPage, limit)
      .then(res => {
        setTimeout(() => setLoading(false), 200);
        setData(res);
        setCheckResIsComplete(true);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  };
  const onEndReached = async () => {
    if (data.data.length < data.count) {
      setLoadingInfinite(true);
      const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
      TaskDatasource.getTaskById(droner_id, ['WAIT_START'], page + 1, limit)
        .then(res => {
          setData({
            data: [...data.data, ...res.data],
            count: res.count,
          });
          setPage(page + 1);
        })
        .finally(() => setLoadingInfinite(false));
    }
  };
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
            onEndReached={onEndReached}
            ListHeaderComponent={RenderWarningDoc}
            keyExtractor={element => element.item.taskNo}
            data={data.data}
            extraData={data.data}
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
          <View />
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
          <Text style={stylesCentral.blankFont}>ยังไม่มีงานที่ต้องทำ</Text>
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
export default WaitStartTask;
