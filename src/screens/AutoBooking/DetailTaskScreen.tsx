import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalize } from '@rneui/themed';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { font } from '../../assets';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';
import icons from '../../assets/icons/icons';
import image from '../../assets/images/image';
import { MainButton } from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import InputWithSuffix from '../../components/InputText/InputWithSuffix';
import {
  DateTimeDetail,
  PlotDetail,
  TargetSpray,
} from '../../components/TaskDetail/TaskDetail';
import { useAuth } from '../../contexts/AuthContext';
import {
  initialState,
  useAutoBookingContext,
} from '../../contexts/AutoBookingContext';
import { checkCouponOffline } from '../../datasource/PromotionDatasource';
import {
  PayloadCreateTask,
  TaskDatasource,
} from '../../datasource/TaskDatasource';
import { callcenterNumber } from '../../definitions/callCenterNumber';
import { numberWithCommas } from '../../functions/utility';
import { momentExtend } from '../../utils/moment-buddha-year';

const DetailTaskScreen: React.FC<any> = ({ navigation, route }) => {
  const {
    state: { taskData, locationPrice, calPrice },
    autoBookingContext: { getCalculatePrice, setTaskData },
  } = useAutoBookingContext();
  const {
    authContext: { getProfileAuth },
    state: { user },
  } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponCodeError, setCouponCodeError] = useState('');
  const [disableEdit, setDisableEdit] = useState(false);
  const [currentTel, setCurrentTel] = useState('');
  const [showModalCall, setShowModalCall] = useState(false);
  const [loading, setLoading] = useState(true);
  const checkCoupon = async () => {
    try {
      const res = await checkCouponOffline(couponCode);
      if (res && res.data === null) {
        setCouponCodeError(res.userMessage);
      }
      if (res && res.canUsed) {
        setTaskData(prev => ({
          ...prev,
          couponCode: couponCode,
        }));
        setDisableEdit(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [showListPrice, setShowListPrice] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const payload: PayloadCreateTask = {
        purposeSprayId: taskData.purposeSpray.id,
        cropName: taskData.cropName || '',
        farmAreaAmount: taskData.farmAreaAmount,
        comment: taskData.comment || '',
        couponCode: taskData.couponCode || '',
        farmerPlotId: taskData.farmerPlotId,
        dateAppointment: moment(taskData.dateAppointment).toISOString(),
        createBy: `${user?.firstname} ${user?.lastname}`,
        farmerId: taskData.farmerId,
        preparationBy: taskData.preparationBy,
        status: taskData.status || 'WAIT_RECEIVE',
        targetSpray: taskData.targetSpray,
        taskDronerTemp: taskData.taskDronerTemp,
        statusRemark: '',
      };
      const res = await TaskDatasource.createTask(payload);

      if (res && res.success) {
        setLoading(false);
        await AsyncStorage.setItem(
          'endTime',
          moment().add(30, 'minutes').toISOString(),
        );
        await AsyncStorage.setItem('taskId', res.responseData.id);
        navigation.navigate('SlipWaitingScreen', {
          taskId: res.responseData.id,
        });
        setTaskData(initialState.taskData);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const getInitialData = async () => {
      try {
        await getCalculatePrice({
          farmerPlotId: taskData.farmerPlotId,
          couponCode: taskData.couponCode || '',
          cropName: taskData.cropName || '',
          raiAmount: taskData.farmAreaAmount ? +taskData.farmAreaAmount : 0,
        });
        setCouponCode(taskData.couponCode || '');
        setDisableEdit(!!taskData.couponCode);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    getInitialData();
    getProfileAuth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskData.couponCode]);
  return (
    <View style={[{ flex: 1 }]}>
      <CustomHeader
        title="รายละเอียดการจอง"
        showBackBtn
        onPressBack={() => navigation.goBack()}
        headerRight={() => {
          return (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${callcenterNumber}`);
              }}
              style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                marginTop: 4,
              }}>
              <Image
                source={icons.callCenter}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
      <ScrollView>
        {/* taskNo  */}
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: normalize(16),
            alignItems: 'center',
            paddingVertical: normalize(10),
          }}>
          <Text
            style={{
              fontFamily: fonts.AnuphanMedium,
              fontSize: 14,
              color: colors.grey40,
            }}>
            #TK20221018TH-0000003
          </Text>
          <View
            style={{
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 18,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.orangeLight,
            }}>
            <Text
              style={{
                fontFamily: fonts.AnuphanMedium,
                fontSize: 16,
                color: colors.white,
              }}>
              รอเริ่มงาน
            </Text>
          </View>
        </View> */}
        <View
          style={{
            backgroundColor: 'white',
            paddingVertical: normalize(10),
          }}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: normalize(16),
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.AnuphanMedium,
              }}>
              วันและเวลา
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SelectDateScreen')}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.blueMedium,
                }}>
                แก้ไข
              </Text>
              <Image
                source={icons.arrowRightBlue}
                style={{
                  width: 16,
                  height: 16,
                }}
              />
            </TouchableOpacity>
          </View>
          <DateTimeDetail
            time={moment(taskData?.dateAppointment).format('HH:mm น.')}
            date={momentExtend.toBuddhistYear(taskData?.dateAppointment)}
            note={taskData?.comment || '-'}
          />
        </View>

        <View
          style={{
            paddingHorizontal: normalize(16),
            backgroundColor: 'white',
            marginTop: 10,
            paddingVertical: normalize(10),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.AnuphanMedium,
              }}>
              แปลงเกษตร
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SelectPlotScreen')}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.blueMedium,
                }}>
                แก้ไข
              </Text>
              <Image
                source={icons.arrowRightBlue}
                style={{
                  width: 16,
                  height: 16,
                }}
              />
            </TouchableOpacity>
          </View>

          <PlotDetail
            onPressMap={() => {
              if (
                taskData?.plotArea &&
                taskData.plotArea?.lat &&
                taskData.plotArea?.long
              ) {
                navigation.navigate('ViewMapScreen', {
                  location: {
                    latitude: taskData.plotArea?.lat,
                    longitude: taskData.plotArea?.long,
                  },
                  plotName: taskData?.plotName || 'แปลงเกษตร',
                });
              }
            }}
            plotName={taskData?.plotName || 'แปลงเกษตร'}
            plotAmout={+taskData.farmAreaAmount || 0}
            plant={taskData?.plantName || '-'}
            location={taskData?.locationName || '-'}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.AnuphanMedium,
              }}>
              เป้าหมายการพ่น
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SelectTarget')}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.blueMedium,
                }}>
                แก้ไข
              </Text>
              <Image
                source={icons.arrowRightBlue}
                style={{
                  width: 16,
                  height: 16,
                }}
              />
            </TouchableOpacity>
          </View>
          <TargetSpray
            periodSpray={taskData?.purposeSpray.name || '-'}
            target={taskData?.targetSpray.join(' , ') || '-'}
            preparationBy={taskData?.preparationBy}
          />
        </View>
        <View
          style={{
            paddingHorizontal: normalize(16),
            backgroundColor: 'white',
            marginTop: 10,
            paddingVertical: normalize(16),
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: fonts.AnuphanMedium,
            }}>
            นักบินโดรน
          </Text>
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 10,
              marginTop: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: colors.greyDivider,
                  borderRadius: 24,
                  padding: 6,
                }}>
                <Image
                  source={image.drone}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 24,
                  }}
                />
              </View>
              <View
                style={{
                  marginLeft: 16,
                }}>
                <Text
                  style={{
                    color: colors.fontBlack,
                    fontFamily: fonts.SarabunMedium,
                    fontSize: 18,
                  }}>
                  ระบบค้นหาอัตโนมัติ
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: colors.grey40,
                    }}>
                    คัดสรรนักบินคุณภาพ
                  </Text>
                </View>
              </View>
            </View>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.AnuphanMedium,
                color: colors.greenLight,
              }}>
              {`${numberWithCommas(locationPrice.price, true)} บาท/ ไร่`}
            </Text>
          </View>
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 16,
              borderWidth: 1,
              borderColor: colors.greyDivider,
              padding: 10,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.SarabunLight,
              }}>
              อัตราค่าจ้าง
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.AnuphanMedium,
                color: colors.greenLight,
              }}>
              50 บาท/ ไร่
            </Text>
          </View> */}
        </View>
        <View
          style={{
            backgroundColor: 'white',
            marginTop: 10,
            paddingVertical: normalize(16),
          }}>
          <View
            style={{
              paddingHorizontal: normalize(16),
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.AnuphanMedium,
              }}>
              วิธีการชำระเงิน
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 16,
              }}>
              <Image
                source={icons.cash}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  marginLeft: 8,
                  fontFamily: fonts.SarabunMedium,
                }}>
                เงินสด
              </Text>
            </View>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.greyDivider,
              marginLeft: normalize(16),
              marginTop: 16,
            }}
          />
          <View
            style={{
              paddingHorizontal: normalize(16),
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <Image
              source={icons.discountOrange}
              style={{ width: 20, height: 20, marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 18,
                fontFamily: fonts.SarabunMedium,
              }}>
              คูปองส่วนลด
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: normalize(16),
            }}>
            <InputWithSuffix
              onChangeText={text => {
                setCouponCode(text);
                setCouponCodeError('');
              }}
              editable={!disableEdit}
              allowClear={!disableEdit}
              placeholder="ระบุรหัสคูปองที่นี่"
              styleContainer={{
                backgroundColor: '#F2F3F4',
                borderWidth: 0,
              }}
              value={couponCode}
              suffixComponent={
                <TouchableOpacity
                  onPress={async () => {
                    if (disableEdit) {
                      return setDisableEdit(false);
                    }
                    if (couponCode.length > 0) {
                      await checkCoupon();
                    }
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
                    {disableEdit ? 'แก้ไข' : 'ยืนยัน'}
                  </Text>
                </TouchableOpacity>
              }
            />
            {couponCodeError.length > 0 && (
              <Text
                style={{
                  color: colors.error,
                  fontSize: 16,
                  marginTop: 8,
                  fontFamily: fonts.SarabunLight,
                }}>
                ไม่มีรหัสคูปองดังกล่าว โปรดตรวจสอบหมายเลขคูปอง ของท่านอีกครั้ง
              </Text>
            )}
          </View>
        </View>
        <View
          style={{
            height: 50,
          }}
        />
      </ScrollView>
      <View
        style={{
          backgroundColor: colors.white,
          paddingTop: 16,
          paddingBottom: 32,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.06,
          shadowRadius: 1.62,
          elevation: 14,
        }}>
        {showListPrice && (
          <View
            style={{
              paddingHorizontal: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <Text
                style={{
                  color: colors.grey40,
                  fontSize: 18,
                  fontFamily: fonts.SarabunLight,
                }}>
                ราคาต่อไร่
              </Text>
              <Text
                style={{
                  color: colors.grey40,
                  fontSize: 18,
                  fontFamily: fonts.SarabunLight,
                }}>
                {` ${numberWithCommas(
                  calPrice.pricePerRai.toString(),
                  true,
                )} บาท/ไร่`}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 16,
                borderBottomWidth: calPrice.priceCouponDiscount > 0 ? 0 : 1,
                marginBottom: calPrice.priceCouponDiscount > 0 ? 0 : 16,
                borderBottomColor: colors.greyDivider,
              }}>
              <Text
                style={{
                  color: colors.grey40,
                  fontSize: 18,
                  fontFamily: fonts.SarabunLight,
                }}>
                ราคารวม
              </Text>
              <Text
                style={{
                  color: colors.grey40,
                  fontSize: 18,
                  fontFamily: fonts.SarabunLight,
                }}>
                {`${numberWithCommas(calPrice.netPrice.toString(), true)} บาท`}
              </Text>
            </View>
            {calPrice && calPrice.priceCouponDiscount > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  marginBottom: 16,
                  borderBottomColor: colors.greyDivider,
                }}>
                <Text
                  style={{
                    color: colors.greenDark,
                    fontSize: 18,
                    fontFamily: fonts.SarabunMedium,
                  }}>
                  ส่วนลด
                </Text>
                <Text
                  style={{
                    color: colors.greenDark,
                    fontSize: 18,
                    fontFamily: fonts.SarabunMedium,
                  }}>
                  {`-${numberWithCommas(
                    calPrice.priceCouponDiscount.toString(),
                    true,
                  )} บาท`}
                </Text>
              </View>
            )}
          </View>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: fonts.AnuphanMedium,
            }}>
            รวมค่าบริการ
          </Text>
          <View>
            <TouchableOpacity
              onPress={() => {
                setShowListPrice(!showListPrice);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.greenLight,
                  fontSize: 18,
                  fontFamily: fonts.AnuphanMedium,
                  marginRight: 8,
                }}>
                {`${numberWithCommas(calPrice.netPrice.toString(), true)} บาท`}
              </Text>
              <Image
                source={icons.arrowUpBold}
                style={{
                  width: 16,
                  height: 16,
                  transform: [{ rotate: showListPrice ? '0deg' : '180deg' }],
                }}
              />
            </TouchableOpacity>
            {calPrice.priceCouponDiscount > 0 && (
              <Text
                style={{
                  textDecorationStyle: 'solid',
                  textDecorationLine: 'line-through',
                  fontFamily: fonts.AnuphanLight,
                  color: colors.grey40,
                  textAlign: 'right',
                }}>
                {calPrice.priceBefore}
              </Text>
            )}
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderBottomColor: colors.greyDivider,
            borderBottomWidth: 1,
          }}>
          <MainButton
            label="ยืนยันการจอง"
            onPress={onSubmit}
            color={colors.greenLight}
            style={{
              height: 54,
            }}
          />
        </View>
      </View>
      {/* tel footer */}
      {/* <View
        style={{
          backgroundColor: colors.white,
          paddingTop: 16,
          height: 120,

          paddingHorizontal: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.06,
          shadowRadius: 1.62,
          elevation: 14,
        }}>
        <TouchableOpacity
          onPress={async () => {
            const tel = await SheetManager.show('sheet-select-calling');
            // eslint-disable-next-line no-extra-boolean-cast
            if (!!tel) {
              setCurrentTel(tel as string);
              setShowModalCall(true);
            } else {
              setShowModalCall(false);
            }
          }}
          style={{
            backgroundColor: colors.blueBorder,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.blueBorder,
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
            marginTop: 8,
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
                marginRight: 16,
              }}
              source={icons.callingWhite}
            />
            <Text
              style={{
                fontFamily: font.AnuphanMedium,
                color: colors.white,
                fontSize: 20,
              }}>
              โทรหาเจ้าหน้าที่/นักบินโดรน
            </Text>
          </View>
        </TouchableOpacity>
      </View> */}
      <Modal animationType="fade" transparent={true} visible={showModalCall}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingBottom: 32,
          }}>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${currentTel}`);
            }}
            style={{
              height: 60,
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: colors.white,
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: '100%',
              borderRadius: 12,
              marginBottom: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 16,
                }}
                source={icons.callBlue}
              />
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  color: '#007AFF',
                  fontSize: 20,
                }}>
                {currentTel}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowModalCall(false);
            }}
            style={{
              height: 60,
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: colors.white,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              borderRadius: 12,
              marginBottom: 8,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  color: '#007AFF',
                  fontSize: 20,
                }}>
                ยกเลิก
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </View>
  );
};

export default DetailTaskScreen;
