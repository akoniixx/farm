import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {normalize} from '@rneui/themed';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {FlatList, ScrollView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {colors, image, icons} from '../../assets';
import fonts from '../../assets/fonts';

import Tasklists from '../../components/TaskList/Tasklists';
import {TaskDatasource} from '../../datasource/TaskDatasource';

import {stylesCentral} from '../../styles/StylesCentral';

const TaskScreen: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkResIsComplete, setCheckResIsComplete] = useState(false);

  const updateTask = (id: string, dronerId: string, status: string) => {
    if (status === 'WAIT_START') {
      TaskDatasource.updateTaskStatus(id, dronerId, 'IN_PROGRESS')
        .then(res => {
          Toast.show({
            type: 'success',
            text1: `งาน ${data.taskNo}`,
            text2: 'อัพเดทสถานะเรียบร้อยแล้ว',
          });
          refreshData();
        })
        .catch(err => console.log(err.response.data));
    }
  };

  const getData = async () => {
    setLoading(false);
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskById(
      droner_id,
      ['WAIT_START', 'IN_PROGRESS'],
      page,
      4,
    )
      .then(res => {
        if (res !== undefined) {
          setData(data.concat(res));
          setCheckResIsComplete(true);
        }
      })
      .catch(err => console.log(err));
  };

  const refreshData = async () => {
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskById(
      droner_id,
      ['WAIT_START', 'IN_PROGRESS'],
      page,
      4,
    )
      .then(res => {
        if (res !== undefined) {
          setData(res);
          setCheckResIsComplete(true);
        }
      })
      .catch(err => console.log(err));
  };
  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );

  useEffect(() => {
    getData();
  }, [loading, page]);
  return data.length !== 0 && checkResIsComplete ? (
    <View style={[{flex: 1, backgroundColor: colors.grayBg, padding: 8}]}>
      <FlatList
        onEndReached={() => {
          setLoading(true);
          setPage(page + 1);
        }}
        keyExtractor={element => element.item.taskNo}
        data={data}
        extraData={data}
        renderItem={({item}: any) => (
          <Tasklists
            id={item.item.taskNo}
            status={item.item.status}
            title={item.item.farmerPlot.plantName}
            price={item.item.totalPrice}
            date={item.item.dateAppointment}
            address={item.item.farmerPlot.locationName}
            distance={item.item.distance}
            user={`${item.item.farmer.firstname} ${item.item.farmer.lastname}`}
            img={item.image_profile_url}
            preparation={item.item.preparationBy}
            tel={item.item.farmer.telephoneNo}
            taskId={item.item.id}
            farmArea={item.item.farmAreaAmount}
            updateTask={() =>
              updateTask(item.item.id, item.item.dronerId, item.item.status)
            }
          />
        )}
      />
      <View></View>
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
  );
};
export default TaskScreen;
