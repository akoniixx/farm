import {View, Image, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {stylesCentral} from '../../styles/StylesCentral';
import {MainButton} from '../../components/Button/MainButton';
import {colors, font, image} from '../../assets';
import RNExitApp from 'react-native-kill-app';
import DateTimeMaintenance from '../../components/dateTimeMaintenance';
import {useMaintenance} from '../../contexts/MaintenanceContext';

const MaintenanceScreen: React.FC<any> = () => {
  const {maintenanceData} = useMaintenance();

  return (
    <SafeAreaView style={stylesCentral.container}>
      {maintenanceData !== undefined && (
        <View
          style={{
            alignItems: 'center',
            marginTop: 180,
          }}>
          <Image
            source={{uri: maintenanceData.imagePath}}
            style={{width: 156, height: 160}}
          />
          <DateTimeMaintenance
            header={maintenanceData.header}
            dateStart={maintenanceData.dateStart}
            dateEnd={maintenanceData.dateEnd}
            text={maintenanceData.text}
            footer={''}
          />
          <View
            style={{
              marginTop: 30,
              width: '90%',
            }}>
            <MainButton
              label="ปิด"
              color={colors.orange}
              fontColor={'white'}
              onPress={() => RNExitApp.exitApp()}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MaintenanceScreen;
