import {
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  PermissionsAndroid,
} from 'react-native';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../styles/StylesCentral';
import { colors, font } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { MainButton } from '../../components/Button/MainButton';
import { normalize } from '../../functions/Normalize';
import { Register } from '../../datasource/AuthDatasource';
import { ProgressBar } from '../../components/ProgressBar';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { registerReducer } from '../../hook/registerfield';
import icons from '../../assets/icons/icons';
import { QueryLocation } from '../../datasource/LocationDatasource';
import fonts from '../../assets/fonts';
import Geolocation from 'react-native-geolocation-service';
import ActionSheet from 'react-native-actions-sheet';
import {
  LocationInPostcodeSelect,
  LocationSelect,
} from '../../components/Location/Location';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { mixpanel } from '../../../mixpanel';
import Text from '../../components/Text/Text';

const SecondFormScreen: React.FC<any> = ({ navigation, route }) => {
  const initialFormRegisterState = {
    no: '',
    address: '',
    province: '',
    district: '',
    subdistrict: '',
    postal: '',
  };
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const telNo = route.params.tele;
  const [items, setItems] = useState<any>([]);
  const [itemsDistrict, setItemDistrict] = useState([]);
  const [itemsSubDistrict, setItemSubDistrict] = useState([]);
  const [proVince, setProVince] = useState<any>([]);
  const [disTrict, setDisTrict] = useState<any>([]);
  const [subDistrict, setSubDistrict] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [bottompadding, setBottomPadding] = useState(0);
  const [getPermiss, setGetPermiss] = useState(false);
  const provinceSheet = useRef<any>();
  const DistriSheet = useRef<any>();
  const SubDistriSheet = useRef<any>();

  useEffect(() => {
    const getPermission = async () => {
      const currentPermiss = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      setGetPermiss(currentPermiss);
    };
    getPermission();

    QueryLocation.QueryProvince().then(res => {
      const filteredProvinces = res.filter(
        (province: any) => province.provinceName,
      );

      const sortedProvinces = filteredProvinces.sort(
        (a: { provinceName: string }, b: { provinceName: any }) =>
          a.provinceName.localeCompare(b.provinceName),
      );
      setItems(sortedProvinces);
    });
  }, []);
  useEffect(() => {
    if (proVince != null) {
      QueryLocation.QueryDistrict(proVince.value).then(res => {
        const District = res.map((item: any) => {
          return { label: item.districtName, value: item.districtId };
        });
        setItemDistrict(District);
      });
    }
  }, [proVince]);
  useEffect(() => {
    if (proVince != null && disTrict != null) {
      QueryLocation.QuerySubDistrict(disTrict.value, disTrict.label).then(
        res => {
          const SubDistrict = res.map((item: any) => {
            return {
              label: item.subdistrictName,
              value: item.subdistrictId,
              postcode: item.postcode,
            };
          });
          setItemSubDistrict(SubDistrict);
        },
      );
    }
  }, [proVince, disTrict]);

  const [formState, dispatch] = useReducer(
    registerReducer,
    initialFormRegisterState,
  );
  const selectProvince = (value: any, label: any) => {
    dispatch({
      type: 'Handle Input',
      field: 'province',
      payload: value,
    });
    setProVince(value);
    provinceSheet.current.hide();
  };

  const selectDistrict = (value: any, label: any) => {
    dispatch({
      type: 'Handle Input',
      field: 'district',
      payload: value,
    });
    setDisTrict(value);
    DistriSheet.current.hide();
  };
  const selectSubDistrict = (value: any, label: any) => {
    dispatch({
      type: 'Handle Input',
      field: 'subdistrict',
      payload: value,
    });
    dispatch({
      type: 'Handle Input',
      field: 'postal',
      payload: value.postcode,
    });
    setSubDistrict(value);
    SubDistriSheet.current.hide();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={stylesCentral.container}>
          <CustomHeader
            title="ลงทะเบียนเกษตรกร"
            showBackBtn
            onPressBack={() => {
              mixpanel.track('Tab back second form register');
              navigation.goBack();
            }}
          />
          <View style={styles.inner}>
            <View style={styles.containerTopCard}>
              <View style={{ marginBottom: normalize(10) }}>
                <ProgressBar index={2} />
              </View>
              <Text style={styles.h3}>ขั้นตอนที่ 2 จาก 4</Text>
              <Text style={[styles.h1]}>
                ระบุที่อยู่
                <Text style={{ fontSize: normalize(18), color: '#A7AEB5' }}>
                  {`  (ไม่จำเป็นต้องระบุ)`}
                </Text>
              </Text>
              <ScrollView style={{ top: '5%' }}>
                <Text style={styles.head}>บ้านเลขที่</Text>
                <TextInput
                  allowFontScaling={false}
                  onChangeText={value => {
                    dispatch({
                      type: 'Handle Input',
                      field: 'no',
                      payload: value,
                    });
                  }}
                  value={formState.no}
                  style={[styles.input]}
                  editable={true}
                  placeholder={'บ้านเลขที่'}
                  placeholderTextColor={colors.gray}
                />
                <Text style={styles.head}>รายละเอียดที่อยู่</Text>
                <TextInput
                  allowFontScaling={false}
                  onChangeText={value => {
                    dispatch({
                      type: 'Handle Input',
                      field: 'address',
                      payload: value,
                    });
                  }}
                  value={formState.address}
                  style={styles.input}
                  editable={true}
                  placeholder={'รายละเอียดที่อยู่ (หมู่, ถนน)'}
                  placeholderTextColor={colors.gray}
                />
                <Text style={styles.head}>จังหวัด</Text>
                <TouchableOpacity
                  onPress={() => {
                    provinceSheet.current.show();
                  }}>
                  <View
                    style={{
                      borderColor: colors.disable,
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                      marginVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: normalize(55),
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.AnuphanMedium,
                        fontSize: normalize(20),
                        color: colors.gray,
                      }}>
                      <Text
                        style={{
                          fontFamily: font.SarabunLight,
                          color: colors.disable,
                        }}>
                        {!proVince.label ? (
                          <Text
                            style={{
                              fontFamily: font.SarabunLight,
                              color: colors.gray,
                            }}>
                            จังหวัด
                          </Text>
                        ) : (
                          <TextInput
                            allowFontScaling={false}
                            style={{
                              fontFamily: font.SarabunLight,
                              color: colors.fontGrey,
                            }}>
                            {proVince.label}
                          </TextInput>
                        )}
                      </Text>
                    </Text>
                    <Image
                      source={icons.down}
                      style={{
                        width: normalize(24),
                        height: normalize(22),
                        marginRight: 10,
                        tintColor: colors.disable,
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.head}>อำเภอ</Text>
                <TouchableOpacity
                  disabled={!proVince.label ? true : false}
                  onPress={() => {
                    DistriSheet.current.show();
                  }}>
                  <View
                    style={{
                      backgroundColor: !proVince.label
                        ? '#F2F3F4'
                        : colors.white,
                      borderColor: colors.disable,
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                      marginVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: normalize(55),
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.AnuphanMedium,
                        fontSize: normalize(20),
                        color: colors.gray,
                      }}>
                      <Text
                        style={{
                          fontFamily: font.SarabunLight,
                          color: colors.disable,
                        }}>
                        {!disTrict.label ? (
                          <Text
                            style={{
                              fontFamily: font.SarabunLight,
                              color: colors.gray,
                            }}>
                            อำเภอ
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontFamily: font.SarabunLight,
                              color: colors.fontGrey,
                            }}>
                            {disTrict.label}
                          </Text>
                        )}
                      </Text>
                    </Text>
                    <Image
                      source={icons.down}
                      style={{
                        width: normalize(24),
                        height: normalize(22),
                        marginRight: 10,
                        tintColor: colors.disable,
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.head}>ตำบล</Text>
                <TouchableOpacity
                  onPress={() => {
                    SubDistriSheet.current.show();
                  }}>
                  <View
                    style={{
                      backgroundColor: !disTrict.label
                        ? '#F2F3F4'
                        : colors.white,
                      borderColor: colors.disable,
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 10,
                      marginVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: normalize(55),
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.AnuphanMedium,
                        fontSize: normalize(20),
                        color: colors.gray,
                      }}>
                      <Text
                        style={{
                          fontFamily: font.SarabunLight,
                          color: colors.disable,
                        }}>
                        {!subDistrict.label ? (
                          <Text
                            style={{
                              fontFamily: font.SarabunLight,
                              color: colors.gray,
                            }}>
                            ตำบล
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontFamily: font.SarabunLight,
                              color: colors.fontGrey,
                            }}>
                            {subDistrict.label}
                          </Text>
                        )}
                      </Text>
                    </Text>
                    <Image
                      source={icons.down}
                      style={{
                        width: normalize(24),
                        height: normalize(22),
                        marginRight: 10,
                        tintColor: colors.disable,
                      }}
                    />
                  </View>
                </TouchableOpacity>
                <Text style={styles.head}>รหัสไปรษณีย์</Text>
                <TextInput
                  allowFontScaling={false}
                  value={subDistrict.postcode}
                  style={[
                    styles.input,
                    {
                      backgroundColor: '#F2F3F4',
                      marginBottom: normalize(bottompadding),
                    },
                  ]}
                  editable={false}
                  placeholder={'รหัสไปรษณีย์'}
                  placeholderTextColor={colors.gray}
                />
              </ScrollView>
              <View style={{ height: 40 }}></View>
            </View>
            <View style={{ backgroundColor: colors.white, zIndex: 0 }}>
              <MainButton
                label="ถัดไป"
                color={colors.greenLight}
                onPress={() => {
                  mixpanel.track('Tab next second form register');
                  setLoading(true);
                  Register.register2(
                    telNo,
                    formState.no,
                    formState.address,
                    formState.province.value,
                    formState.district.value,
                    formState.subdistrict.value,
                    formState.postal,
                  )
                    .then(async res => {
                      if (Platform.OS === 'ios' && getPermiss === false) {
                        await Geolocation.requestAuthorization('always');
                      } else if (
                        Platform.OS === 'android' &&
                        getPermiss === false
                      ) {
                        await PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        );
                      }
                      setLoading(false);
                      navigation.navigate('ThirdFormScreen', {
                        tele: formState.tel,
                        latitude: 0,
                        longitude: 0,
                      });
                      Geolocation.getCurrentPosition(
                        position => {
                          setLoading(false);
                          navigation.navigate('ThirdFormScreen', {
                            tele: formState.tel,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                          });
                        },
                        error => {
                          console.log(error.code, error.message);
                        },
                        {
                          enableHighAccuracy: false,
                          timeout: 15000,
                          maximumAge: 10000,
                        },
                      );
                    })
                    .catch(err => console.log(err));
                }}
              />
            </View>
            <ActionSheet ref={provinceSheet}>
              <View
                style={{
                  backgroundColor: 'white',
                  paddingVertical: normalize(30),
                  paddingHorizontal: normalize(20),
                  width: windowWidth,
                  height: windowHeight * 0.7,
                  borderRadius: normalize(20),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.head, { marginBottom: normalize(10) }]}>
                    จังหวัด
                  </Text>
                  <Text
                    style={{
                      color: colors.greenLight,
                      fontFamily: font.SarabunMedium,
                      fontSize: normalize(16),
                    }}
                    onPress={() => {
                      provinceSheet.current.hide();
                    }}>
                    ยกเลิก
                  </Text>
                </View>
                <View style={styles.container}>
                  <ScrollView>
                    {items.map((value: any, index: any) => (
                      <TouchableOpacity>
                        <LocationSelect
                          key={index}
                          label={value.provinceName}
                          value={value.provinceName}
                          onPress={() => selectProvince(value, index)}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </ActionSheet>
            <ActionSheet ref={DistriSheet}>
              <View
                style={{
                  backgroundColor: 'white',
                  paddingVertical: normalize(30),
                  paddingHorizontal: normalize(20),
                  width: windowWidth,
                  height: windowHeight * 0.7,
                  borderRadius: normalize(20),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.head, { marginBottom: normalize(10) }]}>
                    อำเภอ
                  </Text>
                  <Text
                    style={{
                      color: colors.greenLight,
                      fontFamily: font.SarabunMedium,
                      fontSize: normalize(16),
                    }}
                    onPress={() => {
                      DistriSheet.current.hide();
                    }}>
                    ยกเลิก
                  </Text>
                </View>
                <View style={styles.container}>
                  <ScrollView>
                    {itemsDistrict.map(
                      (
                        v: { label: any; value: any },
                        i: any | null | undefined,
                      ) => (
                        <TouchableOpacity>
                          <LocationSelect
                            key={i}
                            label={v.label}
                            value={v.value}
                            onPress={() => selectDistrict(v, i)}
                          />
                        </TouchableOpacity>
                      ),
                    )}
                  </ScrollView>
                </View>
              </View>
            </ActionSheet>
            <ActionSheet ref={SubDistriSheet}>
              <View
                style={{
                  backgroundColor: 'white',
                  paddingVertical: normalize(30),
                  paddingHorizontal: normalize(20),
                  width: windowWidth,
                  height: windowHeight * 0.7,
                  borderRadius: normalize(20),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.head, { marginBottom: normalize(10) }]}>
                    ตำบล
                  </Text>
                  <Text
                    style={{
                      color: colors.greenLight,
                      fontFamily: font.SarabunMedium,
                      fontSize: normalize(16),
                    }}
                    onPress={() => {
                      SubDistriSheet.current.hide();
                    }}>
                    ยกเลิก
                  </Text>
                </View>
                <View style={styles.container}>
                  <ScrollView>
                    {itemsSubDistrict.map(
                      (
                        v: { label: any; value: any; postcode: any },
                        i: any | null | undefined,
                      ) => (
                        <TouchableOpacity>
                          <LocationInPostcodeSelect
                            key={i}
                            label={v.label}
                            value={v.value}
                            postcode={v.postcode}
                            onPress={() => selectSubDistrict(v, i)}
                          />
                        </TouchableOpacity>
                      ),
                    )}
                  </ScrollView>
                </View>
              </View>
            </ActionSheet>
          </View>
          <Spinner
            visible={loading}
            textContent={'Loading...'}
            textStyle={{ color: '#FFF' }}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default SecondFormScreen;

const styles = StyleSheet.create({
  carlendar: {
    height: '50%',
    borderWidth: 1,
    borderColor: colors.disable,
    borderRadius: 10,
  },
  date: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  datePart: {
    width: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '200',
    marginBottom: 5,
  },
  digit: {
    fontSize: 20,
  },

  head: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
  },
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
  },
  h2: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(16),
    color: colors.fontBlack,
    marginTop: normalize(24),
  },
  h3: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(14),
    color: colors.gray,
  },
  container: {
    flex: 1,
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
    fontSize: normalize(20),
  },
  datePickerStyle: {
    width: 200,
    marginTop: 20,
  },
  addImg: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    marginVertical: 24,
    alignItems: 'center',
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  headText: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
    marginBottom: normalize(24),
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
});
