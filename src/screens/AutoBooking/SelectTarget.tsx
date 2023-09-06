import { normalize } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mixpanel } from '../../../mixpanel';
import { colors, font, icons } from '../../assets';
import fonts from '../../assets/fonts';
import { MainButton } from '../../components/Button/MainButton';
import InputWithSuffix from '../../components/InputText/InputWithSuffix';
import StepIndicatorHead from '../../components/StepIndicatorHead';
import { useAutoBookingContext } from '../../contexts/AutoBookingContext';
import { CropDatasource } from '../../datasource/CropDatasource';
import { PURPOSE_SPRAY_CHECKBOX } from '../../definitions/timeSpray';
import Text from '../../components/Text/Text';

const SelectTarget: React.FC<any> = ({ navigation, route }) => {
  const isSelectDroner = route.params.isSelectDroner;
  const profile = route.params.profile;
  const [checkBoxList, setCheckBoxList] = useState<
    { id: number; label: string }[]
  >(PURPOSE_SPRAY_CHECKBOX);
  const {
    state: { taskData },
    autoBookingContext: { setTaskData },
  } = useAutoBookingContext();
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
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [selectedCheckbox, setSelectedCheckbox] = useState<any>(null);
  const onSubmit = () => {
    if (periodSprayValue.value === '') {
      return;
    }
    setTaskData(prev => ({
      ...prev,
      targetSpray: selectedOption,
      preparationBy: selectedCheckbox,
      purposeSpray: {
        id: periodSprayValue.value,
        name: periodSprayValue.label,
      },
    }));
    navigation.navigate('DetailTaskScreen', {
      isSelectDroner: isSelectDroner,
      profile: profile,
    });
  };

  const fetchPurposeSpray = async () => {
    setLoading(true);
    await CropDatasource.getPurposeByCroupName(taskData?.plantName || '')
      .then(res => {
        const data = res.purposeSpray.map((item: any) => ({
          label: item.purposeSprayName,
          value: item.id,
        }));
        setPeriodSpray(data);
        setSelectedCheckbox(taskData?.preparationBy);
        setSelectedOption(taskData?.targetSpray);
        setPeriodSprayValue({
          label: taskData?.purposeSpray?.name || '',
          value: taskData?.purposeSpray?.id || '',
        });
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPurposeSpray();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <StepIndicatorHead
        currentPosition={2}
        onPressBack={() => {
          mixpanel.track('Tab back from select target screen');
          navigation.goBack();
        }}
        label={'เป้าหมายการพ่น'}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <SafeAreaView
          edges={['left', 'right']}
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: normalize(16),
          }}>
          <ScrollView>
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
                          option.label &&
                          selectedOption.includes(option.label.toString())
                            ? '#56D88C'
                            : '#F2F3F4',
                      },
                    ]}
                    onPress={() => {
                      mixpanel.track('Tab select target spray');
                      if (selectedOption.includes(option.label.toString())) {
                        setSelectedOption(prev =>
                          prev.filter(item => item !== option.label.toString()),
                        );
                      } else {
                        setSelectedOption(prev => [
                          ...prev,
                          option.label.toString(),
                        ]);
                      }
                    }}>
                    <Text
                      style={{
                        fontSize: 18,

                        color:
                          option.label &&
                          selectedOption.includes(option?.label.toString())
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
                onChangeText={text => {
                  const removeSpaceFront = text.replace(/^\s+/, '');
                  setOtherPlant(removeSpaceFront);
                }}
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
                        mixpanel.track('Tab add other target spray');
                        setOtherPlant('');
                        setSelectedOption(prev => [...prev, otherPlant]);
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
                  mixpanel.track('Tab select purpose spray');
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
                {periodSprayValue?.label ? (
                  <Text
                    style={{
                      color: colors.fontBlack,
                      fontFamily: fonts.SarabunMedium,
                      fontSize: 20,
                      lineHeight: 40,
                    }}>
                    {periodSprayValue.label}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: colors.disable,
                      fontFamily: fonts.SarabunMedium,
                      fontSize: 20,
                      lineHeight: 40,
                    }}>
                    {'เลือกช่วงเวลา'}
                  </Text>
                )}
                <Image
                  source={icons.arrowDown}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              </TouchableOpacity>
              <Text style={[styles.label, { marginTop: normalize(20) }]}>
                ยาที่ต้องใช้
              </Text>
              <TouchableOpacity
                onPress={() => {
                  mixpanel.track('Tab เกษตรกรเตรียมยาเอง');
                  setSelectedCheckbox('เกษตรกรเตรียมยาเอง');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: normalize(10),
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      selectedCheckbox === 'เกษตรกรเตรียมยาเอง'
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
                    เกษตรกรเตรียมยาเอง
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  mixpanel.track('Tab นักบินโดรนเตรียมให้');
                  setSelectedCheckbox('นักบินโดรนเตรียมให้');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: normalize(10),
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      selectedCheckbox === 'นักบินโดรนเตรียมให้'
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
                    นักบินโดรนเตรียมให้
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                paddingVertical: 16,
                marginBottom: 8,
              }}>
              <MainButton
                label="ยืนยัน"
                disable={
                  selectedOption.length < 1 ||
                  periodSprayValue?.value === '' ||
                  selectedCheckbox === ''
                }
                color={colors.greenLight}
                onPress={() => {
                  mixpanel.track('Tab submit from select target screen');
                  onSubmit();
                }}
                style={{}}
              />
            </View>
          </ScrollView>
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
    paddingHorizontal: 16,
    height: 52,
    fontSize: 20,
    fontFamily: fonts.SarabunMedium,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
