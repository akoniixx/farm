import { normalize } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons } from '../../assets';
import fonts from '../../assets/fonts';
import { MainButton } from '../../components/Button/MainButton';
import InputWithSuffix from '../../components/InputText/InputWithSuffix';
import StepIndicatorHead from '../../components/StepIndicatorHead';
import { CropDatasource } from '../../datasource/CropDatasource';
import { PURPOSE_SPRAY_CHECKBOX } from '../../definitions/timeSpray';

const SelectTarget: React.FC<any> = ({ navigation }) => {
  const [checkBoxList, setCheckBoxList] = useState<
    { id: number; label: string }[]
  >(PURPOSE_SPRAY_CHECKBOX);
  const [periodSpray, setPeriodSpray] = useState<any>([
    { label: '', value: '' },
  ]);
  const [otherPlant, setOtherPlant] = useState<string>('');
  const [periodSprayValue, setPeriodSprayValue] = useState<{
    label: string;
    value: string;
  }>({
    value: '',
    label: '',
  });
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
              {checkBoxList.map(option => (
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
                      fontSize: 18,

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
            <InputWithSuffix
              styleContainer={{
                marginTop: 16,
              }}
              value={otherPlant}
              placeholder="เป้าหมายอื่นๆ"
              onChangeText={text => setOtherPlant(text)}
              suffixComponent={
                otherPlant && (
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        checkBoxList.find(item => item.label === otherPlant)
                      ) {
                        return null;
                      }
                      setCheckBoxList(prev => [
                        ...prev,
                        { id: prev.length + 1, label: otherPlant },
                      ]);
                    }}
                    style={{
                      backgroundColor: '#56D88C',
                      width: 60,
                      height: 35,
                      borderRadius: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: 18,
                        fontFamily: fonts.AnuphanMedium,
                      }}>
                      เพิ่ม
                    </Text>
                  </TouchableOpacity>
                )
              }
            />

            <Text style={[styles.label, { marginTop: normalize(20) }]}>
              ช่วงเวลาการพ่น
            </Text>
            <TouchableOpacity
              style={styles.injectionInput}
              onPress={async () => {
                const currentValue: any = await SheetManager.show(
                  'sheet-select-injection',
                  {
                    payload: {
                      periodSpray,
                      currentVal: periodSprayValue,
                    },
                  },
                );
                setPeriodSprayValue(currentValue);
              }}>
              <Text
                style={{
                  color: colors.gray,
                  fontFamily: fonts.SarabunMedium,
                  fontSize: 20,
                  lineHeight: 40,
                }}>
                {periodSprayValue?.label
                  ? periodSprayValue.label
                  : 'เลือกช่วงเวลา'}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.label, { marginTop: normalize(20) }]}>
              ยาที่ต้องใช้
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedCheckbox('เกษตรกรเตรียมเอง')}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: normalize(10),
                  alignItems: 'center',
                }}>
                <Image
                  source={
                    selectedCheckbox === 'เกษตรกรเตรียมเอง'
                      ? icons.checked
                      : icons.check
                  }
                  style={{ width: normalize(20), height: normalize(20) }}
                />

                <Text
                  style={[
                    {
                      color: colors.fontBlack,
                      fontSize: 20,
                      marginLeft: normalize(10),
                    },
                  ]}>
                  เกษตรกรเตรียมเอง
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedCheckbox('ให้นักบินโดรนเตรียมให้')}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: normalize(10),
                  alignItems: 'center',
                }}>
                <Image
                  source={
                    selectedCheckbox === 'ให้นักบินโดรนเตรียมให้'
                      ? icons.checked
                      : icons.check
                  }
                  style={{ width: normalize(20), height: normalize(20) }}
                />

                <Text
                  style={[
                    {
                      color: colors.fontBlack,
                      fontSize: 20,
                      marginLeft: normalize(10),
                    },
                  ]}>
                  ให้นักบินโดรนเตรียมให้
                </Text>
              </View>
            </TouchableOpacity>
          </View>
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
    width: '48%',
    height: normalize(42),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(10),
    borderRadius: 6,
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
  injectionInput: {
    borderWidth: 1,
    borderColor: '#A7AEB5',
    borderRadius: 6,
    paddingLeft: 16,
    height: 52,
    fontSize: 20,
    fontFamily: fonts.SarabunMedium,
    justifyContent: 'center',
  },
});
