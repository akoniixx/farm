import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import React, {useEffect, useReducer, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, image} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {ProgressBar} from '../../components/ProgressBar';
import {Avatar} from '@rneui/themed';
import DropDownPicker from 'react-native-dropdown-picker';
import { QueryLocation } from '../../datasource/Location';
import { initialFormRegisterState, registerReducer } from '../../hooks/registerfield';
import { Register } from '../../datasource/TaskDatasource';

const SecondFormScreen: React.FC<any> = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [valueDistrict, setValueDistrict] = useState(null);
  const [itemsDistrict,setItemDistrict] = useState([])
  const [openSubDistrict, setOpenSubDistrict] = useState(false);
  const [valueSubDistrict, setSubValueDistrict] = useState(null);
  const [itemsSubDistrict,setItemSubDistrict] = useState([])
  const [province,setProvince] = useState<any>(null)
  const [district,setDistrict] = useState<any>(null)

  const [subdistrict,setSubdistrict] = useState<any>(null)

  useEffect(()=>{
    QueryLocation.QueryProvince().then(res => {
      const Province = res.map((item : any) => {
        return {label : item.provinceName, value : item.provinceId}
      })
      setItems(Province)
    })
  },[])

  useEffect(()=>{
    if(province != null){
      QueryLocation.QueryDistrict(province.value).then(res => {
        const District = res.map((item : any) => {
          return {label : item.districtName, value : item.districtId}
        })
        setItemDistrict(District)
      })
    }
  },[province])

  useEffect(()=>{
    if(province != null && district != null){
      QueryLocation.QuerySubDistrict(district.value,district.label).then(res =>{
        const SubDistrict = res.map((item : any) => {
          return {label : item.subdistrictName,value : item.subdistrictId, postcode : item.postcode}
        })
        setItemSubDistrict(SubDistrict)
      })
    }
  },[province,district])

  const [formState,dispatch] = useReducer(registerReducer,initialFormRegisterState);
  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลงทะเบียนนักบินโดรน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />

      <View style={styles.inner}>
        <View style={styles.container}>
          <View style={{marginBottom: normalize(10)}}>
            <ProgressBar index={2} />
          </View>
          <Text style={styles.label}>ขั้นตอนที่ 2 จาก 4</Text>
          <Text style={styles.h1}>กรอกข้อมูลทั่วไป</Text>
          <ScrollView>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: normalize(40),
              }}>
              <TouchableOpacity>
                <Avatar size={100} rounded source={image.idcard} />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: normalize(40)}}>
              <Text style={styles.h1}>ข้อมูลทั่วไป (โปรดระบุ)</Text>
            </View>
            <TextInput
              onChangeText={(value)=>{
                dispatch({
                  type : "Handle Input",
                  field : "name",
                  payload : value
                })
              }}
              value={formState.name}
              style={styles.input}
              editable={true}
              placeholder={'ชื่อ'}
            />
            <TextInput
              onChangeText={(value)=>{
                dispatch({
                  type : "Handle Input",
                  field : "surname",
                  payload : value
                })
              }}
              value={formState.surname}
              style={styles.input}
              editable={true}
              placeholder={'นามสกุล'}
            />
            <TextInput
              onChangeText={(value)=>{
                dispatch({
                  type : "Handle Input",
                  field : "tel",
                  payload : value
                })
              }}
              value={formState.tel}
              style={styles.input}
              editable={true}
              placeholder={'เบอร์โทรศัพท์'}
            />
            <View style={{marginTop: normalize(40)}}>
              <Text style={styles.h1}>ที่อยู่</Text>
            </View>
            <TextInput
              onChangeText={(value)=>{
                dispatch({
                  type : "Handle Input",
                  field : "no",
                  payload : value
                })
              }}
              value={formState.no}
              style={styles.input}
              editable={true}
              placeholder={'บ้านเลขที่'}
            />
            <TextInput
              onChangeText={(value)=>{
                dispatch({
                  type : "Handle Input",
                  field : "address",
                  payload : value
                })
              }}
              value={formState.address}
              style={styles.input}
              editable={true}
              placeholder={'รายละเอียดที่อยู่ (หมู่, ถนน)'}
            />
              <DropDownPicker
                zIndex={3000}
                zIndexInverse={1000}
                style={{
                  marginVertical : 10,
                  backgroundColor : colors.white,
                  borderColor: colors.disable,
                }}
                placeholder="จังหวัด"
                placeholderStyle={{
                  color: colors.disable,
                }}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                onSelectItem={(value)=>{
                  setProvince(value)
                  dispatch({
                    type : "Handle Input",
                    field : "province",
                    payload : value
                  })
                }}
                setValue={setValue}
                dropDownDirection="BOTTOM"
                dropDownContainerStyle={{
                  borderColor: colors.disable,
                }}
              />
              <DropDownPicker
                zIndex={2000}
                zIndexInverse={2000}
                disabled={(!province)?true:false}
                style={{
                  borderColor: colors.disable,
                  marginVertical : 10
                }}
                placeholder="อำเภอ"
                placeholderStyle={{
                  color: colors.disable,
                }}
                open={openDistrict}
                value={valueDistrict}
                items={itemsDistrict}
                setOpen={setOpenDistrict}
                onSelectItem={(value)=>{
                  setDistrict(value)
                  dispatch({
                    type : "Handle Input",
                    field : "district",
                    payload : value
                  })
                }}
                setValue={setValueDistrict}
                dropDownDirection="BOTTOM"
                dropDownContainerStyle={{
                  borderColor: colors.disable,
                }}
              />
              <DropDownPicker
                zIndex={1000}
                zIndexInverse={3000}
                disabled={(!province && !district)?true:false}
                style={{
                  borderColor: colors.disable,
                  marginVertical : 10
                }}
                placeholder="ตำบล"
                placeholderStyle={{
                  color: colors.disable,
                }}
                open={openSubDistrict}
                value={valueSubDistrict}
                items={itemsSubDistrict}
                setOpen={setOpenSubDistrict}
                onSelectItem={(value:any)=>{
                  setSubdistrict(value)
                  
                  dispatch({
                    type : "Handle Input",
                    field : "subdistrict",
                    payload : value
                  })
                  dispatch({
                    type : "Handle Input",
                    field : "postal",
                    payload : value.postcode
                  })
                }}
                setValue={setSubValueDistrict}
                dropDownDirection="BOTTOM"
                dropDownContainerStyle={{
                  borderColor: colors.disable,
                }}
              />
            <TextInput
              value={formState.postal}
              style={styles.input}
              editable={false}
              placeholder={'รหัสไปรษณีย์'}
            />
          </ScrollView>
        </View>

        <View style={{backgroundColor: colors.white}}>
          <MainButton
            label="ถัดไป"
            color={colors.orange}
            onPress={() => {
              // console.log(formState)
              // Register.registerStep2(formState.name,formState.surname,formState.tel,
              //   formState.no,
              //   formState.address,
              //   formState.province.value,
              //   formState.district.value,
              //   formState.subdistrict.value,
              //   formState.postal).then((res)=>{
              //     console.log(res);
                  navigation.navigate('ThirdFormScreen');
              //   }).catch(err => console.log(err))
            }}
          />
        </View>
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
  h1: {
    fontFamily: font.medium,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.fontBlack,
    marginTop: normalize(24),
  },
  label: {
    fontFamily: font.light,
    fontSize: normalize(14),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },
  input: {
    height: normalize(56),
    marginVertical: 12,
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
  },
});
