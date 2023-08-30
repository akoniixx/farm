import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalize } from '@rneui/themed';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { useRecoilState, useRecoilValue } from 'recoil';
import { mixpanel } from '../../../mixpanel';
import { font } from '../../assets';
import colors from '../../assets/colors/colors';
import fonts from '../../assets/fonts';
import icons from '../../assets/icons/icons';
import image from '../../assets/images/image';
import { MainButton } from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import RemoveCoupon from '../../components/Modal/RemoveCoupon';
import { DronerCard } from '../../components/Mytask/DronerCard';
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
import {
  getDetailCampaign,
  getPointByFarmerId,
  usedCoupon,
  usedCouponOnline,
} from '../../datasource/PromotionDatasource';
import {
  PayloadCreateTask,
  TaskDatasource,
} from '../../datasource/TaskDatasource';
import { callcenterNumber } from '../../definitions/callCenterNumber';
import { numberWithCommas } from '../../functions/utility';
import { couponState } from '../../recoil/CouponAtom';
import { Switch } from '@rneui/base';
import Counter from '../../components/Counter/Counter';
import { useDebounceValue } from '../../hook/useDebounceValue';
interface CampaignDetail {
  id: string;
  point: number;
  amounts: number;
  minPoint: number;
  pointType: string;
  application?: string;
  receiveType?: string;
  status?: string;
  createAt?: string;
  updateAt?: string;
}

