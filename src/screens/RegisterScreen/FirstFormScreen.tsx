import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  PermissionsAndroid,
  Platform,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, icons, image as img} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {Avatar} from '@rneui/themed';
import DropDownPicker from 'react-native-dropdown-picker';
import Geolocation from 'react-native-geolocation-service';
import * as ImagePicker from 'react-native-image-picker';
import {normalize} from '../../functions/Normalize';
import {ProgressBar} from '../../components/ProgressBar';
import DatePicker from 'react-native-date-picker';

const FirstFormScreen: React.FC<any> = ({navigation, route}) => {
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
  const [birthday, setBirthday] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const Icons = () => {
    <Image
    source={icons.calendar}
    style={{
      width: normalize(25),
      height: normalize(30),
    }}
  />
  }
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
            <ProgressBar index={1} />
          </View>
          <Text style={styles.h3}>ขั้นตอนที่ 1 จาก 3</Text>
          <Text style={styles.h1}>ระบุข้อมูลส่วนตัว</Text>
          <ScrollView>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: normalize(40),
              }}>
              <TouchableOpacity>
                <View
                  style={{
                    width: normalize(116),
                    height: normalize(116),
                    position: 'relative',
                  }}>
                  <Avatar
                    size={116}
                    source={!image ? icons.avatar : {uri: image.assets[0].uri}}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Text style={styles.head}>ชื่อ*</Text>
            <TextInput
              style={styles.input}
              editable={true}
              placeholder={'ระบุชื่อ'}
              placeholderTextColor={colors.disable}
            />
            <Text style={styles.head}>นามสกุล*</Text>

            <TextInput
              style={styles.input}
              editable={true}
              placeholder={'ระบุนามสกุล'}
              placeholderTextColor={colors.disable}
            />
            <Text style={styles.head}>วันเกิด*</Text>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <View
                style={[
                  styles.input,
                  {
                    alignItems: 'center',
                    flexDirection: 'row',
                  },
                ]}>
                <TextInput
                  editable={false}
                  placeholder={'ระบุวัน เดือน ปี'}
                  style={{width: windowWidth * 0.78,fontFamily: font.Sarabun, fontSize: normalize(14),
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
            </TouchableOpacity>
            <Text style={styles.head}>เบอร์โทรศัพท์</Text>
            <TextInput
              style={[styles.input, {backgroundColor: colors.disable}]}
              editable={false}
              placeholder={'0989284761'}
            />
            <View style={{marginTop: normalize(40)}}>
              <View>
                <Text style={styles.h1}>
                  ที่อยู่ของคุณ
                  <Text style={[styles.h2, {color: colors.gray}]}>
                    {' '}
                    (ไม่จำเป็นต้องระบุ)
                  </Text>
                </Text>
              </View>
            </View>
            <Text style={styles.head}>บ้านเลขที่</Text>

            <TextInput
              style={styles.input}
              editable={true}
              placeholder={'บ้านเลขที่'}
              placeholderTextColor={colors.disable}
            />
            <Text style={styles.head}>รายละเอียดที่อยู่</Text>

            <TextInput
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
              }}
              setValue={setValue}
              placeholder="จังหวัด"
              placeholderStyle={{
                color: colors.disable,
                fontFamily: font.Sarabun,
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
                fontFamily: font.Sarabun,
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
                fontFamily: font.Sarabun,
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
              }}
              setValue={setSubValueDistrict}
              dropDownDirection="BOTTOM"
              dropDownContainerStyle={{
                borderColor: colors.disable,
              }}
            />
            <Text style={styles.head}>รหัสไปรษณีย์</Text>
            <TextInput
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
            onPress={() => navigation.navigate('SecondFormScreen')}
          />
        </View>
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={date => {
                  setOpen(false);
                  setDate(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
      </View>
    </SafeAreaView>
  );
};
export default FirstFormScreen;

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
    fontSize: normalize(19),
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
    fontSize: normalize(16),
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
    fontFamily: font.Sarabun,
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
