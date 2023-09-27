import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../styles/StylesCentral';
import { colors, font } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { MainButton } from '../../components/Button/MainButton';
import { normalize } from '../../functions/Normalize';

import { ProgressBar } from '../../components/ProgressBar';
import { ScrollView } from 'react-native';

import icons from '../../assets/icons/icons';

import Spinner from 'react-native-loading-spinner-overlay/lib';
import { mixpanel } from '../../../mixpanel';
import Text from '../../components/Text/Text';
import image from '../../assets/images/image';
import fonts from '../../assets/fonts';
import PlotsItem from '../../components/Plots/Plots';
import { callcenterNumber } from '../../definitions/callCenterNumber';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { useIsFocused } from '@react-navigation/native';
import { Register } from '../../datasource/AuthDatasource';

const SecondFormScreen: React.FC<any> = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [plotData, setPlotData] = useState<any>([]);
  const focused = useIsFocused();

  useEffect(() => {
    const getFarmerPlot = async () => {
      setLoading(true);
      const farmer_id = await AsyncStorage.getItem('farmer_id');
      await ProfileDatasource.getProfile(farmer_id!)
        .then(async res => {
          setPlotData(res.farmerPlot);
        })
        .catch(err => console.log(err))
        .finally(() => {
          setLoading(false);
        });
    };
    getFarmerPlot();
  }, [focused]);
  const onSubmit = async () => {
    try {
      mixpanel.track('Tab next second form register');
      setLoading(true);
      await Register.registerSkip4();
      setLoading(false);
      setTimeout(() => {
        navigation.navigate('SuccessRegister');
      }, 500);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลงทะเบียนเกษตรกร"
        showBackBtn
        onPressBack={() => {
          mixpanel.track('Tab back second form register');
          navigation.goBack();
        }}
      />
      <ScrollView>
        <View style={styles.inner}>
          <View style={styles.containerTopCard}>
            <View
              style={{
                paddingHorizontal: 16,
              }}>
              <View style={{ marginBottom: normalize(10) }}>
                <ProgressBar index={2} />
              </View>
              <Text style={styles.h3}>ขั้นตอนที่ 2 จาก 2</Text>
              <Text style={[styles.h1]}>
                สร้างแปลงเกษตร
                <Text style={{ fontSize: normalize(18), color: '#A7AEB5' }}>
                  {`  (ไม่จำเป็นต้องระบุ)`}
                </Text>
              </Text>
            </View>
            {plotData.length === 0 ? (
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View style={[styles.rectangleFixed]}>
                  <Image style={styles.rectangle} source={image.rectangle} />
                </View>
                <Text style={styles.h2}>กดเพื่อเพิ่มแปลงเกษตรของคุณ</Text>
              </View>
            ) : (
              <View
                style={{
                  marginTop: normalize(10),
                  display: 'flex',
                  justifyContent: 'center',
                  paddingHorizontal: normalize(15),
                }}>
                <Text
                  style={[
                    styles.h1,
                    { color: colors.fontGrey, margin: normalize(10) },
                  ]}>
                  แปลงของคุณ
                </Text>
                <View style={[styles.textPending]}>
                  <Image
                    source={icons.warning}
                    style={{ width: 25, height: 25, right: 10 }}
                  />
                  <Text style={{ fontFamily: font.SarabunLight, fontSize: 18 }}>
                    {`แปลงของคุณอาจใช้เวลารอการตรวจสอบ
จากเจ้าหน้าที`}
                    ่
                  </Text>
                </View>
                {plotData.map((item: any, index: number) => (
                  <PlotsItem
                    data={item}
                    plotId={item.id}
                    fromRegister={true}
                    navigation={navigation}
                    index={index}
                    key={index}
                    plotName={
                      !item.plotName
                        ? 'แปลงที่' +
                          ' ' +
                          `${index + 1}` +
                          ' ' +
                          item.plantName
                        : item.plotName
                    }
                    raiAmount={item.raiAmount}
                    locationName={item.locationName}
                    plantName={item.plantName}
                    status={item.status}
                  />
                ))}
              </View>
            )}
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('Tab add plot second form register');
                navigation.navigate('AddPlotScreen', {
                  fromRegister: true,
                });
              }}
              style={{ paddingHorizontal: normalize(15) }}>
              <View style={[styles.buttonAdd]}>
                <Text style={styles.textaddplot}>+ เพิ่มแปลงเกษตร</Text>
              </View>
            </TouchableOpacity>
            {plotData.length < 1 ? (
              <View style={styles.containerWarning}>
                <View
                  style={{
                    backgroundColor: '#FFF9F2',
                    padding: 16,
                    borderRadius: 12,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={icons.warningIcon}
                      style={{
                        marginTop: 4,
                        width: 18,
                        height: 18,
                        marginRight: 8,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: font.SarabunLight,
                        fontSize: 18,
                        paddingRight: 16,
                        alignSelf: 'flex-start',
                      }}>
                      หากติดปัญหาเรื่องการเพิ่มแปลงเกษตร กรุณาติดต่อเจ้าหน้าที่
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      mixpanel.track('Tab callcenter from select plot screen');
                      Linking.openURL(`tel:${callcenterNumber}`);
                    }}
                    style={{
                      backgroundColor: colors.white,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: colors.blueBorder,
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 50,
                      marginTop: 16,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          marginRight: 8,
                        }}
                        source={icons.callingDarkblue}
                      />
                      <Text
                        style={{
                          fontFamily: font.AnuphanMedium,
                          color: colors.blueDark,
                          fontSize: 20,
                        }}>
                        โทรหาเจ้าหน้าที่
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ height: 16 }} />
            )}
          </View>
          <View
            style={{
              backgroundColor: colors.white,
              zIndex: 2,
              paddingHorizontal: 16,
            }}>
            <MainButton
              label="ถัดไป"
              color={colors.greenLight}
              onPress={onSubmit}
            />
          </View>
        </View>
      </ScrollView>

      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </SafeAreaView>
  );
};
export default SecondFormScreen;

const styles = StyleSheet.create({
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
  },
  h2: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.fontBlack,
    marginBottom: 14,
    marginTop: 16,
    lineHeight: 28,
  },
  h3: {
    fontFamily: font.AnuphanSemiBold,
    fontSize: normalize(14),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },

  image: {
    marginVertical: 24,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    justifyContent: 'space-around',
  },
  headText: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
    marginBottom: normalize(24),
  },
  textPending: {
    width: normalize(350),
    height: normalize(70),
    backgroundColor: '#FFF9F2',
    borderRadius: normalize(12),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(14),
    color: colors.gray,
    marginTop: normalize(24),
  },
  containerTopCard: {
    flex: 1,
  },
  textaddplot: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(20),
    color: colors.primary,
    textAlign: 'center',
    top: '30%',
    width: '100%',
  },
  rectangleFixed: {
    width: '100%',
    height: normalize(160),
    marginTop: 16,
  },
  buttonAdd: {
    borderColor: colors.greenLight,
    borderWidth: 1,
    borderRadius: 10,
    height: normalize(80),
    width: '100%',
    borderStyle: 'dashed',

    alignSelf: 'center',
  },
  btAdd: {
    top: normalize(100),
    borderRadius: 10,
    height: normalize(80),
    width: normalize(340),
    borderStyle: 'dashed',
    position: 'relative',
  },
  rectangle: {
    height: normalize(170),
    width: '100%',
    bottom: '15%',
    alignSelf: 'center',
  },
  containerWarning: {
    padding: 16,
    backgroundColor: colors.white,
  },
});
