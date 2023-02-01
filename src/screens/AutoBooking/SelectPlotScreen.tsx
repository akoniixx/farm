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
import { mixpanel } from '../../../mixpanel';
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
    state: { plotDisable },
    autoBookingContext: { setTaskData, getLocationPrice, searchDroner },
  } = useAutoBookingContext();
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [plotList, setPlotList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const isHaveWaitingApprove = useMemo(() => {
    if (plotList && plotList.length > 0) {
      return (plotList || []).some((el: any) => el.status !== 'ACTIVE');
    }
    return false;
  }, [plotList]);

  const handleCardPress = (id: string) => {
    setSelectedCard(id);
  };
  const onSubmit = () => {
    if (selectedCard === null) return;

    setTaskData(prev => ({
      ...prev,
      farmerPlotId: selectedCard,
    }));
    navigation.navigate('SelectTarget');
  };

  const getPlotlist = async () => {
    setLoading(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    PlotDatasource.getPlotlist(farmer_id!)
      .then(res => {
        const newData = res.data.map((el: any) => {
          const find =
            plotDisable.length > 0 &&
            plotDisable.find((item: any) => item.plotId === el.id);
          return { ...el, isHaveDroner: find ? find.isHaveDroner : true };
        });
        setPlotList(newData);
        setTimeout(() => setLoading(false), 200);
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    LogBox.ignoreAllLogs();
    getPlotlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (plotDisable.length > 0) {
      const matchData = (plotList || []).map((el: any) => {
        const find = plotDisable.find((item: any) => item.plotId === el.id);

        return {
          ...el,
          isHaveDroner: find ? find.isHaveDroner : true,
        };
      });

      setPlotList(matchData);

      const currentSelected = matchData.find((el: any) => {
        return el.id === selectedCard;
      });
      if (currentSelected && currentSelected.isHaveDroner === false) {
        setSelectedCard(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plotDisable, selectedCard]);
  return (
    <>
      <StepIndicatorHead
        curentPosition={1}
        onPressBack={() => {
          mixpanel.track('Tab back from select plot screen');
          navigation.goBack();
        }}
        label={'เลือกแปลงของคุณ'}
      />

      {plotList.length === 0 ? (
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
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ paddingVertical: 10 }}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              showsHorizontalScrollIndicator={false}>
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
                      <Image
                        source={icons.warningIcon}
                        style={{
                          marginTop: 8,
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
                        หากแปลงของคุณมีสถานะ “รอการตรวจ สอบ”
                        จะส่งผลต่อขั้นตอนจ้างนักบินโดรน กรุณาติดต่อเจ้าหน้าที่
                        เพื่อยืนยันสถานะ
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        mixpanel.track(
                          'Tab callcenter from select plot screen',
                        );
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
              )}
              <FlatList
                data={plotList}
                renderItem={({ item, index }) => (
                  <PlotSelect
                    id={item.id}
                    isHaveDroner={item.isHaveDroner}
                    status={item.status}
                    plotName={item.plotName}
                    plantName={item.plantName}
                    locationName={item.locationName}
                    raiAmount={item.raiAmount}
                    onPress={async () => {
                      try {
                        await getLocationPrice({
                          provinceId: item.plotArea.provinceId,
                          cropName: item.plantName,
                        });
                        await searchDroner({
                          farmerId: item.farmerId,
                          farmerPlotId: item.id,
                        });
                        mixpanel.track(
                          'Tab select plot from select plot screen',
                        );
                        handleCardPress(item.id);
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
                      } catch (e) {
                        console.log(e);
                      }
                    }}
                    selected={item.id === selectedCard}
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
                  onPress={() => {
                    mixpanel.track('Tab submit from select plot screen');
                    onSubmit();
                  }}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}

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
