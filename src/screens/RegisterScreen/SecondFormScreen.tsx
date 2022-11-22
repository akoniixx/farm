import { Button } from '@rneui/themed';
import React, {useReducer, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {font} from '../../assets';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';
import image from '../../assets/images/image';
import { MainButton } from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import {ProgressBar} from '../../components/ProgressBar';
import {normalize} from '../../functions/Normalize';
import { registerReducer } from '../../hook/registerfield';
import {stylesCentral} from '../../styles/StylesCentral';

const SecondFormScreen: React.FC<any> = ({route, navigation}) => {
  const initialFormRegisterState = {
    no: '',
    address: '',
    province: '',
    district: '',
    subdistrict: '',
    postal: '',
  };
  
  const windowWidth = Dimensions.get('window').width;
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [valueDistrict, setValueDistrict] = useState(null);
  const [itemsDistrict, setItemDistrict] = useState([]);
  const [openSubDistrict, setOpenSubDistrict] = useState(false);
  const [valueSubDistrict, setSubValueDistrict] = useState(null);
  const [itemsSubDistrict, setItemSubDistrict] = useState([]);
  const [province, setProvince] = useState<any>(null);
  const [district, setDistrict] = useState<any>(null);
  const [subdistrict, setSubdistrict] = useState<any>(null);
  const [image, setImage] = useState<any>(null);
  const [bottompadding, setBottomPadding] = useState(0);
  const [open, setOpen] = useState(false);

  const [formState, dispatch] = useReducer(
    registerReducer,
    initialFormRegisterState,
  );

  
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
          <Text style={styles.h1}>ระบุที่อยู่
          <Text style={{fontSize: normalize(18), color: colors.gray}}> (ไม่จำเป็นต้องระบุ)</Text>
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
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              zIndex={3000}
              zIndexInverse={1000}
              style={{
                marginVertical: 10,
                backgroundColor: colors.white,
                borderColor: colors.disable,
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
              placeholder="จังหวัด"
              placeholderStyle={{
                color: colors.disable,
                fontFamily: font.SarabunLight,
                fontSize: normalize(16)
              }}
              dropDownDirection="BOTTOM"
              dropDownContainerStyle={{
                borderColor: colors.disable,
              }}
            />
            <Text style={styles.head}>อำเภอ</Text>

            <DropDownPicker
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              zIndex={2000}
              zIndexInverse={2000}
              style={{
                borderColor: colors.disable,
                marginVertical: 10,
                backgroundColor: !province ? colors.disable : colors.white,
              }}
              placeholder="อำเภอ"
              placeholderStyle={{
                color: !province ? colors.gray : colors.disable,
                fontFamily: font.SarabunLight,
                fontSize: normalize(16)
              }}
              onOpen={() => {
                setBottomPadding(60);
              }}
              onClose={() => {
                setBottomPadding(0);
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
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              zIndex={1000}
              zIndexInverse={3000}
              disabled={!district ? true : false}
              style={{
                borderColor: colors.disable,
                marginVertical: 10,
                backgroundColor: !district ? colors.disable : colors.white,
              }}
              placeholder="ตำบล"
              placeholderStyle={{
                color: !district ? colors.gray : colors.disable,
                fontFamily: font.SarabunLight,
                fontSize: normalize(16)
              }}
              onOpen={() => {
                setBottomPadding(120);
              }}
              onClose={() => {
                setBottomPadding(0);
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
              placeholderTextColor={colors.gray}
            />
          </ScrollView>
        </View>
        <View style={{backgroundColor: colors.white, zIndex: 0}}>
          <MainButton
            label="ถัดไป"
            disable={
              !formState.no ||
              !formState.address 
              // !formState.province.value ||
              // !formState.district.value ||
              // !formState.subdistrict.value ||
              // !formState.postal
                ? true
                : false
            }

            color={colors.greenLight}
            onPress={() => navigation.navigate('ThirdFormScreen')}
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
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontSize: normalize(16),
  },
});