const DetailTaskScreen: React.FC<any> = ({ navigation, route }) => {
  const [isUsePoint, setIsUsePoint] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [myPoint, setMyPoint] = useState(0);
  const [campaignDetail, setCampaignDetail] = useState<CampaignDetail>({
    id: '',
    point: 0,
    amounts: 0,
    minPoint: 0,
    pointType: '',
  });

  // Mock data

  const isSelectDroner = route.params.isSelectDroner;
  const profile = route.params.profile;
  const {
    state: { taskData, locationPrice, calPrice },
    autoBookingContext: { getCalculatePrice, setTaskData },
  } = useAutoBookingContext();
  const {
    authContext: { getProfileAuth },
    state: { user },
  } = useAuth();

  const [coupon, setCoupon] = useRecoilState(couponState);
  const couponInfo = useRecoilValue(couponState);

  const [modalCoupon, setModalCoupon] = useState<boolean>(false);

  const [disableEdit, setDisableEdit] = useState(false);
  const [currentTel] = useState('');
  const [showModalCall, setShowModalCall] = useState(false);
  const [loading, setLoading] = useState(true);
  const debouncePoint = useDebounceValue(currentCount, 1000);

  const [showListPrice, setShowListPrice] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const dateAppointment = moment(taskData.dateAppointment).toISOString();
      const payload: PayloadCreateTask = {
        usePoint: debouncePoint,
        purposeSprayId: taskData.purposeSpray.id,
        cropName: taskData.cropName || '',
        farmAreaAmount: taskData.farmAreaAmount,
        comment: taskData.comment || '',
        couponCode: couponInfo.couponCode || '',
        farmerPlotId: taskData.farmerPlotId,
        dateAppointment,
        createBy: `${user?.firstname} ${user?.lastname}`,
        farmerId: taskData.farmerId,
        preparationBy: taskData.preparationBy,
        status: taskData.status || 'WAIT_RECEIVE',
        targetSpray: taskData.targetSpray,
        taskDronerTemp: isSelectDroner
          ? [
              {
                distance: profile.distance,
                dronerDetail: [JSON.stringify(profile)],
                dronerId: profile.droner_id,
                status: 'WAIT_RECEIVE',
              },
            ]
          : taskData.taskDronerTemp,
        statusRemark: '',
      };
      const res = await TaskDatasource.createTask(payload);
      if (res && res.success) {
        if (!couponInfo.name) {
          mixpanel.track('Tab submit booking');
          setLoading(false);
          await AsyncStorage.setItem('taskId', res.responseData.id);
          navigation.navigate('SlipWaitingScreen', {
            taskId: res.responseData.id,
          });
          setTaskData(initialState.taskData);
        } else {
          if (couponInfo.promotionType === 'ONLINE') {
            usedCouponOnline(couponInfo.id, couponInfo.promotionId)
              .then(async result => {
                mixpanel.track('Tab submit booking');
                setLoading(false);

                await AsyncStorage.setItem('taskId', res.responseData.id);
                navigation.navigate('SlipWaitingScreen', {
                  taskId: res.responseData.id,
                });
                setTaskData(initialState.taskData);
              })
              .catch(err => console.log(err));
          } else {
            usedCoupon(couponInfo.couponCode)
              .then(async result => {
                mixpanel.track('Tab submit booking');
                setLoading(false);

                await AsyncStorage.setItem('taskId', res.responseData.id);
                navigation.navigate('SlipWaitingScreen', {
                  taskId: res.responseData.id,
                });
                setTaskData(initialState.taskData);
              })
              .catch(err => console.log(err));
          }
          setCoupon({
            id: '',
            promotionId: '',
            name: '',
            couponCode: '',
            promotionType: 'ONLINE',
            discountType: 'DISCOUNT',
            discount: 0,
            netPrice: 0,
            err: '',
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getCalculatePoint = useCallback(async () => {
    try {
      await getCalculatePrice({
        farmerPlotId: taskData.farmerPlotId,
        couponCode: taskData.couponCode || '',
        cropName: taskData.cropName || '',
        raiAmount: taskData.farmAreaAmount ? +taskData.farmAreaAmount : 0,
        usePoint: isUsePoint ? debouncePoint : 0,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setDisabled(false);
      setLoading(false);
    }
  }, [
    taskData.farmerPlotId,
    taskData.couponCode,
    taskData.cropName,
    taskData.farmAreaAmount,
    debouncePoint,
    getCalculatePrice,
    isUsePoint,
  ]);
  const getCalculateByCloseSwitch = useCallback(async () => {
    try {
      setLoading(true);
      await getCalculatePrice({
        farmerPlotId: taskData.farmerPlotId,
        couponCode: taskData.couponCode || '',
        cropName: taskData.cropName || '',
        raiAmount: taskData.farmAreaAmount ? +taskData.farmAreaAmount : 0,
        usePoint: 0,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [
    taskData.farmerPlotId,
    taskData.couponCode,
    taskData.cropName,
    taskData.farmAreaAmount,
    getCalculatePrice,
  ]);

  useEffect(() => {
    if (debouncePoint > 0) {
      getCalculatePoint();
    }
  }, [debouncePoint, getCalculatePoint, isUsePoint]);
  useEffect(() => {
    const getInitialData = async () => {
      try {
        await getCalculatePrice({
          farmerPlotId: taskData.farmerPlotId,
          couponCode: taskData.couponCode || '',
          cropName: taskData.cropName || '',
          raiAmount: taskData.farmAreaAmount ? +taskData.farmAreaAmount : 0,
          usePoint: 0,
        });

        setDisableEdit(!!taskData.couponCode);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    const getPointById = async () => {
      try {
        const result = await getPointByFarmerId(user?.id || '');
        const detail = await getDetailCampaign();
        if (detail && detail.length > 0) {
          const campaign = detail.find(
            (el: { pointType: string; application: string }) =>
              el.pointType === 'DISCOUNT_TASK' && el.application === 'FARMER',
          );
          setCampaignDetail(campaign);
        }
        if (result) {
          setMyPoint(result.balance);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getInitialData();
    getProfileAuth();
    getPointById();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const maximumPointCal = useMemo(() => {
    const netPrice = calPrice.priceBefore - calPrice.discountPromotion;
    const amounts = campaignDetail.amounts;
    const point = campaignDetail.point;
    const maxPoint =
      (myPoint / point) * amounts < netPrice
        ? myPoint
        : (netPrice * point) / amounts;

    return maxPoint;
  }, [
    myPoint,
    campaignDetail.amounts,
    campaignDetail.point,
    calPrice.priceBefore,
    calPrice.discountPromotion,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      contentContainerStyle={{ flex: 1 }}
      style={[{ flex: 1 }]}>
      <RemoveCoupon
        show={modalCoupon}
        onMainClick={() => {
          mixpanel.track('TaskBookingScreen_buttonRemoveCoupon_tapped');
          setCoupon({
            id: '',
            promotionId: '',
            promotionType: 'ONLINE',
            couponCode: '',
            name: '',
            discountType: 'DISCOUNT',
            discount: 0,
            netPrice: 0,
            err: '',
          });
          setModalCoupon(false);
        }}
        onClose={() => setModalCoupon(false)}
      />
      <CustomHeader
        title="รายละเอียดการจอง"
        showBackBtn
        onPressBack={() => {
          mixpanel.track('Tab back from booking detail screen');
          navigation.goBack();
        }}
        headerRight={() => {
          return (
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('Tab callcenter from booking detail screen');
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
                  width: 28,
                  height: 28,
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
            paddingHorizontal: normalize(16),
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
                color: colors.fontBlack,
              }}>
              วันและเวลา
            </Text>
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('Tab edit date time');
                navigation.navigate('SelectDateScreen', {
                  isSelectDroner,
                });
              }}
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
            time={taskData?.dateAppointment}
            date={taskData?.dateAppointment}
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
                color: colors.fontBlack,
              }}>
              แปลงเกษตร
            </Text>
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('Tab edit select plot');
                navigation.navigate('SelectPlotScreen', {
                  isSelectDroner,
                });
              }}
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
                color: colors.fontBlack,

                fontFamily: fonts.AnuphanMedium,
              }}>
              เป้าหมายการพ่น
            </Text>
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('Tab edit select target');
                navigation.navigate('SelectTarget', {
                  isSelectDroner,
                });
              }}
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
          {isSelectDroner ? (
            <>
              <DronerCard
                name={profile.firstname + ' ' + profile.lastname}
                profile={profile.image_droner}
                telnumber={profile.telephone_no}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.disable,
                  padding: normalize(10),
                  borderRadius: 16,
                }}>
                <Text style={styles.plot}>อัตราค่าจ้าง</Text>
                <Text style={styles.unitPrice}>
                  {locationPrice.price} บาท/ไร่
                </Text>
              </View>
            </>
          ) : (
            <>
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
            </>
          )}

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
            paddingBottom: '15%',
          }}>
          <View
            style={{
              paddingHorizontal: normalize(16),
            }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: fonts.AnuphanMedium,
                color: colors.fontBlack,
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
          <TouchableOpacity
            onPress={() => {
              mixpanel.track('TaskBookingScreen_buttonSelectCoupon_tapped', {
                changeTo: 'UseCouponScreen',
              });
              navigation.navigate('UseCouponScreen', {
                plantName: taskData.plantName,
                purposeSprayName: taskData.purposeSpray.name,
                farmAreaAmount: taskData.farmAreaAmount,
                province: taskData.plotArea?.provinceName,
                price: calPrice.netPrice,
                farmerPlotId: taskData.farmerPlotId,
                cropName: taskData.cropName || '',
                raiAmount: taskData.farmAreaAmount
                  ? +taskData.farmAreaAmount
                  : 0,
              });
            }}>
            <View
              style={{
                paddingHorizontal: normalize(16),
                marginTop: 16,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.discountOrange}
                  style={{ width: 20, height: 20, marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.fontBlack,
                    fontFamily: fonts.SarabunMedium,
                    lineHeight: 28,
                  }}>
                  {!couponInfo.name ? 'เลือกคูปองส่วนลด' : couponInfo.name}
                </Text>
                {!couponInfo.name ? (
                  <></>
                ) : (
                  <TouchableOpacity
                    style={{
                      marginLeft: normalize(10),
                    }}
                    onPress={() => setModalCoupon(true)}>
                    <Image
                      source={image.removecoupon}
                      style={{
                        width: normalize(54),
                        height: normalize(26),
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <Image
                source={icons.arrowRigth}
                style={{
                  width: normalize(10),
                  height: normalize(20),
                }}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.containerPoint}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={icons.ICKPoint}
                style={{ width: 24, height: 24 }}
              />
              <Text
                style={{
                  fontSize: 18,
                  marginLeft: 8,
                  fontFamily: fonts.SarabunMedium,
                }}>
                ใช้แต้มแลกส่วนลด
              </Text>
            </View>

            <Switch
              value={isUsePoint}
              disabled={
                myPoint < campaignDetail.minPoint ||
                calPrice.priceBefore - calPrice.discountPromotion <= 0
              }
              color={colors.greenLight}
              onChange={() => {
                setIsUsePoint(prev => {
                  if (!prev) {
                    setCurrentCount(campaignDetail.minPoint);
                  } else {
                    getCalculateByCloseSwitch();
                    setCurrentCount(0);
                  }
                  return !prev;
                });
              }}
            />
          </View>
          {isUsePoint && (
            <>
              <View style={styles.containerCounter}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: fonts.SarabunMedium,
                    }}>
                    แต้มที่ใช้แลก
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.grey60,
                    }}>{`${campaignDetail.point} แต้ม = ${campaignDetail.amounts} บาท`}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Counter
                    minimum={campaignDetail.minPoint}
                    maximum={isNaN(maximumPointCal) ? 0 : maximumPointCal}
                    currentCount={currentCount}
                    setCurrentCount={setCurrentCount}
                    setDisabled={setDisabled}
                  />
                </View>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  marginTop: 8,
                  justifyContent: 'center',
                }}>
                <Image
                  source={icons.multiArrow}
                  style={{
                    width: 18,
                    height: 18,
                  }}
                />
              </View>
              <View style={styles.containerPointDiscount}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.SarabunMedium,
                  }}>
                  ส่วนลดที่ได้รับ
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.SarabunMedium,
                    color: colors.primary,
                  }}>{`-${
                  numberWithCommas(calPrice.discountPoint.toString(), true) || 0
                } บาท`}</Text>
              </View>
            </>
          )}

          <View style={styles.containerCurrentPoint}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.SarabunLight,
              }}>
              แต้มสะสมคงเหลือ
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fonts.SarabunMedium,
              }}>{`${
              numberWithCommas(myPoint.toString(), true) || 0
            } แต้ม`}</Text>
          </View>
          {myPoint < campaignDetail.minPoint && (
            <View
              style={{
                marginTop: 8,
                paddingHorizontal: 16,
                flexDirection: 'row',
              }}>
              <Image
                source={icons.dangercirclered}
                style={{
                  marginTop: 4,
                  width: 18,
                  height: 18,
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  color: colors.error,
                  alignSelf: 'flex-start',
                  paddingRight: 16,
                }}>
                แต้มสะสมของท่านไม่ถึงขั้นต่ำ {campaignDetail.minPoint} แต้ม
                ในการเปิดใช้แต้มแลกส่วนลด
              </Text>
            </View>
          )}
          {calPrice?.priceBefore - calPrice.discountPromotion <= 0 && (
            <View
              style={{
                marginTop: 8,
                paddingHorizontal: 16,
                flexDirection: 'row',
              }}>
              <Image
                source={icons.dangercirclered}
                style={{
                  marginTop: 4,
                  width: 18,
                  height: 18,
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  color: colors.error,
                  alignSelf: 'flex-start',
                  paddingRight: 24,
                }}>
                ไม่สามารถเพิ่มจำนวนแต้มที่ใช้ได้ เนื่องจาก
                ค่าบริการรวมหลังหักส่วนลดอื่นๆ เหลือ 0 บาท
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            height: 40,
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
                {`${numberWithCommas(
                  calPrice.priceBefore.toString(),
                  true,
                )} บาท`}
              </Text>
            </View>
            {couponInfo.name != '' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 16,
                }}>
                <Text
                  style={{
                    color: colors.greenDark,
                    fontSize: 18,
                    fontFamily: fonts.SarabunMedium,
                  }}>
                  ส่วนลดคูปอง
                </Text>
                <Text
                  style={{
                    color: colors.greenDark,
                    fontSize: 18,
                    fontFamily: fonts.SarabunMedium,
                  }}>
                  {`-${numberWithCommas(
                    couponInfo.discount.toString(),
                    true,
                  )} บาท`}
                </Text>
              </View>
            )}

            {calPrice.discountPromotion !== 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 16,
                }}>
                <Text
                  style={{
                    color: colors.greenDark,
                    fontSize: 18,
                    fontFamily: fonts.SarabunMedium,
                  }}>
                  ส่วนลดโปรโมชั่น
                </Text>
                <Text
                  style={{
                    color: colors.greenDark,
                    fontSize: 18,
                    fontFamily: fonts.SarabunMedium,
                  }}>
                  {`-${numberWithCommas(
                    calPrice.discountPromotion.toString(),
                    true,
                  )} บาท`}
                </Text>
              </View>
            )}
            {isUsePoint && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 16,
                }}>
                <Text
                  style={{
                    color: colors.greenDark,
                    fontSize: 18,
                    fontFamily: fonts.SarabunMedium,
                  }}>
                  ส่วนลดแต้ม
                </Text>
                <Text
                  style={{
                    color: colors.greenDark,
                    fontSize: 18,
                    fontFamily: fonts.SarabunMedium,
                  }}>
                  {`-${numberWithCommas(
                    calPrice.discountPoint.toString(),
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
            paddingTop: normalize(16),
          }}>
          <Text
            style={{
              fontSize: 18,
              color: colors.fontBlack,

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
              <View
                style={{
                  justifyContent: 'flex-end',
                  marginRight: 8,
                }}>
                <Text
                  style={{
                    color: colors.greenLight,
                    fontSize: 18,
                    fontFamily: fonts.AnuphanMedium,
                  }}>
                  {`${numberWithCommas(
                    (calPrice.netPrice - couponInfo.discount).toString(),
                    true,
                  )} บาท`}
                </Text>
                {+calPrice.netPrice !== +calPrice.priceBefore && (
                  <Text
                    style={{
                      color: colors.disable,
                      fontSize: 16,
                      fontFamily: fonts.AnuphanMedium,
                      textAlign: 'right',
                      textDecorationLine: 'line-through',
                    }}>
                    {calPrice.priceBefore}
                  </Text>
                )}
              </View>

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
            disable={disabled}
            label="ยืนยันการจอง"
            onPress={onSubmit}
            color={colors.greenLight}
            style={{
              height: 54,
            }}
          />
        </View>
      </View>

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
              height: 50,
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
    </KeyboardAvoidingView>
  );
};

export default DetailTaskScreen;

const styles = StyleSheet.create({
  statusNo: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(14),
    color: '#8D96A0',
  },
  price: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(20),
    color: '#2EC46D',
  },
  plant: {
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(20),
    color: colors.fontBlack,
  },
  plot: {
    fontFamily: fonts.SarabunLight,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: fonts.SarabunMedium,
    fontSize: normalize(19),
  },
  unitPrice: {
    fontFamily: fonts.SarabunLight,
    fontSize: normalize(20),
    color: '#2EC46D',
  },
  containerPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  containerCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.yellowBorder,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.yellowBg,
    minHeight: 80,
    marginTop: 16,
  },
  containerPointDiscount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.primaryContainer,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primary40,
    borderRadius: 8,
  },
  containerCurrentPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 8,
  },
});
