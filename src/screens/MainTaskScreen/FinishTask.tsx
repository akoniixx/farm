import {normalize} from '@rneui/themed';
import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
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
const FinishTask: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const {
    state: {isDoneAuth},
  } = useAuth();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkResIsComplete, setCheckResIsComplete] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );
  const getData = async () => {
    setLoading(true);
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskById(
      droner_id,
      ['DONE', 'WAIT_REVIEW', 'CANCELED'],
      page,
      99,
    )
      .then(res => {
        setData(res);
        setCheckResIsComplete(true);
        setTimeout(() => setLoading(false), 200);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
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
    if (!isDoneAuth && data.length < 1) {
      return () => (
        <View
          style={{
            paddingBottom: 8,
            paddingHorizontal: 8,
          }}>
          <WarningDocumentBox />
        </View>
      );
    } else {
      return () => <View />;
    }
  }, [isDoneAuth, data]);

  return (
    <>
      <RenderWarningDocEmpty />
      {data.length !== 0 && checkResIsComplete ? (
        <View style={[{flex: 1}]}>
          <FlatList
            keyExtractor={element => element.item.taskNo}
            data={data}
            ListHeaderComponent={RenderWarningDoc}
            contentContainerStyle={{paddingHorizontal: 8}}
            ListFooterComponent={<View style={{height: 40}} />}
            extraData={data}
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
                finishTime={item.item.taskHistory}
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
    </>
  );
};
export default FinishTask;
