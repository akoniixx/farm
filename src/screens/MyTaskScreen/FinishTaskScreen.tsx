import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { normalize } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { font, image } from '../../assets';
import colors from '../../assets/colors/colors';
import { CardTask } from '../../components/Mytask/CardTask';
import { Filter } from '../../components/Mytask/Filter';
import { FilterFinish } from '../../components/Mytask/FilterFinish';
import { StatusFilterFinish } from '../../components/Mytask/StatusFilterFinish';

import { EmptyTask } from '../../components/TaskDetail/emptyTask';
import { MyJobDatasource } from '../../datasource/MyJobDatasource';
import { SearchMyJobsEntites } from '../../entites/SearchMyJobsEntites';
import * as RootNavigation from '../../navigations/RootNavigation';

const initialPage = 1;
const limit = 10;
const FinishScreen: React.FC<any> = ({}) => {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [taskList, setTaskList] = useState<{
    data: any[];
    total: number;
  }>({
    data: [],
    total: 0,
  });
  const [selectedField, setSelectedField] = useState({
    name: 'งานล่าสุด',
    value: 'date_appointment',
    direction: '',
  });
  const [selectedStatus, setSelectedStatus] = useState({
    name: 'สถานะทั้งหมด',
    value: 'ALL',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(initialPage);

  const getTaskList = async () => {
    setLoading(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const params: SearchMyJobsEntites = {
      farmerId: farmer_id,
      stepTab: '1',
      sortField: selectedField.value,
      sortDirection: selectedField.direction,
      filterStatus: selectedStatus.value,
      page: 1,
      take: limit,
    };
    MyJobDatasource.getMyJobsList(params)
      .then(res => {
        setTaskList(res);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getTaskList();
  }, [selectedField, selectedStatus]);

  const onLoadMore = async () => {
    try {
      if (taskList.data.length >= taskList.total) {
        return;
      }
      const farmer_id = await AsyncStorage.getItem('farmer_id');
      const params: SearchMyJobsEntites = {
        farmerId: farmer_id,
        stepTab: '1',
        sortField: selectedField.value,
        sortDirection: selectedField.direction,
        filterStatus: selectedStatus.value,
        page: page + 1,
        take: limit,
      };
      MyJobDatasource.getMyJobsList(params)
        .then(res => {
          setTaskList({
            data: [...taskList.data, ...res.data],
            total: res.total,
          });
          setPage(page + 1);
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    } catch (e) {
      console.log(e);
    }
  };
  const onRefresh = async () => {
    setPage(initialPage);
    setRefresh(true);
    await getTaskList();
    setRefresh(false);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          paddingHorizontal: normalize(10),
          backgroundColor: colors.grayBg,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: normalize(10),
          }}>
          <FilterFinish
            selectedField={selectedField}
            setSelectedField={setSelectedField}
          />
          <StatusFilterFinish
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </View>
        <View style={{ flex: 1 }}>
          {taskList.data.length > 0 ? (
            <FlatList
              onEndReached={onLoadMore}
              refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
              }
              data={taskList.data}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    RootNavigation.navigate('Main', {
                      screen: 'MyTaskDetailScreen',
                      params: { task: item },
                    })
                  }>
                  <CardTask task={item} />
                </TouchableOpacity>
              )}
            />
          ) : (
            <EmptyTask />
          )}
        </View>
      </View>

      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </>
  );
};

export default FinishScreen;
