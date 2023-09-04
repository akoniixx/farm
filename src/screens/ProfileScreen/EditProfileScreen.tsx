import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../styles/StylesCentral';
import { colors, font, icons } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { MainButton } from '../../components/Button/MainButton';
import { normalize } from '../../functions/Normalize';
import { Avatar } from '@rneui/themed';
import { _monthName } from '../../definitions/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { momentExtend } from '../../utils/moment-buddha-year';
import { QueryLocation } from '../../datasource/LocationDatasource';
import ActionSheet from 'react-native-actions-sheet';
import {
  LocationInPostcodeSelect,
  LocationSelect,
} from '../../components/Location/Location';
import Text from '../../components/Text/Text';

const EditProfileScreen: React.FC<any> = ({ navigation, route }) => {
  const [initProfile, setInitProfile] = useState({
    firstname: '',
    lastname: '',
    birthDate: '',
    telephone: '',
    image: '',
    address1: '',
    address2: '',
    province: '',
    district: '',
    subdistrict: '',
    postal: '',
  });

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [value, setValue] = useState<any>([]);
  const [items, setItems] = useState<any>([]);
  const [itemsDistrict, setItemDistrict] = useState([]);
  const [itemsSubDistrict, setItemSubDistrict] = useState([]);
  const [province, setProvince] = useState<any>([]);
  const [district, setDistrict] = useState<any>([]);
  const [subdistrict, setSubdistrict] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [bottompadding, setBottomPadding] = useState(0);
  const provinceSheet = useRef<any>();
  const DistriSheet = useRef<any>();
  const SubDistriSheet = useRef<any>();
  const [address, setAddress] = useState<any>([]);
  const [addr, setAddr] = useState<any>([]);
  const [images, setImages] = useState<any>([]);
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    ProfileDatasource.getProfile(farmer_id!)
      .then(res => {
        const imgPath = res.file.filter((item: any) => {
          if (item.category === 'PROFILE_IMAGE') {
            return item;
          }
        });
        setValue(res);
        setAddress(res.address);
        if (imgPath.length === 0) {
          QueryLocation.QueryProfileSubDistrict(res.address.districtId).then(
            resSub => {
              const address = resSub.filter((item: any) => {
                if (item.subdistrictId === res.address.subdistrictId) {
                  return item;
                }
              });
              setAddr(address[0]);
            },
          );
          setImages('');
        } else {
          ProfileDatasource.getImgePathProfile(farmer_id!, imgPath[0].path)
            .then(resImg => {
              QueryLocation.QueryProfileSubDistrict(
                res.address.districtId,
              ).then(resSub => {
                const address = resSub.filter((item: any) => {
                  if (item.subdistrictId === res.address.subdistrictId) {
                    return item;
                  }
                });
                setAddr(address[0]);
              });
              setImages(resImg);
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    getProfile();
    QueryLocation.QueryProvince().then(res => {
      const Province = res.map((item: any) => {
        return { label: item.provinceName, value: item.provinceId };
      });
      setItems(Province);
    });
  }, []);

  useEffect(() => {
    if (province != null) {
      QueryLocation.QueryDistrict(province.value).then(res => {
        const District = res.map((item: any) => {
          return { label: item.districtName, value: item.districtId };
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

  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ข้อมูลส่วนตัว"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.inner}>
        <View style={styles.container}>
          <ScrollView>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: normalize(116),
                  height: normalize(116),
                  position: 'relative',
                }}>
                <Avatar
                  size={normalize(109)}
                  source={
                    images.url === undefined
                      ? icons.avatar
                      : { uri: images.url }
                  }
                  avatarStyle={{
                    borderRadius: normalize(60),
                    borderColor: colors.greenLight,
                    borderWidth: 1,
                  }}
                />
                <View
                  style={{
                    borderWidth: 0.3,
                    position: 'absolute',
                    left: normalize(70.7),
                    top: normalize(70.7),
                    width: normalize(32),
                    height: normalize(32),
                    borderRadius: normalize(16),
                    backgroundColor: colors.white,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.camera}
                    style={{
                      width: normalize(20),
                      height: normalize(20),
                    }}
                  />
                </View>
              </View>
            </View>
            <Text style={styles.head}>ชื่อ*</Text>
            <TextInput
              allowFontScaling={false}
              value={value.firstname}
              style={[styles.input, { backgroundColor: colors.greyDivider }]}
              editable={false}
              placeholder={'ระบุชื่อ'}
              placeholderTextColor={colors.disable}
            />
            <Text style={styles.head}>นามสกุล*</Text>
            <TextInput
              allowFontScaling={false}
              value={value.lastname}
              style={[styles.input, { backgroundColor: colors.greyDivider }]}
              editable={false}
              placeholder={'นามสกุล'}
              placeholderTextColor={colors.disable}
            />
            <Text style={styles.head}>วันเกิด</Text>
            <View
              style={[
                styles.input,
                {
                  alignItems: 'center',
                  flexDirection: 'row',
                  backgroundColor: colors.greyDivider,
                },
              ]}>
              <TextInput
                value={momentExtend.toBuddhistYear(
                  value.birthDate,
                  'DD MMMM YYYY',
                )}
                allowFontScaling={false}
                editable={false}
                placeholder={'ระบุวัน เดือน ปี'}
                placeholderTextColor={colors.disable}
                style={{
                  width: windowWidth * 0.78,
                  color: colors.fontBlack,
                  fontSize: normalize(16),
                  fontFamily: font.SarabunLight,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
              <Image
                source={icons.calendar}
                style={{
                  width: normalize(25),
                  height: normalize(30),
                }}
              />
            </View>
            <Text style={styles.head}>เบอร์โทรศัพท์</Text>
            <TextInput
              allowFontScaling={false}
              style={[styles.input, { backgroundColor: colors.greyDivider }]}
              editable={false}
              value={value.telephoneNo}
            />
            <Text style={styles.headAdd}>ที่อยู่ของคุณ</Text>
            <Text style={styles.head}>บ้านเลขที่</Text>
            <TextInput
              allowFontScaling={false}
              value={address.address1}
              style={[styles.input, { backgroundColor: colors.greyDivider }]}
              editable={false}
              placeholder={'-'}
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.head}>รายละเอียดที่อยู่</Text>
            <TextInput
              allowFontScaling={false}
              value={address.address2}
              style={[styles.input, { backgroundColor: colors.greyDivider }]}
              editable={false}
              placeholder={'-'}
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.head}>จังหวัด</Text>
            <TextInput
              allowFontScaling={false}
              value={addr.provinceName}
              style={[styles.input, { backgroundColor: colors.greyDivider }]}
              editable={false}
              placeholder={'-'}
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.head}>อำเภอ</Text>
            <TextInput
              allowFontScaling={false}
              value={addr.districtName}
              style={[styles.input, { backgroundColor: colors.greyDivider }]}
              editable={false}
              placeholder={'-'}
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.head}>ตำบล</Text>
            <TextInput
              allowFontScaling={false}
              value={addr.subdistrictName}
              style={[styles.input, { backgroundColor: colors.greyDivider }]}
              editable={false}
              placeholder={'-'}
              placeholderTextColor={colors.gray}
            />
            <Text style={styles.head}>รหัสไปรษณีย์</Text>
            <TextInput
              allowFontScaling={false}
              value={address.postcode}
              style={[styles.input, { backgroundColor: colors.greyDivider }]}
              editable={false}
              placeholder={'-'}
              placeholderTextColor={colors.gray}
            />
          </ScrollView>
        </View>
        <View style={{ backgroundColor: colors.white, zIndex: 0 }}>
          <MainButton label="บันทึก" color={colors.greenLight} disable />
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
                {items.map(
                  (
                    v: { label: any; value: any },
                    i: React.Key | null | undefined,
                  ) => (
                    <TouchableOpacity>
                      <LocationSelect
                        key={i}
                        label={v.label}
                        value={v.value}
                        // onPress={() => selectProvince(v, i)}
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
                        // onPress={() => selectDistrict(v, i)}
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
                        // onPress={() => selectSubDistrict(v, i)}
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
export default EditProfileScreen;

const styles = StyleSheet.create({
  headAdd: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
    color: colors.greenLight,
    paddingVertical: normalize(20),
  },
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
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  head: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(16),
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
    padding: 5,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontSize: normalize(16),
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
});
