import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {MainButton} from '../../components/Button/MainButton';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {ScrollView} from 'react-native-gesture-handler';
import {condition} from '../../assets/constant/constant';
import {CheckBox} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import icons from '../../assets/icons/icons';

const ConditionScreen: React.FC<any> = ({navigation}) => {
  const [checked, setChecked] = useState<boolean>(false);
  const [disabledCheckbox, setDisabledCheckbox] = useState<boolean>(true);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="ลงทะเบียนนักบินโดรน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.inner}>
        <View style={{flex: 5}}>
          <ScrollView
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                setDisabledCheckbox(false);
              }
            }}>
            <Text style={styles.h2}>ข้อตกลงและเงื่อนไข</Text>
            <Text style={[styles.h3, {marginVertical: normalize(20)}]}>
              โปรดอ่านข้อตกลงและเงื่อนไขโดยละเอียดก่อน ดำเนินการถัดไป
            </Text>
            <Text style={[styles.h1]}>นโยบายการคุ้มครองข้อมูลส่วน บุคคล</Text>
            <Text style={[styles.h3, {marginVertical: normalize(20)}]}>
              หัวข้อนโยบาย
            </Text>

            <Text style={styles.label}>{condition}</Text>
          </ScrollView>
        </View>
        <View
          style={{
            flex: 1,
            paddingVertical: normalize(5),
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => setChecked(!checked)}
            disabled={disabledCheckbox}>
            <View style={{flexDirection: 'row', marginTop: normalize(10)}}>
              <Image
                source={checked ? icons.checked : icons.check}
                style={{width: normalize(20), height: normalize(20)}}
              />

              <Text
                style={[
                  styles.label,
                  {color: colors.fontBlack, marginLeft: normalize(10)},
                ]}>
                ฉันยอมรับข้อมตกลงและเงื่อนไข
              </Text>
            </View>
          </TouchableOpacity>
          <MainButton
            label="ถัดไป"
            color={colors.orange}
            disable={!checked}
            onPress={() => navigation.navigate('TelNumberScreen')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ConditionScreen;

const styles = StyleSheet.create({
  btnContainer: {
    width: normalize(343),
    marginVertical: normalize(10),
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  h1: {
    fontFamily: font.bold,
    fontSize: normalize(23),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.bold,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  h3: {
    fontFamily: font.medium,
    fontSize: normalize(17),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.light,
    fontSize: normalize(16),
    color: colors.gray,
  },
});
