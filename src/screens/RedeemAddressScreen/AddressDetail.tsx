import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useMemo} from 'react';
import {colors, font, icons} from '../../assets';
import {useAuth} from '../../contexts/AuthContext';
import {insertHyphenInTelNumber} from '../../function/mutateText';
import RadioList from '../../components/RadioList';
import {RewardParams} from '.';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {useFocusEffect} from '@react-navigation/native';
import Modal from '../../components/Modal/Modal';
import {
  RedeemMissionPayload,
  RedeemPayload,
  rewardDatasource,
} from '../../datasource/RewardDatasource';
import {usePoint} from '../../contexts/PointContext';

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
  isConfirm,
  setIsConfirm,
  setIsConfirmMission,
  isConfirmMission,
  missionDetail,
}: {
  isConfirmMission: boolean;
  setIsConfirmMission: (value: boolean) => void;
  navigation: any;
  isConfirm: boolean;
  missionDetail: any;
  data: RewardParams;
  setIsConfirm: (value: boolean) => void;
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
  const {getCurrentPoint} = usePoint();
  const onConfirmMission = async () => {
    try {
      const addressId =
        radioAddress === 'default' ? mainAddress?.id : secondAddress?.id;
      const payload: RedeemMissionPayload = {
        dronerId: user?.id || '',
        quantity: 1,
        updateBy: `${user?.firstname} ${user?.lastname}`,
        receiverDetail: {
          addressId: addressId || '',
          address: (radioAddress === 'default'
            ? mainAddress?.addressName
            : secondAddress?.addressName) as string,
          firstname: user?.firstname || '',
          lastname: user?.lastname || '',
          tel: user?.telephoneNo || '',
        },
        missionId: missionDetail.missionId,
        step: missionDetail.step,
        rewardId: missionDetail.rewardId,
      };
      const result = await rewardDatasource.redeemRewardMission(payload);

      setIsConfirmMission(false);
      setTimeout(() => {
        navigation.navigate('RedeemDetailScreen', {
          id: result.id,
        });
      }, 400);
    } catch (e) {
      console.log(e);
    }
  };
  const onConfirmRedeem = async () => {
    try {
      const addressId =
        radioAddress === 'default' ? mainAddress?.id : secondAddress?.id;
      const payload: RedeemPayload = {
        rewardId: data?.id,
        dronerId: user?.id || '',
        quantity: data.amountExchange,
        updateBy: `${user?.firstname} ${user?.lastname}`,
        receiverDetail: {
          addressId: addressId || '',
          address: (radioAddress === 'default'
            ? mainAddress?.addressName
            : secondAddress?.addressName) as string,
          firstname: user?.firstname || '',
          lastname: user?.lastname || '',
          tel: user?.telephoneNo || '',
        },
      };

      const result = await rewardDatasource.redeemReward(payload);
      await getCurrentPoint();
      setIsConfirm(false);

      setTimeout(() => {
        navigation.navigate('RedeemDetailScreen', {
          id: result.dronerTransaction.id,
        });
      }, 400);
    } catch (e) {
      console.log(e);
    }
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
      disabled: false,
      belowComponent: (
        <View>
          <Text
            style={{
              color: colors.fontBlack,
              fontFamily: font.light,
              fontSize: 16,
              marginTop: 8,
              marginLeft: 8,
            }}>
            {mainAddress?.addressName}
          </Text>
        </View>
      ),
    },
    {
      label: 'ที่อยู่อื่น',
      value: 'custom',
      disabled: !!secondAddress,
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
              marginLeft: 8,
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
    <>
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

        {dataList.length < 1 ? (
          <View
            style={{
              marginTop: 16,
            }}></View>
        ) : (
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
        )}
      </View>

      <Modal visible={isConfirm}>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 12,
            padding: 16,
            width: '100%',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: font.medium,
              color: colors.fontBlack,
            }}>
            กรุณาตรวจสอบข้อมูลของท่าน
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: font.medium,
              color: colors.fontBlack,
            }}>
            ก่อนยืนยันการแลกของรางวัล
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: font.light,
              color: colors.inkLight,
              marginTop: 8,
            }}>
            หากกดยืนยันการแลกแล้ว
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: font.light,
              color: colors.inkLight,
            }}>
            จะไม่สามารถแลกแต้มคืนได้
          </Text>
          <TouchableOpacity
            style={[styles.button, {marginTop: 16}]}
            onPress={() => {
              onConfirmRedeem();
            }}>
            <Text style={styles.textButton}>ยืนยัน</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subButton}
            onPress={() => {
              setIsConfirm(false);
            }}>
            <Text style={styles.textSubButton}>ยกเลิก</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={isConfirmMission}>
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 12,
            padding: 16,
            width: '100%',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: font.medium,
              color: colors.fontBlack,
            }}>
            กรุณาตรวจสอบ
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: font.medium,
              color: colors.fontBlack,
            }}>
            ที่อยู่จัดส่งของท่านก่อนการยืนยัน
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: font.light,
              color: colors.inkLight,
              marginTop: 8,
            }}>
            หากกดยืนยันแล้ว จะไม่สามารถยกเลิกการจัดส่งได้
          </Text>

          <TouchableOpacity
            style={[styles.button, {marginTop: 16}]}
            onPress={() => {
              onConfirmMission();
            }}>
            <Text style={styles.textButton}>ยืนยัน</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.subButton}
            onPress={() => {
              setIsConfirmMission(false);
            }}>
            <Text style={styles.textSubButton}>ยกเลิก</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  textButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.white,
  },
  button: {
    width: '100%',
    backgroundColor: colors.orange,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F86820',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  disabledButton: {
    width: '100%',
    backgroundColor: colors.disable,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DCDFE3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  subButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  textSubButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.fontBlack,
  },
});
