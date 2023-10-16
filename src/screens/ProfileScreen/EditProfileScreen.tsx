import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stylesCentral } from '../../styles/StylesCentral';
import { colors, font, icons } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { MainButton } from '../../components/Button/MainButton';
import { normalize } from '../../functions/Normalize';
import { Avatar } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { momentExtend } from '../../utils/moment-buddha-year';
import { QueryLocation } from '../../datasource/LocationDatasource';
import ActionSheet from 'react-native-actions-sheet';
import { LocationSelect } from '../../components/Location/Location';
import Text from '../../components/Text/Text';
import ImagePicker from 'react-native-image-crop-picker';
import ModalUploadImage from '../../components/Modal/ModalUploadImage';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import { mixValidator } from '../../utils/inputValidate';

interface AddressFarmerType {
  id: string;
  address1: string;
  address2: string;
  address3: string;
  provinceId: number;
  districtId: number;
  subdistrictId: number;
  postcode: string;
}
interface AddressType {
  districtId: number;
  districtName: string;
  postcode: string;
  provinceId: number;
  provinceName: string;
  subdistrictId: number;
  subdistrictName: string;
}
interface TypeFile {
  category: string;
  fileName: string;
  id: string;
  path: string;
  resource: string;
}
interface ProfileType {
  firstname: string;
  lastname: string;
  nickname: string;
  birthDate: string;
  telephoneNo: string;
}

