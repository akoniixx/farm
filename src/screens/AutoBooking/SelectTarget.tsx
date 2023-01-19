import { CheckBox, normalize } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons } from '../../assets';
import { MainButton } from '../../components/Button/MainButton';
import StepIndicatorHead from '../../components/StepIndicatorHead';
import { CropDatasource } from '../../datasource/CropDatasource';
import { PURPOSE_SPRAY_CHECKBOX } from '../../definitions/timeSpray';

const SelectTarget: React.FC<any> = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [periodSpray, setPeriodSpray] = useState<any>([
    { label: '', value: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [selectedCheckbox, setSelectedCheckbox] = useState<any>(null);

  const fetchPurposeSpray = async () => {
    setLoading(true);
    await CropDatasource.getPurposeByCroupName('นาข้าว')
      .then(res => {
        setPeriodSpray(
          res.purposeSpray.map((item: any) => ({
            label: item.purposeSprayName,
            value: item.id,
          })),
        );
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPurposeSpray();
  }, []);

  return (
    <>
      <StepIndicatorHead
        curentPosition={2}
        onPressBack={() => navigation.goBack()}
        label={'เป้าหมายการพ่น'}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          paddingHorizontal: normalize(16),
        }}>
        <SafeAreaView
          edges={['bottom', 'left', 'right']}
          style={{ flex: 1, justifyContent: 'space-between' }}>
          <View>
            <Text style={[styles.label, { marginTop: normalize(20) }]}>
              เป้าหมาย
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                backgroundColor: 'white',
                justifyContent: 'space-between',
              }}>
              {PURPOSE_SPRAY_CHECKBOX.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor:
                        option.id === selectedOption ? '#56D88C' : '#F2F3F4',
                    },
                  ]}
                  onPress={() => {
                    if (option.id === selectedOption) {
                      setSelectedOption(null);
                    } else {
                      setSelectedOption(option.id);
                    }
                  }}>
                  <Text
                    style={{
                      color:
                        option.id === selectedOption
                          ? colors.white
                          : colors.fontBlack,
                    }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.label, { marginTop: normalize(20) }]}>
              ช่วงเวลาการพ่น
            </Text>
            <DropDownPicker
              open={open}
              value={value}
              items={periodSpray}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setPeriodSpray}
              placeholder={'เลือกช่วงเวลา'}
            />
            <Text style={[styles.label, { marginTop: normalize(20) }]}>
              ยาที่ต้องใช้
            </Text>
            <TouchableOpacity onPress={() => setSelectedCheckbox('first')}>
              <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
                <Image
                  source={
                    selectedCheckbox === 'first' ? icons.checked : icons.check
                  }
                  style={{ width: normalize(20), height: normalize(20) }}
                />

                <Text
                  style={[
                    { color: colors.fontBlack, marginLeft: normalize(10) },
                  ]}>
                  เกษตรกรเตรียมเอง
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedCheckbox('second')}>
              <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
                <Image
                  source={
                    selectedCheckbox === 'second' ? icons.checked : icons.check
                  }
                  style={{ width: normalize(20), height: normalize(20) }}
                />

                <Text
                  style={[
                    { color: colors.fontBlack, marginLeft: normalize(10) },
                  ]}>
                  ให้นักบินโดรนเตรียมให้
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View></View>
          <MainButton
            label="ยืนยัน"
            color={colors.greenLight}
            onPress={() => navigation.navigate('DeatilTaskScreen')}
            style={{ margin: normalize(10) }}
          />
        </SafeAreaView>
      </View>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </>
  );
};

export default SelectTarget;

const styles = StyleSheet.create({
  card: {
    width: normalize(165),
    height: normalize(42),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(10),
    borderRadius: 10,
  },
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
  },
  label: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(20),
    color: colors.fontBlack,
  },
});
