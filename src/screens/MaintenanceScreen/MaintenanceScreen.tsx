import { View, Image, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { stylesCentral } from '../../styles/StylesCentral';
import { MainButton } from '../../components/Button/MainButton';
import { colors, font, image } from '../../assets';
import { SystemMaintenance } from '../../datasource/SystemMaintenanceDatasource';

import RNExitApp from 'react-native-kill-app';
import { MaintenanceSystem, MaintenanceSystem_INIT } from '../../entities/MaintenanceApp';
import DateTimeMaintenance from '../../components/dateTimeMaintenance';

const MaintenanceScreen: React.FC<any> = ({ navigation }) => {
  const [maintenance, setMaintenance] = useState<MaintenanceSystem>(
    MaintenanceSystem_INIT,
  );
  useEffect(() => {
    getMaintenance();
  }, []);
  const getMaintenance = async () => {
    await SystemMaintenance.Maintenance('FARMER')
      .then(res => {
        if (res.responseData) {
          setMaintenance(res.responseData);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <SafeAreaView style={stylesCentral.container}>
      {maintenance !== undefined && (
        <View
          style={{
            alignItems: 'center',
            marginTop: 180,
          }}>
          <Image
            source={{ uri: maintenance.imagePath }}
            style={{ width: 156, height: 160 }}
          />
          <DateTimeMaintenance
            header={maintenance.header}
            dateStart={maintenance.dateStart}
            dateEnd={maintenance.dateEnd}
            text={maintenance.text}
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
