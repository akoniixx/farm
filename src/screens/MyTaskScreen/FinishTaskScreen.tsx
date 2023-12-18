import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalize } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import colors from '../../assets/colors/colors';
import { CardTask } from '../../components/Mytask/CardTask';
import { FilterFinish } from '../../components/Mytask/FilterFinish';
import { StatusFilterFinish } from '../../components/Mytask/StatusFilterFinish';

import { EmptyTask } from '../../components/TaskDetail/emptyTask';
import { MyJobDatasource } from '../../datasource/MyJobDatasource';
import { SearchMyJobsEntites } from '../../entites/SearchMyJobsEntites';
import * as RootNavigation from '../../navigations/RootNavigation';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { mixpanel } from '../../../mixpanel';
import useTimeSpent from '../../hook/useTimeSpent';
import { useIsFocused } from '@react-navigation/native';

const initialPage = 1;
const limit = 10;
const FinishScreen: React.FC<any> = ({}) => {
  const timeSpent = useTimeSpent();

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
  const isFocused = useIsFocused();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField, selectedStatus, isFocused]);

  const onLoadMore = async () => {
    try {
      if (taskList?.data.length >= taskList.total) {
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
        {loading ? (
          <View style={{ flex: 1, marginTop: 16 }}>
            <SkeletonPlaceholder
              borderRadius={10}
              speed={2000}
              backgroundColor={colors.skeleton}>
              <>
                {[1, 2].map((_, idx) => {
                  return (
                    <SkeletonPlaceholder.Item
                      key={idx}
                      flexDirection="row"
                      alignItems="center"
                      style={{ width: '100%', marginBottom: 16 }}>
                      <View
                        style={{
                          width: '100%',
                          height: 250,
                        }}
                      />
                    </SkeletonPlaceholder.Item>
                  );
                })}
              </>
            </SkeletonPlaceholder>
          </View>
        ) : (
          <>
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
              {taskList?.data.length > 0 ? (
                <FlatList
                  onEndReached={onLoadMore}
                  refreshControl={
                    <RefreshControl
                      refreshing={refresh}
                      onRefresh={onRefresh}
                    />
                  }
                  data={taskList.data}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        mixpanel.track('MyTaskScreen_CardTask_tapped', {
                          ...item,
                          timeSpent,
                        });
                        RootNavigation.navigate('Main', {
                          screen: 'MyTaskDetailScreen',
                          params: { task: item },
                        });
                      }}>
                      <CardTask task={item} />
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <EmptyTask />
              )}
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default FinishScreen;
