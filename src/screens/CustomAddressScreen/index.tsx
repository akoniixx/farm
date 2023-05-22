import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import {colors} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import AnimatedInput from '../../components/Input/AnimatedInput';
import Dropdown from '../../components/Dropdown/Dropdown';
import {QueryLocation} from '../../datasource/LocationDatasource';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomAddressScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const {data} = route.params;
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

  useEffect(() => {
    // const getAllKey = async () => {
    //   const keys = await AsyncStorage.getAllKeys();
    //   console.log(keys);
    // };

    // getAllKey();

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
                  ? postCode.find((item: any) => item.subdistrictId === v.value)
                      ?.postcode
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
      <View>
        <TouchableOpacity></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
