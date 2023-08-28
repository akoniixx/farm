import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalize } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';

import colors from '../../assets/colors/colors';
import { CardTask } from '../../components/Mytask/CardTask';
import { Filter } from '../../components/Mytask/Filter';
import { StatusFilterInprogress } from '../../components/Mytask/StatusFilterInprogress';

import { EmptyTask } from '../../components/TaskDetail/emptyTask';
import { MyJobDatasource } from '../../datasource/MyJobDatasource';
import { SearchMyJobsEntites } from '../../entites/SearchMyJobsEntites';
import * as RootNavigation from '../../navigations/RootNavigation';

const initialPage = 1;
const limit = 10;

const InprogressScreen: React.FC<any> = ({}) => {
  const [taskList, setTaskList] = useState<{
    data: any[];
    total: number;
  }>({
    data: [],
    total: 0,
  });
  const [selectedField, setSelectedField] = useState({
    name: 'ใกล้ถึงวันงาน',
    value: 'coming_task',
    direction: '',
  });
  const [selectedStatus, setSelectedStatus] = useState({
    name: 'สถานะทั้งหมด',
    value: 'ALL',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(initialPage);
  const [refresh, setRefresh] = useState<boolean>(false);
  const toTaskDetail = (item: any) => {
    if (item.status === 'WAIT_RECEIVE') {
      RootNavigation.navigate('Main', {
        screen: 'SlipWaitingScreen',
        params: { taskId: item.task_id },
      });
    } else {
      RootNavigation.navigate('Main', {
        screen: 'MyTaskDetailScreen',
        params: { task: item },
      });
    }
  };

  const getTaskList = async () => {
    setLoading(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const params: SearchMyJobsEntites = {
      farmerId: farmer_id,
      stepTab: '0',
      sortField: selectedField.value,
      sortDirection: selectedField.direction,
      filterStatus: selectedStatus.value,
      page: 1,
      take: limit,
    };
    MyJobDatasource.getMyJobsList(params)
      .then(res => {
        setTaskList({
          data: res.data,
          total: res.count,
        });
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getTaskList();
  }, [selectedField, selectedStatus]);

  const onLoadMore = async () => {
    try {
      if (taskList.data.length < taskList.total) {
        const farmer_id = await AsyncStorage.getItem('farmer_id');
        const params: SearchMyJobsEntites = {
          farmerId: farmer_id,
          stepTab: '0',
          sortField: selectedField.value,
          sortDirection: selectedField.direction,
          filterStatus: selectedStatus.value,
          page: page + 1,
          take: limit,
        };
        MyJobDatasource.getMyJobsList(params)
          .then(res => {
            setTaskList(prev => {
              return {
                data: [...prev.data, ...res.data],
                total: res.count,
              };
            });
            setPage(prev => prev + 1);
          })
          .catch(err => console.log(err))
          .finally(() => setLoading(false));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onRefresh = async () => {
    setPage(initialPage);
    setRefresh(true);
    await getTaskList();
    setRefresh(false);
  };

  /*  useFocusEffect(
    React.useCallback(() => {
      getTaskList();
    }, []),
  ); */

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
          <Filter
            selectedField={selectedField}
            setSelectedField={setSelectedField}
          />
          <StatusFilterInprogress
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
                  onPress={() => toTaskDetail(item)}>
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

export default InprogressScreen;
