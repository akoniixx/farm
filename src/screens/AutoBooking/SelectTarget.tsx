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
import useTimeSpent from '../../hook/useTimeSpent';
import InfoCircleButton from '../../components/InfoCircleButton';
import crashlytics from '@react-native-firebase/crashlytics';
import HeadDronerCardForCreatTask from '../../components/HeadDronerCardForCreatTask';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const PrepareByLists = [
  {
    id: 1,
    label: 'เกษตรกรเตรียมยาเอง',
  },
  {
    id: 2,
    label: 'นักบินโดรนเตรียมให้',
  },
];
const SelectTarget: React.FC<any> = ({ navigation, route }) => {
  const isSelectDroner = route.params.isSelectDroner;
  const timeSpent = useTimeSpent();
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
    mixpanel.track('SelectTargetScreen_ButtonNext_tabbed', {
      ...taskData,
      timeSpent: timeSpent,
      navigateTo: 'DetailTaskScreen',
    });
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
        setLoading(false);
        crashlytics().recordError(err);
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
          mixpanel.track('SelectTargetScreen_ButtonBack_tabbed', {
            ...taskData,
            timeSpent: timeSpent,
            navigateTo: 'SelectPlantScreen',
          });
          navigation.goBack();
        }}
        label={'เป้าหมายการพ่น'}
      />
      {loading ? (
        <View style={{ flex: 1, marginTop: 16, padding: 16 }}>
          <SkeletonPlaceholder
            borderRadius={10}
            speed={2000}
            backgroundColor={colors.skeleton}>
            <>
              {[1, 2, 3].map((_, idx) => {
                return (
                  <SkeletonPlaceholder.Item
                    key={idx}
                    flexDirection="row"
                    alignItems="center"
                    style={{ width: '100%', marginBottom: 16 }}>
                    <View
                      style={{
                        width: '100%',
                        height: 160,
                      }}
                    />
                  </SkeletonPlaceholder.Item>
                );
              })}
            </>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <>
          {isSelectDroner && (
            <HeadDronerCardForCreatTask
              navigation={navigation}
              image={profile.image_droner}
              name={
                profile.nickname
                  ? profile.nickname
                  : profile.firstname + ' ' + profile.lastname
              }
            />
          )}
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
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      alignItems: 'center',
                    }}>
                    <Text style={[styles.label, { marginTop: normalize(20) }]}>
                      เป้าหมาย
                    </Text>
                    <View
                      style={{
                        marginTop: normalize(20),
                      }}>
                      <InfoCircleButton sheetId="targetSpray" />
                    </View>
                  </View>
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
                          mixpanel.track(
                            'SelectTargetScreen_SelectTarget_tabbed',
                            {
                              target: option.label,
                            },
                          );
                          if (
                            selectedOption.includes(option.label.toString())
                          ) {
                            setSelectedOption(prev =>
                              prev.filter(
                                item => item !== option.label.toString(),
                              ),
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
                            fontFamily: fonts.SarabunLight,
                            lineHeight: 28,
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
                    placeholder="เป้าหมายอื่นๆ เช่น เพลีย หนอน"
                    onChangeText={text => {
                      const removeSpaceFront = text.replace(/^\s+/, '');
                      setOtherPlant(removeSpaceFront);
                    }}
                    suffixComponent={
                      otherPlant && (
                        <TouchableOpacity
                          onPress={() => {
                            if (
                              checkBoxList.find(
                                item => item.label === otherPlant,
                              )
                            ) {
                              return null;
                            }
                            setCheckBoxList(prev => [
                              ...prev,
                              { id: prev.length + 1, label: otherPlant },
                            ]);
                            mixpanel.track(
                              'SelectTargetScreen_AddTarget_tabbed',
                              {
                                otherPlant: otherPlant,
                              },
                            );
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

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}>
                    <Text style={[styles.label, { marginTop: normalize(20) }]}>
                      ช่วงเวลาการพ่น
                    </Text>
                    <View style={{ marginTop: normalize(20) }}>
                      <InfoCircleButton sheetId="injectTime" />
                    </View>
                  </View>
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
                      mixpanel.track(
                        'SelectTargetScreen_SelectPeriodSpray_tabbed',
                        {
                          periodSpray: currentValue,
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
                  {PrepareByLists.map(el => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          mixpanel.track(
                            'SelectTargetScreen_SelectPreparationBy_tabbed',
                            {
                              preparationBy: el.label,
                            },
                          );
                          setSelectedCheckbox(el.label);
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: normalize(10),
                            alignItems: 'center',
                          }}>
                          {selectedCheckbox === el.label ? (
                            <View
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: colors.greenLight,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: 6,
                                  backgroundColor: colors.greenLight,
                                }}
                              />
                            </View>
                          ) : (
                            <View
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: colors.grey20,
                              }}
                            />
                          )}
                          <Text
                            style={[
                              {
                                color: colors.fontBlack,
                                fontSize: 20,
                                fontFamily: fonts.SarabunLight,

                                marginLeft: normalize(10),
                              },
                            ]}>
                            {el.label}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
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
      )}
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
