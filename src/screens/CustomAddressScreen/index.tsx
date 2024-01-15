import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { colors, font } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { QueryLocation } from '../../datasource/LocationDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { mixpanel } from '../../../mixpanel';
import InputTextLabel from '../../components/InputText/InputTextLabel';
import Text from '../../components/Text/Text';
import InputSelectSheet from '../../components/InputText/InputSelectSheet';

type StateAddress = {
  label: string;
  value: string;
};
export default function CustomAddressScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const {
    isEdit = false,
    initialValue = {},
    isAddMainAddress = false,
  } = route.params;
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
  const [provinces, setProvinces] = React.useState<StateAddress[]>([]);
  const [districts, setDistricts] = React.useState<StateAddress[]>([]);
  const [subDistricts, setSubDistricts] = React.useState([]);
  const [postCode, setPostCode] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const onConfirm = async () => {
    try {
      setLoading(true);
      const farmerId = await AsyncStorage.getItem('farmer_id');
      const payload = {
        farmerId: farmerId || '',
        address1: objInput.addressNo,
        address2: objInput.detail,
        provinceId: objInput.province.value,
        districtId: objInput.district.value,
        subdistrictId: objInput.subDistrict.value,
        postcode: objInput.postCode,
      };
      if (isAddMainAddress) {
        await ProfileDatasource.postMainAddressList(payload);
        setLoading(false);
        setTimeout(() => {
          navigation.goBack();
        }, 300);
        return;
      }

      if (!isEdit) {
        await ProfileDatasource.postOtherAddressList(payload);
      } else {
        await ProfileDatasource.updateOtherAddressList({
          ...payload,
          addressId: initialValue.id,
        });
      }
      setLoading(false);
      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  useEffect(() => {
    const getInitialValue = async () => {
      try {
        if (initialValue) {
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
        const Province = (res || [])
          .map((item: any) => {
            return { label: item.provinceName, value: item.provinceId };
          })
          .sort((a: any, b: any) => a.label.localeCompare(b.label));
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
          const District = (res || [])
            .map((item: any) => {
              return { label: item.districtName, value: item.districtId };
            })
            .sort((a: any, b: any) => a.label.localeCompare(b.label));
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
          const SubDistrict = (res || [])
            .map((item: any) => {
              return { label: item.subdistrictName, value: item.subdistrictId };
            })
            .sort((a: any, b: any) => a.label.localeCompare(b.label));
          setSubDistricts(SubDistrict);
          setPostCode(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [objInput.district.value]);
  const onChangeText = (key: string, value: string) => {
    setObjInput({ ...objInput, [key]: value });
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <CustomHeader
        showBackBtn
        onPressBack={() => {
          navigation.goBack();
        }}
        title="เพิ่มที่อยู่"
      />
      <ScrollView>
        <View style={styles.container}>
          <InputTextLabel
            label="บ้านเลขที่"
            placeholder="ระบุบ้านเลขที่"
            onBlur={() => {
              mixpanel.track('CustomAddressScreen_AddressNo_Input', {
                addressNo: objInput.addressNo,
              });
            }}
            required
            value={objInput.addressNo}
            onChangeText={(value: string) => onChangeText('addressNo', value)}
          />
          <InputTextLabel
            required
            label="รายละเอียดที่อยู่"
            onBlur={() => {
              mixpanel.track('CustomAddressScreen_Detail_Input', {
                detail: objInput.detail,
              });
            }}
            placeholder="ระบุรายละเอียด"
            value={objInput.detail}
            onChangeText={(value: string) => onChangeText('detail', value)}
          />

          <InputSelectSheet
            required
            label="จังหวัด"
            placeholder="เลือกจังหวัด"
            value={objInput.province}
            listData={provinces}
            sheetId="selectAddress"
            titleSheet="จังหวัด"
            onChange={(value: any) => {
              setObjInput(prev => {
                return {
                  ...prev,
                  province: value,
                  district: {
                    label: '',
                    value: '',
                  },
                  subDistrict: {
                    label: '',
                    value: '',
                  },
                  postCode: '',
                };
              });
            }}
          />
          <InputSelectSheet
            required
            label="อำเภอ"
            placeholder="เลือกอำเภอ"
            value={objInput.district}
            listData={districts}
            sheetId="selectAddress"
            titleSheet="อำเภอ"
            onChange={(value: any) => {
              setObjInput(prev => {
                return {
                  ...prev,

                  district: {
                    label: value.label,
                    value: value.value,
                  },
                  subDistrict: {
                    label: '',
                    value: '',
                  },
                  postCode: '',
                };
              });
            }}
          />
          <InputSelectSheet
            required
            label="ตำบล"
            placeholder="เลือกตำบล"
            value={objInput.subDistrict}
            listData={subDistricts}
            sheetId="selectAddress"
            titleSheet="ตำบล"
            onChange={(value: any) => {
              const findPostCode = value.value
                ? postCode.find(
                    (item: any) => item.subdistrictId === value.value,
                  )?.postcode
                : '';
              setObjInput({
                ...objInput,
                subDistrict: {
                  label: value.label,
                  value: value.value,
                },
                postCode: findPostCode,
              });
              setPostCode(findPostCode);
            }}
          />

          <InputTextLabel
            style={{
              backgroundColor: colors.grey5,
              borderColor: colors.grey5,
            }}
            placeholder="รหัสไปรษณีย์"
            editable={false}
            label="รหัสไปรษณีย์"
            value={objInput.postCode}
            required
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={validate ? styles.button : styles.disabledButton}
          onPress={onConfirm}
          disabled={validate ? false : true}>
          <Text
            style={[
              styles.textButton,
              {
                color: validate ? colors.white : colors.grey20,
              },
            ]}>
            บันทึก
          </Text>
        </TouchableOpacity>
      </View>
      <Spinner
        visible={loading}
        textContent="Loading..."
        textStyle={{ color: '#FFF' }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  footer: {
    height: 80,
    backgroundColor: colors.white,

    flexDirection: 'row',
    padding: 16,
  },
  textButton: {
    fontSize: 18,
    fontFamily: font.AnuphanSemiBold,
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
    backgroundColor: colors.greenLight,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.greenLight,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
});