const EditProfileScreen: React.FC<any> = ({ navigation, route }) => {
  // const [initProfile, setInitProfile] = useState({
  //   firstname: '',
  //   lastname: '',
  //   birthDate: '',
  //   telephone: '',
  //   image: '',
  //   address1: '',
  //   address2: '',
  //   province: '',
  //   district: '',
  //   subdistrict: '',
  //   postal: '',
  // });

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [value, setValue] = useState<ProfileType>({
    firstname: '',
    lastname: '',
    nickname: '',
    birthDate: '',
  } as ProfileType);
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [alreadyHasImage, setAlreadyHasImage] = useState<TypeFile | undefined>(
    undefined,
  );
  const [itemsDistrict, setItemDistrict] = useState([]);
  const [itemsSubDistrict, setItemSubDistrict] = useState([]);
  const [addressSelect, setAddressSelect] = useState<AddressType>(
    {} as AddressType,
  );
  const provinceSheet = useRef<any>();
  const districtSheet = useRef<any>();
  const SubdistrictSheet = useRef<any>();
  const [address, setAddress] = useState<AddressFarmerType>(
    {} as AddressFarmerType,
  );
  const [image, setImage] = useState<any>(null);

  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const farmer_id = await AsyncStorage.getItem('farmer_id');
    ProfileDatasource.getProfile(farmer_id!)
      .then(async res => {
        const imgPath = res.file.find((item: any) => {
          if (item.category === 'PROFILE_IMAGE') {
            return item;
          }
        });

        setValue(res);

        setAddress(res?.address);
        setAlreadyHasImage(imgPath);
        if (imgPath === undefined) {
          if (!res?.address?.subdistrictId) {
            return setImage(null);
          }
          const resSub = await QueryLocation.QueryProfileSubDistrict(
            res.address.districtId,
          );
          const address = resSub.filter((item: any) => {
            if (item.subdistrictId === res.address.subdistrictId) {
              return item;
            }
          });
          setAddressSelect(address[0]);
          setImage(null);
        } else {
          try {
            const resImg = await ProfileDatasource.getImgePathProfile(
              farmer_id!,
              imgPath.path,
            );
            if (res?.address?.subdistrictId) {
              const resSub = await QueryLocation.QueryProfileSubDistrict(
                res.address.districtId,
              );
              const address = resSub.filter((item: any) => {
                if (item.subdistrictId === res?.address?.subdistrictId) {
                  return item;
                }
              });
              // setAddr(address[0]);
              setAddressSelect(address[0]);
            }
            setImage(resImg);
          } catch (err) {
            console.log(err);
          }
        }
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    getProfile();
    QueryLocation.QueryProvince().then(res => {
      const Province = (res || []).map((item: any) => {
        return { label: item.provinceName, value: item.provinceId };
      });
      const sortedProvince = Province.sort((a: any, b: any) => {
        return a.label.localeCompare(b.label);
      });
      setItems(sortedProvince);
    });
  }, []);

  const onAddImage = useCallback(async () => {
    const result = await ImagePicker.openPicker({
      mediaType: 'photo',
      width: 200,
      height: 200,
      maxFiles: 1,
      multiple: false,
      cropping: false,
    });
    if (result) {
      setImage({
        ...result,
        assets: [
          {
            fileSize: result.size,
            type: result.mime,
            fileName: result?.filename,
            uri: result.path,
          },
        ],
      });
      setOpenModal(false);
    }
  }, []);
  const onPressCamera = useCallback(async () => {
    const result = await ImagePicker.openCamera({
      mediaType: 'photo',
      maxWidth: 200,
      maxHeight: 200,
      cropping: false,
    });
    if (result) {
      setImage({
        ...result,
        assets: [
          {
            fileSize: result.size,
            type: result.mime,
            fileName: result?.filename,
            uri: result.path,
          },
        ],
      });
      setOpenModal(false);
    }
  }, []);
  const onFinishedTakePhotoAndroid = useCallback(async (value: any) => {
    if (value) {
      setImage(value);
      setOpenModal(false);
    }
  }, []);

  useEffect(() => {
    if (addressSelect.provinceId) {
      QueryLocation.QueryDistrict(addressSelect.provinceId).then(res => {
        const District = res.map((item: any) => {
          return { label: item.districtName, value: item.districtId };
        });
        setItemDistrict(District);
      });
    }
  }, [addressSelect.provinceId]);

  useEffect(() => {
    if (addressSelect.provinceId && addressSelect.districtId) {
      QueryLocation.QuerySubDistrict(
        addressSelect.districtId,
        addressSelect.districtName,
      ).then(res => {
        const SubDistrict = res.map((item: any) => {
          return {
            label: item.subdistrictName,
            value: item.subdistrictId,
            postcode: item.postcode,
          };
        });
        setItemSubDistrict(SubDistrict);
      });
    }
  }, [
    addressSelect.provinceId,
    addressSelect.districtId,
    addressSelect.districtName,
  ]);
  const { canSave } = useMemo(() => {
    const canSave =
      addressSelect.provinceId &&
      addressSelect.districtId &&
      addressSelect.subdistrictId &&
      address.address1 &&
      address.address2 &&
      value.nickname;

    return {
      canSave,
    };
  }, [
    addressSelect.provinceId,
    addressSelect.districtId,
    addressSelect.subdistrictId,
    address.address1,
    address.address2,
    value.nickname,
  ]);
  const onPressSave = async () => {
    try {
      setLoading(true);
      await ProfileDatasource.updateFarmerProfile({
        nickname: value.nickname,
        address: {
          address1: address.address1,
          address2: address.address2,
          districtId: addressSelect.districtId,
          postcode: addressSelect.postcode,
          provinceId: addressSelect.provinceId,
          subdistrictId: addressSelect.subdistrictId,
        },
      });

      if (image?.assets && image.assets.length > 0) {
        if (alreadyHasImage) {
          await ProfileDatasource.removeProfileImage({
            id: alreadyHasImage.id,
            path: alreadyHasImage.path,
          });
          await ProfileDatasource.uploadProfileImage(image);
          setLoading(false);
          navigation.goBack();
          return;
        }
        await ProfileDatasource.uploadProfileImage(image);
        setLoading(false);
        navigation.goBack();
        return;
      } else {
        setLoading(false);
        navigation.goBack();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title="ข้อมูลส่วนตัว"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <View
          style={{
            flex: 1,
            paddingHorizontal: normalize(16),
          }}>
          <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <>
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
                    <ProgressiveImage
                      borderRadius={60}
                      source={
                        image?.assets
                          ? {
                              uri: image?.assets[0].uri,
                            }
                          : image?.url
                          ? { uri: image.url }
                          : icons.avatar
                      }
                      style={{
                        borderRadius: normalize(60),
                        borderColor: colors.greenLight,
                        borderWidth: 1,
                        width: normalize(109),
                        height: normalize(109),
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => setOpenModal(true)}
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
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.head}>ชื่อ</Text>
                <TextInput
                  allowFontScaling={false}
                  value={value.firstname}
                  style={[
                    styles.input,
                    { backgroundColor: colors.greyDivider },
                  ]}
                  editable={false}
                  placeholder={'ระบุชื่อ'}
                  placeholderTextColor={colors.disable}
                />
                <Text style={styles.head}>นามสกุล</Text>
                <TextInput
                  allowFontScaling={false}
                  value={value.lastname}
                  style={[
                    styles.input,
                    { backgroundColor: colors.greyDivider, marginBottom: 16 },
                  ]}
                  editable={false}
                  placeholder={'นามสกุล'}
                  placeholderTextColor={colors.disable}
                />
                <Text style={styles.head}>ชื่อเล่น</Text>
                <TextInput
                  allowFontScaling={false}
                  value={value.nickname}
                  style={[styles.inputEdit]}
                  placeholder={'ชื่อเล่น'}
                  onChangeText={v => {
                    const newValue = mixValidator(v);
                    setValue(prev => ({ ...prev, nickname: newValue }));
                  }}
                  placeholderTextColor={colors.disable}
                />
                <Text style={styles.head}>วันเดือนปีเกิด</Text>
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
                    value={
                      value.birthDate
                        ? momentExtend.toBuddhistYear(
                            value.birthDate,
                            'DD MMMM YYYY',
                          )
                        : ''
                    }
                    allowFontScaling={false}
                    editable={false}
                    placeholder={'ระบุวัน เดือน ปี'}
                    placeholderTextColor={colors.disable}
                    style={{
                      width: windowWidth * 0.78,
                      color: colors.grey50,
                      fontSize: normalize(20),
                      fontFamily: font.SarabunMedium,
                      justifyContent: 'center',
                      alignItems: 'center',
                      lineHeight: 28,
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
                  style={[
                    styles.input,
                    { backgroundColor: colors.greyDivider },
                  ]}
                  editable={false}
                  value={value.telephoneNo}
                />
              </>

              <Text style={styles.headAdd}>ที่อยู่ของคุณ</Text>
              <Text style={styles.head}>บ้านเลขที่</Text>
              <TextInput
                allowFontScaling={false}
                value={address?.address1}
                style={[styles.inputEdit, { backgroundColor: colors.white }]}
                placeholder={'-'}
                placeholderTextColor={colors.gray}
                onChangeText={text => {
                  setAddress({ ...address, address1: text });
                }}
                scrollEnabled={false}
              />
              <Text style={styles.head}>รายละเอียดที่อยู่</Text>
              <TextInput
                allowFontScaling={false}
                value={address?.address2}
                style={[styles.inputEdit, { backgroundColor: colors.white }]}
                placeholder={'-'}
                placeholderTextColor={colors.gray}
                onChangeText={text => {
                  setAddress({ ...address, address2: text });
                }}
              />
              <Text style={styles.head}>จังหวัด</Text>
              <TouchableOpacity
                style={styles.inputEditSelect}
                onPress={() => {
                  provinceSheet.current.show();
                }}>
                {addressSelect.provinceName ? (
                  <Text
                    style={{
                      fontFamily: font.SarabunMedium,
                      fontSize: normalize(20),
                      color: colors.grey50,
                    }}>
                    {addressSelect.provinceName}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: font.SarabunMedium,
                      fontSize: normalize(20),
                      color: colors.grey10,
                    }}>
                    เลือกจังหวัด
                  </Text>
                )}
              </TouchableOpacity>
              <Text style={styles.head}>อำเภอ</Text>
              <TouchableOpacity
                style={styles.inputEditSelect}
                onPress={() => {
                  districtSheet.current.show();
                }}>
                {addressSelect.districtName ? (
                  <Text
                    style={{
                      fontFamily: font.SarabunMedium,
                      fontSize: normalize(20),
                      color: colors.grey50,
                    }}>
                    {addressSelect.districtName
                      ? addressSelect.districtName
                      : 'เลือกอำเภอ'}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: font.SarabunMedium,
                      fontSize: normalize(20),
                      color: colors.grey10,
                    }}>
                    เลือกอำเภอ
                  </Text>
                )}
              </TouchableOpacity>
              <Text style={styles.head}>ตำบล</Text>
              <TouchableOpacity
                style={styles.inputEditSelect}
                onPress={() => {
                  SubdistrictSheet.current.show();
                }}>
                {addressSelect.subdistrictName ? (
                  <Text
                    style={{
                      fontFamily: font.SarabunMedium,
                      fontSize: normalize(20),
                      color: colors.grey50,
                      lineHeight: normalize(32),
                    }}>
                    {addressSelect.subdistrictName}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: font.SarabunMedium,
                      fontSize: normalize(20),
                      color: colors.grey10,
                      lineHeight: normalize(32),
                    }}>
                    เลือกตำบล
                  </Text>
                )}
              </TouchableOpacity>

              <Text style={styles.head}>รหัสไปรษณีย์</Text>
              <TextInput
                allowFontScaling={false}
                value={addressSelect.postcode}
                style={[styles.inputEdit]}
                editable={false}
                placeholder={'รหัสไปรษณีย์'}
                placeholderTextColor={colors.gray}
              />
            </ScrollView>
          </View>
          <View
            style={{
              backgroundColor: colors.white,
              zIndex: 0,
              paddingVertical: normalize(20),
            }}>
            <MainButton
              label="บันทึก"
              color={colors.greenLight}
              disable={!canSave || loading}
              onPress={onPressSave}
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
                    fontSize: normalize(18),
                  }}
                  onPress={() => {
                    provinceSheet.current.hide();
                  }}>
                  ยกเลิก
                </Text>
              </View>
              <View style={styles.container}>
                <ScrollView>
                  {items.map((v: { label: any; value: any }, i: number) => (
                    <LocationSelect
                      key={i}
                      item={v}
                      label={v.label}
                      value={v.value}
                      onPress={v => {
                        setAddressSelect(prev => ({
                          ...prev,
                          districtId: 0,
                          districtName: '',
                          subdistrictId: 0,
                          subdistrictName: '',
                          postcode: '',
                          provinceId: v.value,
                          provinceName: v.label,
                        }));
                        provinceSheet.current.hide();
                      }}
                    />
                  ))}
                </ScrollView>
              </View>
            </View>
          </ActionSheet>
          <ActionSheet ref={districtSheet}>
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
                    districtSheet.current.hide();
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
                          item={v}
                          key={i}
                          label={v.label}
                          value={v.value}
                          onPress={() => {
                            setAddressSelect(prev => ({
                              ...prev,
                              districtId: v.value,
                              districtName: v.label,
                              subdistrictId: 0,
                              subdistrictName: '',
                              postcode: '',
                            }));
                            districtSheet.current.hide();
                          }}
                        />
                      </TouchableOpacity>
                    ),
                  )}
                </ScrollView>
              </View>
            </View>
          </ActionSheet>
          <ActionSheet ref={SubdistrictSheet}>
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
                    SubdistrictSheet.current.hide();
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
                        <LocationSelect
                          item={v}
                          key={i}
                          label={v.label}
                          value={v.value}
                          onPress={() => {
                            setAddressSelect(prev => ({
                              ...prev,
                              subdistrictId: v.value,
                              subdistrictName: v.label,
                              postcode: v.postcode,
                            }));
                            SubdistrictSheet.current.hide();
                          }}
                        />
                      </TouchableOpacity>
                    ),
                  )}
                </ScrollView>
              </View>
            </View>
          </ActionSheet>
        </View>
        <ModalUploadImage
          onCancel={() => setOpenModal(false)}
          onCloseModalSelect={() => setOpenModal(false)}
          visible={openModal}
          onPressCamera={onPressCamera}
          onFinishedTakePhotoAndroid={onFinishedTakePhotoAndroid}
          onPressLibrary={onAddImage}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default EditProfileScreen;

const styles = StyleSheet.create({
  headAdd: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(22),
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
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(20),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },
  input: {
    fontFamily: font.SarabunMedium,
    height: normalize(56),
    marginVertical: 12,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderColor: colors.grey5,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.grey50,
    fontSize: normalize(20),
  },
  inputEdit: {
    fontFamily: font.SarabunMedium,
    height: normalize(56),
    marginVertical: 12,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderColor: '#B0B8BF',
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.grey50,
    fontSize: normalize(20),
  },
  inputEditSelect: {
    fontFamily: font.SarabunMedium,
    height: normalize(56),
    marginVertical: 12,
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderColor: '#B0B8BF',
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.grey50,
    fontSize: normalize(20),
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
