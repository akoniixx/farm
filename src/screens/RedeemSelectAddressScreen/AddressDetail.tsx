import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { colors, font, icons } from '../../assets';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileDatasource } from '../../datasource/ProfileDatasource';
import { useFocusEffect } from '@react-navigation/native';
import Modal from '../../components/Modal/Modal';
import {
  RedeemPayload,
  rewardDatasource,
} from '../../datasource/RewardDatasource';
import { usePoint } from '../../contexts/PointContext';
import { mixpanel } from '../../../mixpanel';
import Text from '../../components/Text/Text';
import RadioList from '../../components/Radio/RadioList';
import { insertHyphenInTelNumber } from '../../functions/mutateText';
import { RedeemSelectAddressScreenType } from '../../navigations/MainNavigator';
import { navigationRef } from '../../navigations/RootNavigation';

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
interface Props {
  // isConfirmMission: boolean;
  // setIsConfirmMission: (value: boolean) => void;
  navigation: any;
  isConfirm: boolean;
  // missionDetail: any;
  data: RedeemSelectAddressScreenType;
  setIsConfirm: (value: boolean) => void;
  setDisableButton: (value: boolean) => void;
}
export default function AddressDetail({
  navigation,
  data,
  isConfirm,
  setIsConfirm,

  setDisableButton,
}: Props) {
  const {
    state: { user },
  } = useAuth();
  const [radioAddress, setRadioAddress] = React.useState<'default' | 'custom'>(
    'default',
  );
  const [transactionId, setTransactionId] = React.useState<string>('');
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [disabled, setDisabled] = React.useState<boolean>(true);
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
  const { getCurrentPoint } = usePoint();

  const onConfirmRedeem = async () => {
    try {
      setDisabled(true);
      const addressId =
        radioAddress === 'default' ? mainAddress?.id : secondAddress?.id;
      const payload: RedeemPayload = {
        rewardId: data?.id,
        farmerId: user?.id || '',
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
      mixpanel.track('RedeemAddressScreen_ConfirmRedeem_pressed', {
        screen: 'RedeemAddressScreen',
        to: 'RedeemDetailDigitalScreen',
        ...payload,
      });
      setIsConfirm(false);

      setTransactionId(result?.farmerTransaction?.id);
      setIsSuccess(true);
    } catch (e) {
      console.log(e);
    } finally {
      setDisabled(false);
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
          setDisabled(false);
        } catch (e) {
          console.log(e);
        }
      };
      getAddressListById();
    }, [user?.id]),
  );

  const onPressToDetail = () => {
    setIsSuccess(false);
    setTimeout(() => {
      navigation.navigate('RedeemDetailPhysicalScreen', {
        id: transactionId,
      });
    }, 400);
    setTransactionId('');
  };
  const onPressToRewardList = () => {
    setIsSuccess(false);
    setTimeout(() => {
      navigation.navigate('รางวัล');
    }, 400);
    setTransactionId('');
  };

  useEffect(() => {
    const checkAddress = async () => {
      const [mainAdd, secondAdd] = addressList;
      if (radioAddress === 'default') {
        setDisableButton(mainAdd ? false : true);
      } else {
        setDisableButton(secondAdd ? false : true);
      }
    };
    if (addressList.length > 0) {
      checkAddress();
    } else {
      setDisableButton(true);
    }
  }, [addressList, radioAddress, setDisableButton]);
  const userPhoneNumber = useMemo(() => {
    return insertHyphenInTelNumber(user?.telephoneNo || '');
  }, [user?.telephoneNo]);

  const { dataList, notHaveAddress } = useMemo(() => {
    const dataList = [];
    dataList.push({
      label: 'ค่าเริ่มต้น',
      value: 'default',
      disabled: false,
      belowComponent: (
        <View>
          <Text
            style={{
              color: colors.fontBlack,
              fontFamily: font.SarabunRegular,
              fontSize: 16,
              marginTop: 8,
              marginLeft: 8,
            }}>
            {mainAddress?.addressName}
          </Text>
        </View>
      ),
    });
    dataList.push({
      label: 'ที่อยู่อื่น',
      value: 'custom',
      disabled: !!secondAddress,
      extra: secondAddress ? (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.navigate('CustomAddressScreen', {
              isEdit: true,
              initialValue: secondAddress,
              data: data,
            });
          }}>
          <Image
            source={icons.editGrey}
            resizeMode="contain"
            style={{
              width: 18,
              height: 18,
              marginRight: 8,
            }}
          />
          <Text
            style={{
              fontSize: 14,
              lineHeight: 24,
              fontFamily: font.SarabunRegular,
              color: colors.grey50,
            }}>
            แก้ไข
          </Text>
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
              fontFamily: font.SarabunRegular,
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
            style={styles.buttonAddNewAddress}
            onPress={() => {
              navigation.navigate('CustomAddressScreen', { data: null });
            }}>
            <Text
              style={{
                fontSize: 24,
                lineHeight: 30,
                fontFamily: font.AnuphanSemiBold,
                color: colors.greenLight,
              }}>
              +{' '}
            </Text>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 24,
                fontFamily: font.AnuphanSemiBold,
                color: colors.greenLight,
              }}>
              เพิ่มที่อยู่ใหม่
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });

    return { dataList, notHaveAddress: !mainAddress && !secondAddress };
  }, [mainAddress, secondAddress, data, navigation]);

  return (
    <>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: font.AnuphanSemiBold,
          }}>
          ที่อยู่จัดส่ง
        </Text>
        <Text
          style={{
            color: colors.grey60,
            fontFamily: font.SarabunRegular,
            fontSize: 18,
            marginTop: 8,
          }}>
          ชื่อ-นามสกุล :{' '}
          <Text
            style={{
              color: colors.fontBlack,
              fontFamily: font.SarabunSemiBold,
              fontSize: 18,
            }}>
            {user?.firstname} {user?.lastname}
          </Text>
        </Text>
        <Text
          style={{
            color: colors.grey60,
            fontFamily: font.SarabunRegular,
            fontSize: 18,
            marginTop: 0,
          }}>
          เบอร์โทรศัพท์ :{' '}
          <Text
            style={{
              color: colors.fontBlack,
              fontFamily: font.SarabunSemiBold,
              fontSize: 16,
            }}>
            {userPhoneNumber || '-'}
          </Text>
        </Text>
        <Text
          style={{
            color: colors.grey60,
            fontFamily: font.SarabunSemiBold,
            fontSize: 16,
            marginTop: 8,
            marginBottom: 4,
          }}>
          ที่อยู่ :{' '}
          {notHaveAddress && (
            <Text
              style={{
                color: colors.errorText,
                fontFamily: font.SarabunSemiBold,
                fontSize: 16,
              }}>
              กรุณาเพิ่มที่อยู่ของท่าน
            </Text>
          )}
        </Text>

        {notHaveAddress ? (
          <View>
            <TouchableOpacity
              style={styles.buttonAddNewAddress}
              onPress={() => {
                mixpanel.track('RedeemAddressScreen_AddNewAddress_pressed', {
                  screen: 'RedeemAddressScreen',
                  to: 'CustomAddressScreen',
                });
                navigation.navigate('CustomAddressScreen', {
                  data: null,
                  isAddMainAddress: true,
                });
              }}>
              <Text
                style={{
                  fontSize: 24,
                  lineHeight: 30,
                  fontFamily: font.SarabunRegular,
                  color: colors.greenLight,
                  marginRight: 8,
                  marginBottom: 4,
                }}>
                +
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 24,
                  fontFamily: font.SarabunSemiBold,
                  color: colors.greenLight,
                }}>
                เพิ่มที่อยู่ใหม่
              </Text>
            </TouchableOpacity>
          </View>
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
              fontFamily: font.AnuphanSemiBold,
              color: colors.fontBlack,
            }}>
            กรุณาตรวจสอบข้อมูลของท่าน
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: font.AnuphanSemiBold,
              color: colors.fontBlack,
            }}>
            ก่อนยืนยันการแลกรางวัล
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: font.SarabunRegular,
              color: colors.inkLight,
              marginTop: 8,
            }}>
            หากกดยืนยันการแลกแล้ว
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: font.SarabunRegular,
              color: colors.inkLight,
            }}>
            จะไม่สามารถแลกแต้มคืนได้
          </Text>
          <TouchableOpacity
            disabled={disabled}
            style={[styles.button, { marginTop: 16 }]}
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
      <Modal
        iconTop={
          <Image
            source={icons.correct}
            style={{ width: 24, height: 24, marginBottom: 16 }}
          />
        }
        visible={isSuccess}
        onPressPrimary={() => {
          mixpanel.track(
            'RedeemSelectAddressScreen_ModalSuccess_PressPrimary',
            {
              to: 'RedeemDetailPhysicalScreen',
            },
          );
          onPressToDetail();
        }}
        onPressSecondary={() => {
          mixpanel.track(
            'RedeemSelectAddressScreen_ModalSuccess_PressSecondary',
            {
              to: 'RewardListScreen',
            },
          );
          onPressToRewardList();
        }}
        title={'แลกสำเร็จ!'}
        titlePrimary="ดูรายละเอียดของที่แลก"
        titleSecondary="กลับไปหน้ารางวัล"
        subButtonType="border"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },

  textButton: {
    fontSize: 18,
    fontFamily: font.AnuphanBold,
    color: colors.white,
  },
  button: {
    width: '100%',
    backgroundColor: colors.greenLight,
    borderRadius: 12,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.greenLight,
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
    borderWidth: 1,
    borderColor: colors.grey40,
  },
  textSubButton: {
    fontSize: 18,
    fontFamily: font.AnuphanBold,
    color: colors.fontBlack,
  },
  buttonAddNewAddress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    height: 'auto',
    width: 'auto',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.greenLight,
    borderRadius: 8,
  },
});
