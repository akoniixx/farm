import {View, Text, StyleSheet, Image, Touchable, TouchableOpacity, TextInput} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, image} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {InputPhone} from '../../components/InputPhone';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {ProgressBar} from '../../components/ProgressBar';
import { Avatar } from '@rneui/themed';
import DropDownPicker from 'react-native-dropdown-picker';

const SecondFormScreen: React.FC<any> = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'}
  ]);
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
            <View style={{justifyContent:'center',alignItems:'center',marginTop:normalize(40)}}>
              <TouchableOpacity>
            <Avatar
              size={100}
              rounded
              source={image.idcard}
            />
            </TouchableOpacity>
            </View>
            <View style={{marginTop:normalize(40)}}>
              <Text style={styles.h1}>ข้อมูลทั่วไป (โปรดระบุ)</Text>
            </View>
            <TextInput style={styles.input} editable={true} placeholder={'ชื่อ'} />
            <TextInput style={styles.input} editable={true} placeholder={'นามสกุล'} />
            <TextInput style={styles.input} editable={true} placeholder={'เบอร์โทรศัพท์'} />
            <View style={{marginTop:normalize(40)}}>
              <Text style={styles.h1}>ที่อยู่</Text>
            </View>
            <TextInput style={styles.input} editable={true} placeholder={'บ้านเลขที่'} />
            <TextInput style={styles.input} editable={true} placeholder={'รายละเอียดที่อยู่ (หมู่, ถนน)'} />
            <DropDownPicker
            style={{borderColor:colors.disable}}
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />
    <TextInput style={styles.input} editable={true} placeholder={'รหัสไปรษณีย์'} />
          </ScrollView>
        </View>

        <View style={{backgroundColor: colors.white}}>
          <MainButton
            label="ถัดไป"
            color={colors.orange}
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
  input:{
    height: normalize(56),
    marginVertical: 12,
    padding:10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10)
  }
});
