import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {colors, font, icons} from '../../assets';
import {useAuth} from '../../contexts/AuthContext';
import {insertHyphenInTelNumber} from '../../function/mutateText';
import RadioList from '../../components/RadioList';
import {RewardParams} from '.';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {useFocusEffect} from '@react-navigation/native';

interface AddressType {
  id: string;
  address1: string;
  address2: string;
  address3: string;
  provinceId: number;
  districtId: number;
  subdistrictId: number;
  postcode: string;
  createdAt: string;
  updatedAt: string;
  province: {
    provinceId: number;
    provinceName: string;
    region: string;
  };
  district: {
    districtId: number;
    districtName: string;
    provinceId: number;
    provinceName: string;
  };
  subdistrict: {
    subdistrictId: number;
    subdistrictName: string;
    districtId: number;
    districtName: string;
    provinceId: number;
    provinceName: string;
    lat: string | null;
    long: string | null;
    postcode: string;
  };
}
export default function AddressDetail({
  navigation,
  data,
}: {
  navigation: any;
  data: RewardParams;
}) {
  const {
    state: {user},
  } = useAuth();
  const [radioAddress, setRadioAddress] = React.useState<'default' | 'custom'>(
    'default',
  );
  const [addressList, setAddressList] = React.useState<AddressType[]>([]);
  const [mainAddress, secondAddress] = useMemo(() => {
    const mergeAddress = addressList.map(item => {
      if (!item) {
        return null;
      }
      return {
        ...item,
        addressName: `${item.address1} ${item.address2} ${item.province.provinceName} ${item.district.districtName} ${item.subdistrict.subdistrictName} ${item.postcode}`,
        value: item.id,
      };
    });
    return mergeAddress;
  }, [addressList]);
  const onChangeRadioAddress = (value: any) => {
    setRadioAddress(value);
  };

  useFocusEffect(
    React.useCallback(() => {
      const getAddressListById = async () => {
        try {
          const result = await ProfileDatasource.getAddressListById(
            user?.id || '',
          );
          const state = [result.address, result.otherAddress];
          setAddressList(state);
        } catch (e) {
          console.log(e);
        }
      };
      getAddressListById();
    }, [user?.id]),
  );
  const userPhoneNumber = useMemo(() => {
    return insertHyphenInTelNumber(user?.telephoneNo || '');
  }, [user?.telephoneNo]);
  const dataList = [
    {
      label: 'ค่าเริ่มต้น',
      value: 'default',
      extra: null,
      belowComponent: (
        <View>
          <Text
            style={{
              color: colors.fontBlack,
              fontFamily: font.light,
              fontSize: 16,
              marginTop: 8,
            }}>
            {mainAddress?.addressName}
          </Text>
        </View>
      ),
    },
    {
      label: 'ที่อยู่อื่น',
      value: 'custom',
      extra: secondAddress ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CustomAddressScreen', {
              isEdit: true,
              initialValue: secondAddress,
              data: data,
            });
          }}>
          <Image
            source={icons.EditGrey}
            style={{
              width: 24,
              height: 24,
            }}
          />
        </TouchableOpacity>
      ) : (
        <></>
      ),
      // eslint-disable-next-line no-extra-boolean-cast
      belowComponent: !!secondAddress ? (
        <View>
          <Text
            style={{
              color: colors.fontBlack,
              fontFamily: font.light,
              fontSize: 16,
              marginTop: 8,
            }}>
            {secondAddress?.addressName}
          </Text>
        </View>
      ) : (
        <View>
          <TouchableOpacity
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              margin: 8,
              width: 112,
              height: 40,
              borderWidth: 1,
              borderColor: '#FB8705',
              borderRadius: 8,
            }}
            onPress={() => {
              navigation.navigate('CustomAddressScreen', {data});
            }}>
            <Text
              style={{
                fontSize: 24,
                lineHeight: 22,
                fontFamily: font.medium,
                color: colors.orange,
              }}>
              +{' '}
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 14,
                  fontFamily: font.medium,
                  color: colors.orange,
                }}>
                เพิ่มที่อยู่ใหม่
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      ),
    },
  ];
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 16,
          fontFamily: font.bold,
        }}>
        ที่อยู่ในการจัดส่ง
      </Text>
      <Text
        style={{
          color: colors.grey2,
          fontFamily: font.medium,
          fontSize: 16,
          marginTop: 8,
        }}>
        ชื่อ-นามสกุล :{' '}
        <Text
          style={{
            color: colors.fontBlack,
            fontFamily: font.medium,
            fontSize: 16,
          }}>
          {user?.firstname} {user?.lastname}
        </Text>
      </Text>
      <Text
        style={{
          color: colors.grey2,
          fontFamily: font.medium,
          fontSize: 16,
          marginTop: 8,
        }}>
        เบอร์โทรศัพท์ :{' '}
        <Text
          style={{
            color: colors.fontBlack,
            fontFamily: font.medium,
            fontSize: 16,
          }}>
          {userPhoneNumber || '-'}
        </Text>
      </Text>
      <Text
        style={{
          color: colors.grey2,
          fontFamily: font.medium,
          fontSize: 16,
          marginTop: 8,
        }}>
        ที่อยู่ :{' '}
      </Text>
      <View
        style={{
          marginTop: 16,
        }}>
        {dataList.map(el => {
          return (
            <RadioList
              belowComponent={el.belowComponent}
              onPress={() => onChangeRadioAddress(el.value)}
              isSelected={radioAddress === el.value}
              label={el.label}
              extra={el.extra}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
