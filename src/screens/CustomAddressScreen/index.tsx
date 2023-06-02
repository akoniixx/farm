import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {colors, font} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import AnimatedInput from '../../components/Input/AnimatedInput';
import Dropdown from '../../components/Dropdown/Dropdown';
import {QueryLocation} from '../../datasource/LocationDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import Spinner from 'react-native-loading-spinner-overlay/lib';

export default function CustomAddressScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const {data, isEdit = false, initialValue = {}} = route.params;
  const [objInput, setObjInput] = React.useState({
    addressNo: '',
    detail: '',
    province: {
      label: '',
      value: '',
    },
    district: {
      label: '',
      value: '',
    },
    subDistrict: {
      label: '',
      value: '',
    },
    postCode: '',
  });
  const [provinces, setProvinces] = React.useState([]);
  const [districts, setDistricts] = React.useState([]);
  const [subDistricts, setSubDistricts] = React.useState([]);
  const [postCode, setPostCode] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const onConfirm = async () => {
    try {
      setLoading(true);
      const dronerId = await AsyncStorage.getItem('droner_id');
      const payload = {
        dronerId: dronerId || '',
        address1: objInput.addressNo,
        address2: objInput.detail,
        provinceId: objInput.province.value,
        districtId: objInput.district.value,
        subdistrictId: objInput.subDistrict.value,
        postcode: objInput.postCode,
      };
      if (!isEdit) {
        await ProfileDatasource.postAddressList(payload);
      } else {
        await ProfileDatasource.editAddressList({
          ...payload,
          addressId: initialValue.id,
        });
      }
      setLoading(false);
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const getInitialValue = async () => {
      try {
        if (isEdit) {
          setObjInput({
            addressNo: initialValue.address1,
            detail: initialValue.address2,
            province: {
              label: initialValue.province.provinceName,
              value: initialValue.province.provinceId,
            },
            district: {
              label: initialValue.district.districtName,
              value: initialValue.district.districtId,
            },
            subDistrict: {
              label: initialValue.subdistrict.subdistrictName,
              value: initialValue.subdistrict.subdistrictId,
            },
            postCode: initialValue.postcode,
          });
        }
      } catch (e) {
        console.log(e);
      }
    };
    getInitialValue();

    QueryLocation.QueryProvince()
      .then(res => {
        const Province = (res || []).map((item: any) => {
          return {label: item.provinceName, value: item.provinceId};
        });
        setProvinces(Province);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (objInput.province.value) {
      QueryLocation.QueryDistrict(+objInput.province.value)
        .then(res => {
          const District = (res || []).map((item: any) => {
            return {label: item.districtName, value: item.districtId};
          });
          setDistricts(District);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [objInput.province.value]);
  const validate = useMemo(() => {
    return (
      objInput.addressNo.trim() !== '' &&
      objInput.detail.trim() !== '' &&
      objInput.province.value !== '' &&
      objInput.district.value !== '' &&
      objInput.subDistrict.value !== '' &&
      objInput.postCode !== ''
    );
  }, [objInput]);
  useEffect(() => {
    if (objInput.district.value) {
      QueryLocation.QuerySubDistrict(+objInput.district.value)
        .then(res => {
          const SubDistrict = (res || []).map((item: any) => {
            return {label: item.subdistrictName, value: item.subdistrictId};
          });
          setSubDistricts(SubDistrict);
          setPostCode(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [objInput.district.value]);
  const onChangeText = (key: string, value: string) => {
    setObjInput({...objInput, [key]: value});
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <CustomHeader
        showBackBtn
        onPressBack={() => {
          navigation.goBack();
        }}
        title="สรุปรายละเอียดการแลก"
      />
      <ScrollView>
        <View style={styles.container}>
          <AnimatedInput
            label="บ้านเลขที่"
            value={objInput.addressNo}
            onChangeText={(value: string) => onChangeText('addressNo', value)}
          />
          <AnimatedInput
            label="รายละเอียดที่อยู่ (หมู่, ถนน)"
            value={objInput.detail}
            onChangeText={(value: string) => onChangeText('detail', value)}
          />
          <Dropdown
            placeholder="จังหวัด"
            items={provinces}
            value={objInput.province.value}
            onChange={(v: {label: string; value: string}) => {
              setObjInput({
                ...objInput,
                province: {
                  label: v.label,
                  value: v.value,
                },
                district: {
                  label: '',
                  value: '',
                },
                subDistrict: {
                  label: '',
                  value: '',
                },
                postCode: '',
              });
            }}
          />
          <View
            style={{
              zIndex: -10,
            }}>
            <Dropdown
              placeholder="อำเภอ"
              items={districts}
              value={objInput.district.value}
              onChange={(v: {label: string; value: string}) => {
                setObjInput({
                  ...objInput,
                  district: {
                    label: v.label,
                    value: v.value,
                  },
                  subDistrict: {
                    label: '',
                    value: '',
                  },
                  postCode: '',
                });
              }}
            />
          </View>
          <View
            style={{
              zIndex: -20,
            }}>
            <Dropdown
              placeholder="ตำบล"
              items={subDistricts}
              value={objInput.subDistrict.value}
              onChange={(v: {label: string; value: string}) => {
                setObjInput({
                  ...objInput,

                  subDistrict: {
                    label: v.label,
                    value: v.value,
                  },
                  postCode: v.value
                    ? postCode.find(
                        (item: any) => item.subdistrictId === v.value,
                      )?.postcode
                    : '',
                });
              }}
            />
          </View>
          <View
            style={{
              zIndex: -30,
            }}>
            <AnimatedInput
              editable={false}
              label="รหัสไปรษณีย์"
              value={objInput.postCode}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={validate ? styles.button : styles.disabledButton}
          onPress={onConfirm}
          disabled={validate ? false : true}>
          <Text style={styles.textButton}>บันทึก</Text>
        </TouchableOpacity>
      </View>
      <Spinner
        visible={loading}
        textContent="Loading..."
        textStyle={{color: '#FFF'}}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  footer: {
    height: 100,
    backgroundColor: colors.white,

    flexDirection: 'row',
    padding: 16,
    elevation: 8,
    shadowColor: '#242D35',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  textButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.white,
  },
  disabledButton: {
    width: '100%',
    backgroundColor: colors.disable,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DCDFE3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  button: {
    width: '100%',
    backgroundColor: colors.orange,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F86820',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
});
