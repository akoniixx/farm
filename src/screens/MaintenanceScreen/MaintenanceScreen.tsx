import { View, Image, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { stylesCentral } from '../../styles/StylesCentral';
import { MainButton } from '../../components/Button/MainButton';
import { colors, font, image } from '../../assets';
import { SystemMaintenance } from '../../datasource/SystemMaintenanceDatasource';
import {
  MaintenanceSystem,
  MaintenanceSystem_INIT,
} from '../../entites/MaintenanceApp';
import DateTimeMaintenance from '../../components/dateTimeMaintenance';
import RNExitApp from 'react-native-kill-app';
import { useMaintenance } from '../../contexts/MaintenanceContext';

const MaintenanceScreen: React.FC<any> = () => {
  const { maintenanceData } = useMaintenance();

  return (
    <SafeAreaView style={stylesCentral.container}>
      {maintenanceData !== undefined && (
        <View
          style={{
            alignItems: 'center',
            marginTop: 180,
          }}>
          <Image
            source={{ uri: maintenanceData.imagePath }}
            style={{ width: 156, height: 160 }}
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
              color={colors.greenLight}
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
