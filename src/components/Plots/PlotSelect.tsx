import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import { mixpanel } from '../../../mixpanel';
import { colors, font, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { useAutoBookingContext } from '../../contexts/AutoBookingContext';
import { callcenterNumber } from '../../definitions/callCenterNumber';
import { normalize } from '../../functions/Normalize';
import InputWithSuffix from '../InputText/InputWithSuffix';
import Radio from '../Radio/Radio';

interface Prop {
  id: string;
  plotName: string;
  raiAmount: number;
  plantName: string;
  locationName: string;
  onPress: () => void;
  selected: boolean;
  status: string;
  isHaveDroner: boolean;
}

const PlotSelect: React.FC<Prop> = ({
  plotName,
  raiAmount,
  plantName,
  locationName,
  selected,
  onPress,
  status,
  isHaveDroner,
}) => {
  const {
    state: { taskData },
    autoBookingContext: { setTaskData },
  } = useAutoBookingContext();
  const isPending = status !== 'ACTIVE' || !isHaveDroner;
  const radioList = [
    {
      title: 'ทั้งหมด',
      value: 'all',
      key: 'all',
    },
    {
      title: 'กำหนดเอง',
      value: 'custom',
      key: 'custom',
    },
  ];
  const [checkValue, setCheckValue] = React.useState<string>('all');
  useEffect(() => {
    if (checkValue === 'all' && raiAmount) {
      setTaskData(prev => ({
        ...prev,
        farmAreaAmount: raiAmount.toString(),
      }));
    }

    if (
      taskData.farmAreaAmount.toString() !== raiAmount.toString() &&
      +taskData.farmAreaAmount > 0
    ) {
      setTaskData(prev => ({
        ...prev,
        farmAreaAmount: taskData.farmAreaAmount,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isPending}
      style={{
        width: '100%',
      }}>
      <View
        style={[
          styles({ disable: isPending, selected }).card,
          // selected && styles({ disable: isPending, selected }).selected,
        ]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={{
              fontFamily: fonts.SarabunMedium,
              fontSize: 20,
              color: isPending ? colors.grey40 : colors.fontGrey,
            }}>
            {plotName}
          </Text>
          <Image
            style={{ width: normalize(24), height: normalize(24) }}
            source={
              isPending
                ? icons.disableCheck
                : selected
                ? image.checked
                : image.uncheck
            }
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
          <Image
            source={
              isPending
                ? icons.areaDisable
                : selected
                ? icons.plot
                : icons.areaNormal
            }
            style={{
              width: normalize(18),
              height: normalize(20),
              marginRight: normalize(10),
            }}
          />
          <Text
            style={{
              fontFamily: fonts.SarabunLight,
              fontSize: normalize(18),
              color: isPending ? colors.grey40 : colors.fontGrey,
              marginRight: '40%',
              bottom: 2,
            }}>
            {raiAmount + ' ' + 'ไร่'}
          </Text>
          <Image
            source={
              isPending
                ? icons.plantDisable
                : selected
                ? icons.plant
                : icons.plantNormal
            }
            style={{
              width: normalize(18),
              height: normalize(20),
              marginRight: normalize(10),
            }}
          />
          <Text
            style={{
              fontFamily: fonts.SarabunLight,
              fontSize: normalize(18),
              color: isPending ? colors.grey40 : colors.fontGrey,
              marginRight: '10%',
              bottom: 2,
            }}>
            {plantName}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
          <Image
            source={
              isPending
                ? icons.locationDisable
                : selected
                ? icons.location
                : icons.locationNormal
            }
            style={{
              width: normalize(18),
              height: normalize(20),
              marginRight: normalize(10),
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.SarabunLight,
              fontSize: normalize(18),
              color: isPending
                ? colors.grey40
                : selected
                ? colors.greenDark
                : colors.fontGrey,
              marginRight: '10%',

              bottom: 2,
            }}>
            {locationName}
          </Text>
        </View>
        {!isHaveDroner && (
          <View
            style={{
              backgroundColor: '#FFF2F2',
              padding: 8,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 6,

              borderWidth: 1,
              borderColor: '#EF4E4E',
              borderStyle: 'dashed',
              marginTop: 8,
            }}>
            <Text
              style={{
                fontFamily: fonts.SarabunMedium,
                fontSize: 18,
                lineHeight: 28,
              }}>
              พื้นที่แปลงเกษตรไม่อยู่ในระยะทาง
            </Text>
            <Text
              style={{
                fontFamily: fonts.SarabunMedium,
                fontSize: 18,
                lineHeight: 26,
              }}>
              การให้บริการของนักบินโดรน
            </Text>
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('Tab callcenter from select plot screen');
                Linking.openURL(`tel:${callcenterNumber}`);
              }}
              style={{
                backgroundColor: colors.white,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                height: 42,
                marginTop: 6,
                width: '100%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 8,
                  }}
                  source={icons.callingDarkblue}
                />
                <Text
                  style={{
                    fontFamily: font.AnuphanMedium,
                    color: colors.blueMedium,
                    fontSize: 18,
                  }}>
                  ติดต่อเจ้าหน้าที่
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {status === 'PENDING' && (
          <View
            style={{
              backgroundColor: '#FFF2E3',
              paddingVertical: 4,
              paddingHorizontal: 8,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 18,
              alignSelf: 'flex-start',
              borderWidth: 1,
              borderColor: colors.orange,
              marginTop: 8,
            }}>
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                color: colors.orange,
                fontSize: 18,
              }}>
              รอการตรวจสอบ
            </Text>
          </View>
        )}
        {status === 'INACTIVE' && (
          <View
            style={{
              backgroundColor: '#FFF0F0',
              paddingVertical: 4,
              paddingHorizontal: 8,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 18,
              alignSelf: 'flex-start',
              borderWidth: 1,
              borderColor: colors.error,
              marginTop: 8,
            }}>
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                color: colors.error,
                fontSize: 18,
              }}>
              ปิดการใช้งาน
            </Text>
          </View>
        )}
        {selected && (
          <>
            <View
              style={{ height: 1, backgroundColor: '#C7F2D9', marginTop: 8 }}
            />
            <View
              style={{
                marginTop: 18,
                backgroundColor: '#FFFFEB',
                minHeight: 180,
                borderRadius: 10,
                padding: 8,
              }}>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: 20,
                  color: colors.primary,
                }}>
                จำนวนไร่ที่ต้องการฉีด
              </Text>
              <Radio
                radioLists={radioList}
                horizontal
                value={checkValue}
                style={{ marginVertical: 8 }}
                onChange={(value: string) => {
                  if (value === 'all') {
                    setTaskData(prev => ({
                      ...prev,
                      farmAreaAmount: raiAmount.toString(),
                    }));
                  }
                  setCheckValue(value);
                }}
              />
              <InputWithSuffix
                value={taskData.farmAreaAmount}
                onChangeText={text => {
                  const newNumber = text.replace(/[^0-9]/g, '');
                  if (+text !== +taskData.farmAreaAmount) {
                    setCheckValue('custom');
                  }

                  if (+text === +raiAmount) {
                    setCheckValue('all');
                  }

                  if (+newNumber > +raiAmount) {
                    return null;
                  }

                  setTaskData(prev => ({
                    ...prev,
                    farmAreaAmount: newNumber.toString(),
                  }));
                }}
                keyboardType="numeric"
                suffixComponent={
                  <Text
                    style={{
                      fontFamily: fonts.SarabunMedium,
                      fontSize: 20,
                      color: '#8D96A0',
                    }}>
                    ไร่
                  </Text>
                }
              />
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PlotSelect;

const styles = ({
  disable = false,
  selected = false,
}: {
  disable?: boolean;
  selected: boolean;
}) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      width: Dimensions.get('window').width - normalize(20),
      height: 'auto',
      backgroundColor: disable
        ? colors.greyDivider
        : selected
        ? 'rgba(46, 196, 109, 0.05)'
        : 'white',
      borderWidth: selected ? 2 : 1,
      borderColor: selected ? '#2EC46D' : '#C0C5CA',
      margin: normalize(10),
      borderRadius: normalize(10),
      padding: normalize(10),
    },
    selected: {
      borderColor: '#2EC46D',
      backgroundColor: 'rgba(46, 196, 109, 0.05)',
    },
    title: {
      fontWeight: 'bold',
    },
    h1: {
      fontFamily: font.SarabunMedium,
      fontSize: normalize(20),
      colors: disable ? colors.greyDivider : '#0D381F',
    },
  });
