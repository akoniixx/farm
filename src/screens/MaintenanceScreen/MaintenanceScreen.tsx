import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { stylesCentral } from '../../styles/StylesCentral';
import { MainButton } from '../../components/Button/MainButton';
import { colors, font, image } from '../../assets';
import fonts from '../../assets/fonts';
import { normalize } from '../../functions/Normalize';
import { SystemMaintenance } from '../../datasource/SystemMaintenanceDatasource';
import moment from 'moment';
import { momentExtend } from '../../utils/moment-buddha-year';

const MaintenanceScreen: React.FC<any> = ({ navigation }) => {
  const [maintenance, setMaintenance] = useState<any>();
  useEffect(() => {
    getMaintenance();
  }, []);
  const getMaintenance = async () => {
    await SystemMaintenance.Maintenance()
      .then(res => setMaintenance(res.responseData))
      .catch(err => console.log(err));
  };

  console.log(JSON.stringify(maintenance, null, 2));
  return (
    <SafeAreaView style={stylesCentral.container}>
      {maintenance !== undefined && (
        <View
          style={{
            paddingHorizontal: 16,
            justifyContent: 'space-between',
          }}>
          <View style={{ alignItems: 'center', marginTop: 180 }}>
            <Image
              source={image.maintenance}
              style={{ width: 156, height: 160 }}
            />
            <View style={{ marginTop: 20 }}>
              <Text style={styles.fontTitle}>{maintenance.header}</Text>
            </View>
            <View
              style={{
                paddingHorizontal: 30,
                marginTop: 20,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                }}>
                {`วันที่ `}
                <Text
                  style={{
                    color: '#FB8705',
                  }}>
                  {momentExtend.toBuddhistYear(
                    maintenance.startDate,
                    'DD MMMM YYYY',
                  )}
                </Text>
              </Text>
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  fontSize: normalize(24),
                  color: colors.fontBlack,
                  fontWeight: '800',
                  marginBottom: 2,
                }}>
                {'ช่วงเวลา '}
                {moment(maintenance.dateStart)
                  .add(543, 'year')
                  .locale('th')
                  .format('hh.mm')}
                {' - '}
                {moment(maintenance.dateEnd)
                  .add(543, 'year')
                  .locale('th')
                  .format('hh.mm')}
                {' น.'}
              </Text>
              <View style={{ marginTop: 20 }}>
                <Text
                  style={{
                    fontFamily: font.SarabunLight,
                    fontSize: normalize(18),
                    color: colors.fontBlack,
                    marginBottom: 2,
                    lineHeight: 30,
                  }}>
                  {maintenance.text}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 30,
            }}>
            <MainButton
              label="ปิด"
              color={colors.greenLight}
              fontColor={'white'}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MaintenanceScreen;
const styles = StyleSheet.create({
  fontTitle: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(22),
    color: colors.fontBlack,
    fontWeight: '800',
  },
  fontBody: {
    fontFamily: fonts.SarabunLight,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
});
