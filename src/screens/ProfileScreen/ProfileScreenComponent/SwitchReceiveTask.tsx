import {StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../../components/Text';
import {Switch} from '@rneui/base';
import {mixpanel} from '../../../../mixpanel';
import {useAuth} from '../../../contexts/AuthContext';
import {colors, font} from '../../../assets';
import {normalize} from '../../../function/Normalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TaskDatasource} from '../../../datasource/TaskDatasource';
import Toast from 'react-native-toast-message';

export default function SwitchReceiveTask() {
  const {
    state: {user},
    setUser,
  } = useAuth();
  const openReceiveTask = async (isOpen: boolean) => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    TaskDatasource.openReceiveTask(dronerId!, isOpen)
      .then(() => {
        if (!user) {
          return;
        }
        setUser({
          ...user,
          isOpenReceiveTask: isOpen,
        });
        if (!isOpen) {
          TaskDatasource.getTaskById(
            dronerId!,
            ['WAIT_START', 'IN_PROGRESS'],
            1,
            999,
          )
            .then((res: any) => {
              if (res.length != 0) {
                Toast.show({
                  type: 'taskWarningBeforeClose',
                  onPress: () => {
                    Toast.hide();
                  },
                });
              }
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };
  return (
    <>
      <Switch
        style={{
          width: normalize(40),
          height: normalize(20),
        }}
        trackColor={{false: '#767577', true: colors.green}}
        thumbColor={user?.isOpenReceiveTask ? 'white' : '#f4f3f4'}
        value={user?.isOpenReceiveTask}
        onValueChange={value => {
          openReceiveTask(value);
          mixpanel.track('SwitchReceiveTask', {isActive: value});
        }}
        disabled={user?.status !== 'ACTIVE'}
      />
      <Text style={styles.activeFont}>เปิดรับงาน</Text>
    </>
  );
}
const styles = StyleSheet.create({
  activeFont: {
    fontFamily: font.bold,
    fontSize: normalize(16),
    color: colors.fontBlack,
    marginTop: 16,
  },
});
