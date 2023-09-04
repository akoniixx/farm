import { View, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import fonts from '../../../assets/fonts';
import colors from '../../../assets/colors/colors';
import image from '../../../assets/images/image';
import { MainButton } from '../../../components/Button/MainButton';
import { normalize } from '../../../functions/Normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../../styles/StylesCentral';
import * as RootNavigation from '../../../navigations/RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket } from '../../../functions/utility';
import { Authentication } from '../../../datasource/AuthDatasource';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Text from '../../../components/Text/Text';

const DeleteSuccess: React.FC<any> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const onLogout = async () => {
    setLoading(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    socket.removeAllListeners(`send-task-${farmer_id!}`);
    socket.close();
    await Authentication.logout(navigation);
    setLoading(false);
  };

  return (
    <SafeAreaView style={stylesCentral.container}>
      <View
        style={{
          paddingHorizontal: 16,
          justifyContent: 'space-between',
          flex: 1,
        }}>
        <View style={{ alignItems: 'center', paddingTop: '30%' }}>
          <Text style={styles.fontTitle}>บัญชีถูกลบแล้ว!</Text>
          <Text style={[styles.fontBody, { paddingTop: '5%' }]}>
            มีคำถามเพิ่มเติมสามารถติดต่อเจ้าหน้าที่
          </Text>
          <Text style={styles.fontBody}>โทร. 02-233-9000</Text>
          <View style={{ alignItems: 'center', paddingTop: '10%' }}>
            <Image
              source={image.delete_acc}
              style={{ width: 160, height: 195 }}
            />
          </View>
        </View>

        <View
          style={{
            marginBottom: 16,
          }}>
          <MainButton
            label="กลับหน้าหลัก"
            color={colors.greenLight}
            fontColor={'white'}
            onPress={async () => {
              await onLogout();
              RootNavigation.navigate('Auth', {
                screen: 'Onboarding',
              });
            }}
          />
        </View>
      </View>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </SafeAreaView>
  );
};

export default DeleteSuccess;
const styles = StyleSheet.create({
  fontTitle: {
    fontFamily: fonts.AnuphanBold,
    fontSize: normalize(26),
    color: colors.fontBlack,
  },
  fontBody: {
    fontFamily: fonts.SarabunLight,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
});
