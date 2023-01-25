import React, { useEffect, useReducer, useState } from 'react';
import {
  Image,
  View,
  StyleSheet,
  Text,
  FlatList,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons, image } from '../../../assets';
import { MainButton } from '../../../components/Button/MainButton';
import CustomHeader from '../../../components/CustomHeader';
import { normalize } from '../../../functions/Normalize';
import { initProfileState, profileReducer } from '../../../hook/profilefield';
import { stylesCentral } from '../../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileDatasource } from '../../../datasource/ProfileDatasource';
import { ScrollView } from 'react-native-gesture-handler';
import PlotInProfile from '../../../components/Plots/PlotsInProfile';
import PlotsItem from '../../../components/Plots/Plots';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import PlotsItemEdit from '../../../components/Plots/PlotsItemEdit';

const AllPlotScreen: React.FC<any> = ({ navigation }) => {
  const [profilestate, dispatch] = useReducer(profileReducer, initProfileState);
  const [loading, setLoading] = useState(false);
  const [showModalCall, setShowModalCall] = useState(false);
  const [currentTel, setCurrentTel] = useState('');
  const [farmerPlot, setFarmerPlot] = useState<any>([]);
  const [statusPlot, setStatusPlot] = useState<any>();

  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = async () => {
    setLoading(true);
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    ProfileDatasource.getProfile(farmer_id!)
      .then(async res => {
        setFarmerPlot(res.farmerPlot);
        const imgPath = res.file.filter((item: any) => {
          if (item.category === 'PROFILE_IMAGE') {
            return item;
          }
        });
        if (imgPath.length === 0) {
          dispatch({
            type: 'InitProfile',
            name: `${res.firstname} ${res.lastname}`,
            id: res.farmerCode,
            image: '',
            plotItem: res.farmerPlot,
            status: res.status,
          });
        } else {
          ProfileDatasource.getImgePathProfile(farmer_id!, imgPath[0].path)
            .then(resImg => {
              dispatch({
                type: 'InitProfile',
                name: `${res.firstname} ${res.lastname}`,
                id: res.farmerCode,
                image: resImg.url,
                plotItem: res.farmerPlot,
                status: res.status,
              });
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };
  const onPressMobileNumberClick = (number: any) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }

    Linking.openURL(phoneNumber);
  };

  const inventory = farmerPlot.map((x: any) => x.status);
  const result = inventory.find((x: any) => x === 'PENDING');
  return (
    <>
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title="แปลงของคุณ"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.inner}>
          <View style={styles.container}>
            <ScrollView>
              {result ? (
                <View
                  style={{
                    height: 176,
                    width: normalize(340),
                    alignSelf: 'center',
                    backgroundColor: '#FFF9F2',
                    borderRadius: 10,
                  }}>
                  <View style={{ padding: 15, alignSelf: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        source={icons.warning}
                        style={{ width: 20, height: 20, marginRight: 10 }}
                      />
                      <Text style={[styles.textAlert]}>
                        หากแปลงของคุณมีสถานะ “รอการตรวจ
                      </Text>
                    </View>
                    <Text style={[styles.textAlert, { marginLeft: 30 }]}>
                      สอบ” จะส่งผลต่อขั้นตอนจ้างนักบินโดรน
                    </Text>
                    <Text style={[styles.textAlert, { marginLeft: 30 }]}>
                      กรุณาติดต่อเจ้าหน้าที่ เพื่อยืนยันสถานะ
                    </Text>
                  </View>
                  <View style={{ paddingHorizontal: 10 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setShowModalCall(true);
                      }}
                      style={{
                        height: 60,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        backgroundColor: colors.white,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        width: '100%',
                        borderRadius: 12,
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: colors.blueBorder,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          alignSelf: 'center',
                        }}>
                        <Image
                          style={{
                            width: 24,
                            height: 24,
                            marginRight: 16,
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
              ) : null}
              {profilestate.plotItem.length === 0 ? (
                <View style={{ top: '15%' }}>
                  <Image
                    source={image.empty_plot}
                    style={{
                      width: normalize(159),
                      height: normalize(140),
                      alignSelf: 'center',
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: font.SarabunLight,
                      fontSize: normalize(18),
                      color: colors.gray,
                      textAlign: 'center',
                      paddingVertical: normalize(22),
                    }}>{`คุณไม่มีแปลงเกษตร
 กดเพิ่มแปลงเกษตรได้เลย!`}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('AddPlotScreen');
                    }}>
                    <View style={[styles.buttonAdd]}>
                      <Text style={styles.textaddplot}>+ เพิ่มแปลงเกษตร</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ top: 5 }}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      top: 20,
                    }}>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('AddPlotScreen');
                        }}>
                        <View
                          style={{
                            borderColor: '#1F8449',
                            borderWidth: 1,
                            borderRadius: 10,
                            height: normalize(80),
                            width: normalize(330),
                            borderStyle: 'dashed',
                            position: 'relative',
                            alignSelf: 'center',
                          }}>
                          <Text style={styles.textaddplot}>
                            + เพิ่มแปลงเกษตร
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View style={{ top: 10 }}>
                        {profilestate.plotItem.map((item: any, index: any) => (
                          <TouchableOpacity
                            key={index}
                            onPress={async () => {
                              await AsyncStorage.setItem(
                                'plot_id',
                                `${item.id}`,
                              );
                              navigation.push('EditPlotScreen');
                            }}>
                            <PlotsItemEdit
                              key={index}
                              index={index}
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
                              plantName={item.plantName}
                              status={item.status}
                              locationName={item.locationName}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}
              <View style={{height: 40}}></View>
            </ScrollView>
          </View>
          <View style={{ backgroundColor: colors.white }}>
            <MainButton
              disable={!profilestate.plotItem}
              label="บันทึก"
              color={colors.greenLight}
              onPress={() => {
                navigation.navigate('ProfileScreen');
              }}
            />
          </View>
        </View>
        <Modal animationType="fade" transparent={true} visible={showModalCall}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingBottom: 32,
            }}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${currentTel}`);
              }}
              style={{
                height: 60,
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: colors.white,
                justifyContent: 'center',
                alignItems: 'flex-start',
                width: '100%',
                borderRadius: 12,
                marginBottom: 8,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 16,
                  }}
                  source={icons.callBlue}
                />
                <Text
                  style={{
                    fontFamily: font.AnuphanMedium,
                    color: '#007AFF',
                    fontSize: 20,
                  }}>
                  โทร +66 2-233-9000
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowModalCall(false);
              }}
              style={{
                height: 60,
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: colors.white,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                borderRadius: 12,
                marginBottom: 8,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: font.AnuphanMedium,
                    color: '#007AFF',
                    fontSize: 20,
                  }}>
                  ยกเลิก
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};
export default AllPlotScreen;
const styles = StyleSheet.create({
  empty_state: {
    alignSelf: 'center',
    top: '10%',
  },
  list: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.fontGrey,
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
  search: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    alignItems: 'flex-end',
    tintColor: colors.fontGrey,
  },
  body: {
    paddingHorizontal: 20,
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: 40,
    borderRadius: 5,
    margin: 10,
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
    tintColor: colors.disable,
  },
  ButtonLocation: {
    left: '50%',
    marginLeft: 5,
    marginTop: 40,
    position: 'absolute',
    top: '50%',
  },
  item: {
    top: normalize(20),
    fontSize: normalize(16),
    height: normalize(63),
    fontFamily: font.SarabunLight,
  },
  head: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
    color: colors.fontGrey,
  },
  first: {
    flex: 1,
    justifyContent: 'space-around',
  },
  button: {
    width: normalize(160),
  },
  inner: {
    paddingHorizontal: normalize(15),
    flex: 1,
    justifyContent: 'space-around',
  },
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
  },
  h2: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
    textAlign: 'center',
  },
  h3: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(14),
    color: colors.gray,
  },
  varidate: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(12),
    color: 'red',
  },
  hSheet: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(14),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },

  rectangleFixed: {
    position: 'relative',
    top: '10%',
  },
  btAdd: {
    top: normalize(100),
    borderRadius: 10,
    height: normalize(80),
    width: normalize(340),
    borderStyle: 'dashed',
    position: 'relative',
  },
  buttonAdd: {
    top: normalize(40),
    borderColor: '#1F8449',
    borderWidth: 1,
    borderRadius: 10,
    height: normalize(80),
    width: normalize(330),
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
  rectangle: {
    height: normalize(170),
    width: normalize(375),
    bottom: '15%',
    alignSelf: 'center',
  },
  map: {
    alignSelf: 'center',
    width: normalize(344),
    height: normalize(190),
    borderRadius: normalize(20),
  },
  markerFixed: {
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: normalize(31),
    width: normalize(26),
  },
  textAlert: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
});
