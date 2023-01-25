import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { normalize } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { font, image } from '../../assets';
import colors from '../../assets/colors/colors';
import { CardTask } from '../../components/Mytask/CardTask';
import { Filter } from '../../components/Mytask/Filter';
import { StatusFilterFinish } from '../../components/Mytask/StatusFilterFinish';
import { StatusFilterInprogress } from '../../components/Mytask/StatusFilterInprogress';

import { EmptyTask } from '../../components/TaskDetail/emptyTask';
import { MyJobDatasource } from '../../datasource/MyJobDatasource';
import { SearchMyJobsEntites } from '../../entites/SearchMyJobsEntites';
import * as RootNavigation from '../../navigations/RootNavigation';

const FinishScreen: React.FC<any> = ({}) => {
  const [taskList, setTaskList] = useState([]);
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

  const getTaskList = async () => {
    setLoading(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    const params: SearchMyJobsEntites = {
      farmerId: farmer_id,
      stepTab: '1',
      sortField: selectedField.value,
      sortDirection: selectedField.direction,
      filterStatus: selectedStatus.value,
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

  useFocusEffect(
    React.useCallback(() => {
      getTaskList();
    }, []),
  );

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
          <StatusFilterFinish
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </View>
        <View style={{ flex: 1 }}>
          {taskList.length > 0 ? (
            <FlatList
              data={taskList}
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
