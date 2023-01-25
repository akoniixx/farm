import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from '@rneui/base';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  LogBox,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons, image } from '../../assets';
import { MainButton } from '../../components/Button/MainButton';
import PlotSelect from '../../components/Plots/PlotSelect';
import StepIndicatorHead from '../../components/StepIndicatorHead';
import { useAutoBookingContext } from '../../contexts/AutoBookingContext';
import { PlotDatasource } from '../../datasource/PlotDatasource';
import { callcenterNumber } from '../../definitions/callCenterNumber';
import { normalize } from '../../functions/Normalize';
import { initProfileState, profileReducer } from '../../hook/profilefield';

const SelectPlotScreen: React.FC<any> = ({ navigation }) => {
  const {
    autoBookingContext: { setTaskData, getLocationPrice, searchDroner },
  } = useAutoBookingContext();
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [plotList, setPlotList] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const isHaveWaitingApprove = useMemo(() => {
    if (plotList?.data && plotList.data.length > 0) {
      return (plotList.data || []).some((el: any) => el.status !== 'ACTIVE');
    }
    return false;
  }, [plotList?.data]);

  const handleCardPress = (index: number) => {
    setSelectedCard(index);
  };
  const onSubmit = () => {
    if (selectedCard === null) return;

    setTaskData(prev => ({
      ...prev,
      farmerPlotId: plotList.data[selectedCard].id,
    }));
    navigation.navigate('SelectTarget');
  };

  const getPlotlist = async () => {
    setLoading(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    PlotDatasource.getPlotlist(farmer_id!)
      .then(res => {
        setPlotList(res);
        setTimeout(() => setLoading(false), 200);
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    LogBox.ignoreAllLogs();
    getPlotlist();
  }, []);
  // console.log(JSON.stringify(plotList?.data, null, 2));
  return (
    <>
      <StepIndicatorHead
        curentPosition={1}
        onPressBack={() => navigation.goBack()}
        label={'เลือกแปลงของคุณ'}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {isHaveWaitingApprove && (
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
                <View
                  style={{
                    width: 30,
                  }}>
                  <Image
                    source={icons.warningIcon}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: font.SarabunLight,
                    fontSize: 18,
                    paddingRight: 16,
                  }}>
                  หากแปลงของคุณมีสถานะ “รอการตรวจ สอบ”
                  จะส่งผลต่อขั้นตอนจ้างนักบินโดรน กรุณาติดต่อเจ้าหน้าที่
                  เพื่อยืนยันสถานะ
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
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
                    source={icons.calling}
                  />
                  <Text
                    style={{
                      fontFamily: font.AnuphanMedium,
                      color: colors.blueBorder,
                      fontSize: 20,
                    }}>
                    โทรหาเจ้าหน้าที่
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {plotList?.data?.length === 0 ? (
          <View style={{ backgroundColor: 'white' }}>
            <Image
              source={image.empty_plot}
              style={{
                width: normalize(138),
                height: normalize(120),
                alignSelf: 'center',
                top: '5%',
              }}
            />
            <Text
              style={{
                fontFamily: font.SarabunLight,
                fontSize: normalize(16),
                color: colors.gray,
                textAlign: 'center',
                paddingVertical: normalize(22),
              }}>{`คุณไม่มีแปลงเกษตร
 กดเพิ่มแปลงเกษตรได้เลย!`}</Text>

            <View style={[styles.buttonAdd]}>
              <Text style={styles.textaddplot}>+ เพิ่มแปลงเกษตร</Text>
            </View>
          </View>
        ) : (
          <SafeAreaView
            edges={['left', 'right']}
            style={{
              flex: 1,
              justifyContent: 'space-between',
              backgroundColor: 'white',
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ paddingVertical: 10 }}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              showsHorizontalScrollIndicator={false}>
              <FlatList
                data={plotList?.data}
                renderItem={({ item, index }) => (
                  <PlotSelect
                    id={item.id}
                    status={item.status}
                    plotName={item.plotName}
                    plantName={item.plantName}
                    locationName={item.locationName}
                    raiAmount={item.raiAmount}
                    onPress={async () => {
                      handleCardPress(index);
                      setTaskData(prev => ({
                        ...prev,
                        cropName: item.plantName,
                        plantName: item.plantName,
                        plotName: item.plotName,
                        farmerId: item.farmerId,
                        plotArea: item.plotArea,

                        province: item.province,
                        locationName: item.locationName,
                        farmAreaAmount: item.raiAmount,
                        purposeSpray: {
                          id: '',
                          name: '',
                        },
                        targetSpray: [],
                        preparationBy: '',
                      }));
                      await getLocationPrice({
                        provinceId: item.plotArea.provinceId,
                        cropName: item.plantName,
                      });
                      await searchDroner({
                        farmerId: item.farmerId,
                        farmerPlotId: item.id,
                      });
                    }}
                    selected={index === selectedCard}
                  />
                )}
                keyExtractor={item => item.id}
              />
              <View
                style={{
                  padding: 16,
                }}>
                <MainButton
                  label="ถัดไป"
                  disable={selectedCard === null}
                  color={colors.greenLight}
                  onPress={() => onSubmit()}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
      </KeyboardAvoidingView>

      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </>
  );
};
export default SelectPlotScreen;

const styles = StyleSheet.create({
  label: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(20),
    color: colors.fontBlack,
  },
  input: {
    fontFamily: font.SarabunLight,
    height: normalize(56),
    marginVertical: 12,
    padding: 5,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontSize: normalize(16),
  },
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
  },
  buttonAdd: {
    borderColor: '#1F8449',
    borderWidth: 1,
    borderRadius: 10,
    height: normalize(80),
    width: normalize(350),
    borderStyle: 'dashed',
    position: 'relative',
    alignSelf: 'center',
  },
  textaddplot: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
    textAlign: 'center',
    top: '30%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerWarning: {
    padding: 16,
    backgroundColor: colors.white,
  },
});
