import {Button} from '@rneui/themed';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {font, icons} from '../../assets';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';
import image from '../../assets/images/image';
import {MainButton} from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import {ProgressBar} from '../../components/ProgressBar';
import {QueryLocation} from '../../datasource/LocationDatasource';
import {normalize} from '../../functions/Normalize';
import {registerReducer} from '../../hook/registerfield';
import {stylesCentral} from '../../styles/StylesCentral';
import ActionSheet from 'react-native-actions-sheet';
import {Register} from '../../datasource/AuthDatasource';
import Geolocation from 'react-native-geolocation-service';
import {
  LocationInPostcodeSelect,
  LocationSelect,
} from '../../components/Location/Location';

const SecondFormScreen: React.FC<any> = ({route, navigation}) => {
  const initialFormRegisterState = {
    no : "",
    address : "",
    province : "",
    district : "",
    subdistrict : "",
    postal : ""
  };
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const telNo = route.params;
  const [items, setItems] = useState<any>([]);
  const [itemsDistrict, setItemDistrict] = useState([]);
  const [itemsSubDistrict, setItemSubDistrict] = useState([]);
  const [proVince, setProVince] = useState<any>([]);
  const [disTrict, setDisTrict] = useState<any>([]);
  const [subDistrict, setSubDistrict] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [bottompadding, setBottomPadding] = useState(0);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [valueDistrict, setValueDistrict] = useState(null);
  const [openSubDistrict, setOpenSubDistrict] = useState(false);
  const [valueSubDistrict, setSubValueDistrict] = useState(null);
  const [province, setProvince] = useState<any>(null);
  const [district, setDistrict] = useState<any>(null);
  const [subdistrict, setSubdistrict] = useState<any>(null);
  const provinceSheet = useRef<any>();
  const DistriSheet = useRef<any>();
  const SubDistriSheet = useRef<any>();

  useEffect(() => {
    QueryLocation.QueryProvince().then(res => {
      const Province = res.map((item: any) => {
        return {label: item.provinceName, value: item.provinceId};
      });
      setItems(Province);
    });
  }, []);

  useEffect(() => {
    if (province != null) {
      QueryLocation.QueryDistrict(province.value).then(res => {
        const District = res.map((item: any) => {
          return {label: item.districtName, value: item.districtId};
        });
        setItemDistrict(District);
      });
    }
  }, [province]);

  useEffect(() => {
    if (province != null && district != null) {
      QueryLocation.QuerySubDistrict(district.value, district.label).then(
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
  }, [province, district]);

  const [formState, dispatch] = useReducer(
    registerReducer,
    initialFormRegisterState,
  );
  console.log(formState);
  const selectProvince = (value: any, label: any) => {
    setProVince(value);
    provinceSheet.current.hide();
  };
  const selectDistrict = (value: any, label: any) => {
    setDisTrict(value);
    DistriSheet.current.hide();
  };
  const selectSubDistrict = (value: any, label: any) => {
    setSubDistrict(value);
    SubDistriSheet.current.hide();
  };

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลงทะเบียนเกษตรกร"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.inner}>
        <View style={styles.container}>
          <View style={{marginBottom: normalize(10)}}>
            <ProgressBar index={2} />
          </View>
          <Text style={styles.h3}>ขั้นตอนที่ 2 จาก 4</Text>
          <Text style={styles.h1}>
            ระบุที่อยู่
            <Text style={{fontSize: normalize(18), color: colors.gray}}>
              {' '}
              (ไม่จำเป็นต้องระบุ)
            </Text>
          </Text>
          <ScrollView>
            <Text style={styles.head}>บ้านเลขที่</Text>
            <TextInput
              onChangeText={value => {
                dispatch({
                  type: 'Handle Input',
                  field: 'no',
                  payload: value,
                });
              }}
              value={formState.no}
              style={styles.input}
              editable={true}
              placeholder={'บ้านเลขที่'}
              placeholderTextColor={colors.disable}
            />
            <Text style={styles.head}>รายละเอียดที่อยู่</Text>
            <TextInput
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
              placeholderTextColor={colors.disable}
            />
            <Text style={styles.head}>จังหวัด</Text>
            <DropDownPicker
              listItemLabelStyle={{
                fontFamily: font.SarabunLight,
                fontSize: 18,
                padding: '2%',
                top: '3%',
              }}
              labelStyle={{
                fontSize: normalize(16),
                fontFamily: font.SarabunLight,
              }}
              modalTitle="จังหวัด"
              modalTitleStyle={{
                fontFamily: font.AnuphanBold,
                fontSize: 22,
              }}
              listMode="MODAL"
              modalProps={{animationType: 'slide'}}
              scrollViewProps={{
                nestedScrollEnabled: false,
                decelerationRate: 'fast',
              }}
              zIndex={3000}
              zIndexInverse={1000}
              style={styles.input}
              placeholder="จังหวัด"
              placeholderStyle={{
                color: colors.disable,
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(16),
              }}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              onSelectItem={value => {
                setProvince(value);
                dispatch({
                  type: 'Handle Input',
                  field: 'province',
                  payload: value,
                });
              }}
              setValue={setValue}
              dropDownDirection="BOTTOM"
              dropDownContainerStyle={{
                borderColor: colors.disable,
              }}
            />
            <Text style={styles.head}>อำเภอ</Text>
            <DropDownPicker
              listItemLabelStyle={{
                fontFamily: font.SarabunLight,
                fontSize: 18,
                padding: '2%',
                top: '3%',
              }}
              labelStyle={{
                fontSize: normalize(16),
                fontFamily: font.SarabunLight,
              }}
              modalTitle="อำเภอ"
              modalTitleStyle={{
                fontFamily: font.AnuphanMedium,
                fontSize: 22,
              }}
              listMode="MODAL"
              modalProps={{animationType: 'slide'}}
              scrollViewProps={{
                nestedScrollEnabled: false,
                decelerationRate: 'fast',
              }}
              zIndex={2000}
              zIndexInverse={2000}
              disabled={!province ? true : false}
              style={[
                styles.input,
                {backgroundColor: !province ? colors.disable : colors.white},
              ]}
              placeholder="อำเภอ"
              placeholderStyle={{
                color: !province ? colors.gray : colors.disable,
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(16),
              }}
              open={openDistrict}
              value={valueDistrict}
              items={itemsDistrict}
              setOpen={setOpenDistrict}
              onSelectItem={value => {
                setDistrict(value);
                dispatch({
                  type: 'Handle Input',
                  field: 'district',
                  payload: value,
                });
              }}
              setValue={setValueDistrict}
              dropDownDirection="BOTTOM"
              dropDownContainerStyle={{
                borderColor: colors.disable,
              }}
            />
            <Text style={styles.head}>ตำบล</Text>
            <DropDownPicker
              listItemLabelStyle={{
                fontFamily: font.SarabunLight,
                fontSize: 18,
                padding: '2%',
                top: '3%',
              }}
              labelStyle={{
                fontSize: normalize(16),
                fontFamily: font.SarabunLight,
              }}
              modalTitle="ตำบล"
              modalTitleStyle={{
                fontFamily: font.AnuphanMedium,
                fontSize: 22,
              }}
              listMode="MODAL"
              modalProps={{animationType: 'slide'}}
              scrollViewProps={{
                nestedScrollEnabled: false,
                decelerationRate: 'fast',
              }}
              zIndex={1000}
              zIndexInverse={3000}
              disabled={!district ? true : false}
              style={[
                styles.input,
                {backgroundColor: !district ? colors.disable : colors.white},
              ]}
              placeholder="ตำบล"
              placeholderStyle={{
                color: !district ? colors.gray : colors.disable,
                fontFamily: fonts.SarabunLight,
                fontSize: normalize(16),
              }}
              open={openSubDistrict}
              value={valueSubDistrict}
              items={itemsSubDistrict}
              setOpen={setOpenSubDistrict}
              onSelectItem={(value: any) => {
                setSubdistrict(value);
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
              }}
              setValue={setSubValueDistrict}
              dropDownDirection="BOTTOM"
              dropDownContainerStyle={{
                borderColor: colors.disable,
              }}
            />

            <Text style={styles.head}>รหัสไปรษณีย์</Text>
            <TextInput
              value={formState.postal}
              style={[
                styles.input,
                {
                  backgroundColor: colors.disable,
                  marginBottom: normalize(bottompadding),
                },
              ]}
              editable={false}
              placeholder={'รหัสไปรษณีย์'}
            />
          </ScrollView>
        </View>
        <View style={{backgroundColor: colors.white, zIndex: 0}}>
          <MainButton
            label="ถัดไป"
            color={colors.greenLight}
            onPress={() => {
              setLoading(true);
              Register.register2(
                telNo.tele,
                formState.no,
                formState.address,
                formState.province.value,
                formState.district.value,
                formState.subdistrict.value,
                formState.postal,
              )
                .then(async res => {
                  console.log(res);
                  if (Platform.OS === 'ios') {
                    await Geolocation.requestAuthorization('always');
                  } else if (Platform.OS === 'android') {
                    await PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    );
                  }
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
                      enableHighAccuracy: true,
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
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.head, {marginBottom: normalize(10)}]}>
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
                {items.map(
                  (
                    v: {label: any; value: any},
                    i: React.Key | null | undefined,
                  ) => (
                    <TouchableOpacity>
                      <LocationSelect
                        key={i}
                        label={v.label}
                        value={v.value}
                        onPress={() => selectProvince(v, i)}
                      />
                    </TouchableOpacity>
                  ),
                )}
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
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.head, {marginBottom: normalize(10)}]}>
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
                  (v: {label: any; value: any}, i: any | null | undefined) => (
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
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.head, {marginBottom: normalize(10)}]}>
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
                    v: {label: any; value: any; postcode: any},
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
    </SafeAreaView>
  );
};
export default SecondFormScreen;

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  head: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
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
  label: {
    fontFamily: font.AnuphanLight,
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
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontSize: normalize(16),
  },
});
