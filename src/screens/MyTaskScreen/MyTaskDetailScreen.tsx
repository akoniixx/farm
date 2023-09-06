import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons, image } from '../../assets';
import fonts from '../../assets/fonts';
import { MainButton } from '../../components/Button/MainButton';
import CustomHeader from '../../components/CustomHeader';
import { DronerCard } from '../../components/Mytask/DronerCard';
import { MyTaskDateTimeDetail } from '../../components/Mytask/MyTaskDetail';
import {
  PlotDetail,
  TargetSpray,
} from '../../components/TaskDetail/TaskDetail';
import { MyJobDatasource } from '../../datasource/MyJobDatasource';
import { normalize } from '../../functions/Normalize';
import { getStatusToText, numberWithCommas } from '../../functions/utility';
import Banner from '../../components/Banner/Banner';
import Text from '../../components/Text/Text';

interface Campaign {
  id: string;
  taskId: string;
  campaignId: string;
  campaignName: string;
  application: string;
  dronerId: string | null;
  farmerId: string | null;
  pointPerRai: number;
  receivePoint: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
const MyTaskDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const [openReview, setOpenReview] = useState<boolean>(false);
  const [toggleModalSuccess, setToggleModalSuccess] = useState<boolean>(false);
  const task = route.params.task;
  const [maxRatting, setMaxRatting] = useState<Array<number>>([1, 2, 3, 4, 5]);
  const [pilotEtiquette, setPilotEtiquette] = useState<number>(0);
  const [punctuality, setPunctuality] = useState<number>(0);
  const [sprayExpertise, setSprayExpertise] = useState<number>(0);
  const [commentReview, setCommentReview] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showGetPoint, setShowGetPoint] = useState<boolean>(false);
  const [taskPointDetail, setTaskPointDetail] = useState<Campaign | null>(null);
  const [disableReview, setDisableReview] = useState<boolean>(true);
  const starImgFilled = icons.starfill;
  const starImgCorner = icons.starCorner;

  const getLabelBotton = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'โทรหาเจ้าหน้าที่/นักบินโดรน';
      case 'WAIT_START':
        return 'โทรหาเจ้าหน้าที่/นักบินโดรน';
      case 'WAIT_REVIEW':
        return 'รีวิวงาน';
      case 'DONE':
        return 'กลับหน้าหลัก';
    }
  };

  useEffect(() => {
    if (pilotEtiquette !== 0 && punctuality !== 0 && sprayExpertise !== 0) {
      setDisableReview(false);
    }
  }, [pilotEtiquette, punctuality, sprayExpertise]);

  const getReceivePoint = async () => {
    const result: Campaign[] = await MyJobDatasource.getReceivePoint(
      task.task_id,
    );
    if (result) {
      const findFarmer = result.find(el => el.application === 'FARMER');
      if (findFarmer) {
        setTaskPointDetail(findFarmer);
      }
    }
  };
  const submitReview = () => {
    setDisableReview(true);
    setLoading(true);
    MyJobDatasource.submitReview(
      task.task_id,
      'Yes',
      pilotEtiquette,
      punctuality,
      sprayExpertise,
      commentReview,
      task.farmer_fname + ' ' + task.farmer_lname,
    )
      .then(res => {
        setOpenReview(false);

        setTimeout(() => {
          setToggleModalSuccess(true);
        }, 500);
      })
      .finally(() => setLoading(false));
  };

  const submitReviewSuccess = async () => {
    setToggleModalSuccess(false);
    await getReceivePoint().then(() => {
      setTimeout(() => {
        setShowGetPoint(true);
      }, 500);
    });
  };
  const onCloseGetPoint = () => {
    setShowGetPoint(false);
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  const checkReview = () => {
    return pilotEtiquette == 0 || punctuality == 0 || sprayExpertise == 0;
  };
  const isShowGetPoint = useMemo(() => {
    const isShow =
      task.status === 'WAIT_START' ||
      task.status === 'IN_PROGRESS' ||
      task.status === 'WAIT_REVIEW';
    return isShow;
  }, [task.status]);

  const { isDone, isWaitReview } = useMemo(() => {
    const isWaitReview = task.status === 'WAIT_REVIEW';
    const isDone = task.status === 'DONE';
    return {
      isDone,
      isWaitReview,
    };
  }, [task.status]);

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        title="รายละเอียดงาน"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal={false}>
        {isDone || isWaitReview ? (
          <ImageBackground
            source={isDone ? image.bgDone : image.bgWaitReview}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: normalize(10),
              paddingVertical: normalize(10),
            }}>
            <Text
              style={{
                fontFamily: font.AnuphanMedium,
                color: colors.white,
                fontSize: normalize(14),
              }}>
              {'#' + task.task_no}
            </Text>
            <View
              style={{
                backgroundColor: getStatusToText(task.status)?.bgcolor,
                borderColor: getStatusToText(task.status)?.border,
                borderWidth: 1,
                borderRadius: 18,
                paddingVertical: normalize(5),
                paddingHorizontal: normalize(10),
              }}>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(16),
                  color: getStatusToText(task.status)?.color,
                }}>
                {getStatusToText(task.status)?.label}
              </Text>
            </View>
          </ImageBackground>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: normalize(10),
              paddingVertical: normalize(10),
            }}>
            <Text
              style={{
                fontFamily: font.AnuphanMedium,
                color: colors.gray,
                fontSize: normalize(14),
              }}>
              {'#' + task.task_no}
            </Text>
            <View
              style={{
                backgroundColor: getStatusToText(task.status)?.bgcolor,
                borderColor: getStatusToText(task.status)?.border,
                borderWidth: 1,
                borderRadius: 18,
                paddingVertical: normalize(5),
                paddingHorizontal: normalize(10),
              }}>
              <Text
                style={{
                  fontFamily: fonts.AnuphanMedium,
                  fontSize: normalize(16),
                  color: getStatusToText(task.status)?.color,
                }}>
                {getStatusToText(task.status)?.label}
              </Text>
            </View>
          </View>
        )}

        {isShowGetPoint && (
          <>
            <Banner />
          </>
        )}
        <View style={{ padding: normalize(16), backgroundColor: 'white' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: normalize(10),
            }}>
            <Text style={styles.plant}>
              {task.plant_name + ' | ' + task.purpose_spray_name}
            </Text>
            <Text style={styles.price}>
              {numberWithCommas(task.total_price, true) + ' ' + 'บาท'}
            </Text>
          </View>

          <MyTaskDateTimeDetail
            date={task.date_appointment}
            time={task.date_appointment}
            note={task.comment}
          />
        </View>

        <View
          style={{
            padding: normalize(16),
            backgroundColor: 'white',
            marginTop: normalize(10),
          }}>
          <Text style={styles.label}>แปลงเกษตร</Text>
          <PlotDetail
            plotName={task.plot_name}
            plotAmout={task.rai_amount}
            plant={task.plant_name}
            location={task.location_name}
          />
          <View style={{ marginTop: normalize(16) }}>
            <Text style={styles.label}>เป้าหมายการพ่น</Text>
            <TargetSpray
              target={task.target_spray.join(' , ') || '-'}
              periodSpray={task.purpose_spray_name}
              preparationBy={task.preparation_by}
            />
          </View>
        </View>
        {task.status === 'CANCELED' ? (
          <></>
        ) : (
          <View
            style={{
              padding: normalize(16),
              backgroundColor: 'white',
              marginTop: normalize(10),
            }}>
            <Text style={styles.label}>นักบินโดรน</Text>
            <DronerCard
              name={task.droner.firstname + ' ' + task.droner.lastname}
              profile={task.droner.image_profile}
              telnumber={task.droner.telephone_no}
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
              <Text style={styles.unitPrice}>{task.unit_price} บาท/ไร่</Text>
            </View>
          </View>
        )}

        <View
          style={{
            padding: normalize(16),
            backgroundColor: 'white',
            marginTop: normalize(10),
          }}>
          <Text style={styles.label}>การชำระเงิน</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: normalize(10),
            }}>
            <Image
              source={icons.cash}
              style={{
                width: normalize(24),
                height: normalize(24),
                marginRight: normalize(10),
              }}
            />
            <Text style={[styles.label, { fontSize: normalize(18) }]}>
              เงินสด
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: normalize(16),
            backgroundColor: 'white',
            marginTop: normalize(10),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.totalPrice}>ราคาต่อไร่</Text>
            <Text style={styles.totalPrice}>{task.unit_price} บาท/ไร่</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.totalPrice}>ราคารวม</Text>
            <Text style={styles.totalPrice}>
              {numberWithCommas(task.price, true)} บาท
            </Text>
          </View>
          {task.discount_coupon !== '0' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: normalize(18),
                  fontFamily: font.AnuphanMedium,
                  color: '#2EC46D',
                }}>
                ส่วนลดคูปอง
              </Text>
              <Text
                style={{
                  fontSize: normalize(18),
                  fontFamily: font.AnuphanMedium,
                  color: '#2EC46D',
                }}>
                -{numberWithCommas(task.discount_coupon, true)} บาท
              </Text>
            </View>
          )}

          {task.discount_promotion !== '0' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: normalize(18),
                  fontFamily: font.AnuphanMedium,
                  color: '#2EC46D',
                }}>
                ส่วนลดโปรโมชั่น
              </Text>
              <Text
                style={{
                  fontSize: normalize(18),
                  fontFamily: font.AnuphanMedium,
                  color: '#2EC46D',
                }}>
                -{numberWithCommas(task.discount_promotion, true)} บาท
              </Text>
            </View>
          )}
          {+task?.discount_campaign_point > 0 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: normalize(18),
                  fontFamily: font.AnuphanMedium,
                  color: '#2EC46D',
                }}>
                ส่วนลดแต้ม
              </Text>
              <Text
                style={{
                  fontSize: normalize(18),
                  fontFamily: font.AnuphanMedium,
                  color: '#2EC46D',
                }}>
                -{numberWithCommas(task.discount_campaign_point, true)} บาท
              </Text>
            </View>
          )}

          <View
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              borderColor: colors.disable,
              marginVertical: normalize(20),
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 8,
            }}>
            <Text
              style={{
                fontSize: normalize(18),
                fontFamily: font.AnuphanMedium,
                color: colors.fontBlack,
              }}>
              รวมค่าบริการ
            </Text>
            <View
              style={{
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  fontSize: normalize(20),
                  fontFamily: font.AnuphanMedium,
                  color: '#2EC46D',
                }}>
                {numberWithCommas(task.total_price, true)} บาท
              </Text>
              {/* {+task.price !== +task.total_price && (
                <Text
                  style={{
                    color: colors.disable,
                    fontSize: 16,
                    fontFamily: fonts.AnuphanMedium,
                    textAlign: 'right',
                    textDecorationLine: 'line-through',
                  }}>
                  {task.price}
                </Text>
              )} */}
            </View>
          </View>
        </View>
      </ScrollView>
      {task.status === 'IN_PROGRESS' || task.status === 'WAIT_START' ? (
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
          <View
            style={{
              backgroundColor: 'white',
              paddingHorizontal: normalize(16),
              paddingVertical: normalize(15),
            }}>
            <TouchableOpacity
              style={styles.button}
              /*  disabled={statusDelay === 'WAIT_APPROVE'} */
              onPress={() =>
                SheetManager.show('CallingSheet', {
                  payload: { tel: task.droner.telephone_no },
                })
              }>
              <Image
                source={icons.telephon}
                style={{ width: normalize(20), height: normalize(20) }}
              />
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  fontSize: normalize(20),
                  color: colors.white,
                  marginLeft: 10,
                }}>
                {getLabelBotton(task.status)}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : task.status === 'WAIT_REVIEW' ? (
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: 'white' }}>
          <View
            style={{
              backgroundColor: 'white',
              paddingHorizontal: normalize(16),
              paddingVertical: normalize(15),
            }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#2EC46D' }]}
              /*  disabled={statusDelay === 'WAIT_APPROVE'} */
              onPress={() => setOpenReview(true)}>
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  fontSize: normalize(20),
                  color: colors.white,
                  marginLeft: 10,
                }}>
                {getLabelBotton(task.status)}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : (
        <></>
      )}
      <Modal transparent={true} visible={openReview}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                paddingHorizontal: '5%',
              }}>
              <View
                style={{
                  padding: normalize(20),
                  backgroundColor: colors.white,
                  display: 'flex',
                  justifyContent: 'center',
                  borderRadius: normalize(8),
                }}>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  horizontal={false}
                  showsVerticalScrollIndicator={false}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                    }}>
                    <Text
                      style={{
                        fontFamily: font.AnuphanBold,
                        fontSize: normalize(26),
                        color: 'black',
                      }}>
                      รีวิวงาน
                    </Text>
                    <Text
                      style={{
                        fontFamily: font.SarabunBold,
                        fontSize: normalize(18),
                        color: '#5F6872',
                      }}>
                      ให้คะแนนนักบิน
                    </Text>
                  </View>
                  <View style={{ marginTop: '5%' }}>
                    <Text
                      style={{
                        fontFamily: font.AnuphanMedium,
                        fontSize: normalize(20),
                        color: '#1F8449',
                      }}>
                      1. มารยาทนักบิน
                    </Text>
                    <View style={styles.reviewBar}>
                      {maxRatting.map(item => {
                        return (
                          <TouchableOpacity
                            activeOpacity={0.9}
                            key={item}
                            onPress={() => setPilotEtiquette(item)}>
                            <Image
                              style={styles.star}
                              source={
                                item <= pilotEtiquette
                                  ? starImgFilled
                                  : starImgCorner
                              }
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontFamily: font.SarabunMedium,
                          fontSize: normalize(18),
                          color: '#8D96A0',
                        }}>
                        ไม่ดี
                      </Text>
                      <Text
                        style={{
                          fontFamily: font.SarabunMedium,
                          fontSize: normalize(18),
                          color: '#8D96A0',
                        }}>
                        ดี
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginTop: '5%' }}>
                    <Text
                      style={{
                        fontFamily: font.AnuphanMedium,
                        fontSize: normalize(20),
                        color: '#1F8449',
                      }}>
                      2. ความตรงเวลา
                    </Text>
                    <View style={styles.reviewBar}>
                      {maxRatting.map((item, key) => {
                        return (
                          <TouchableOpacity
                            activeOpacity={0.9}
                            key={item}
                            onPress={() => setPunctuality(item)}>
                            <Image
                              style={styles.star}
                              source={
                                item <= punctuality
                                  ? starImgFilled
                                  : starImgCorner
                              }
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontFamily: font.SarabunMedium,
                          fontSize: normalize(18),
                          color: '#8D96A0',
                        }}>
                        ไม่ตรงเวลา
                      </Text>
                      <Text
                        style={{
                          fontFamily: font.SarabunMedium,
                          fontSize: normalize(18),
                          color: '#8D96A0',
                        }}>
                        ตรงเวลา
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginTop: '5%' }}>
                    <Text
                      style={{
                        fontFamily: font.AnuphanMedium,
                        fontSize: normalize(20),
                        color: '#1F8449',
                      }}>
                      3. ความเชี่ยวชาญในการพ่น
                    </Text>
                    <View style={styles.reviewBar}>
                      {maxRatting.map((item, key) => {
                        return (
                          <TouchableOpacity
                            activeOpacity={0.9}
                            key={item}
                            onPress={() => setSprayExpertise(item)}>
                            <Image
                              style={styles.star}
                              source={
                                item <= sprayExpertise
                                  ? starImgFilled
                                  : starImgCorner
                              }
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontFamily: font.SarabunMedium,
                          fontSize: normalize(18),
                          color: '#8D96A0',
                        }}>
                        ไม่เชี่ยวชาญ
                      </Text>
                      <Text
                        style={{
                          fontFamily: font.SarabunMedium,
                          fontSize: normalize(18),
                          color: '#8D96A0',
                        }}>
                        เชี่ยวชาญมาก
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginTop: '5%' }}>
                    <Text
                      style={{
                        fontFamily: font.AnuphanMedium,
                        fontSize: normalize(20),
                        color: '#1F8449',
                      }}>
                      4. ความคิดเห็นเพิ่มเติม
                    </Text>
                    <TextInput
                      value={commentReview}
                      onChangeText={setCommentReview}
                      scrollEnabled={false}
                      numberOfLines={6}
                      allowFontScaling={false}
                      returnKeyType="done"
                      multiline
                      blurOnSubmit={true}
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                      placeholder={'ระบุความคิดเห็นเพิ่มเติม'}
                      placeholderTextColor={colors.grey30}
                      style={{
                        width: '100%',
                        color: colors.fontBlack,
                        fontSize: normalize(20),
                        fontFamily: font.SarabunLight,
                        alignItems: 'center',
                        flexDirection: 'row',
                        borderColor: '#2EC46D',
                        borderWidth: 1,
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                        borderRadius: 8,
                        textAlignVertical: 'top',
                        writingDirection: 'ltr',
                        height: Platform.OS === 'ios' ? 6 * 20 : 120,
                        marginTop: '4%',
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: '10%',
                    }}>
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: 'black',
                        borderWidth: 0.5,
                        width: '45%',
                        borderRadius: 8,
                        height: normalize(54),
                      }}
                      onPress={() => setOpenReview(false)}>
                      <Text
                        style={{
                          fontFamily: font.AnuphanMedium,
                          fontSize: normalize(20),
                        }}>
                        ยกเลิก
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={disableReview}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: disableReview ? '#D9DCDF' : '#2EC46D',
                        borderWidth: 0.5,
                        width: '45%',
                        borderRadius: 8,
                        height: normalize(54),
                        backgroundColor: disableReview ? '#D9DCDF' : '#2EC46D',
                      }}
                      onPress={submitReview}>
                      <Text
                        style={{
                          fontFamily: font.AnuphanMedium,
                          fontSize: normalize(20),
                          color: 'white',
                        }}>
                        ยืนยัน
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        transparent={true}
        animationType="fade"
        visible={toggleModalSuccess}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            paddingHorizontal: '5%',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: normalize(20),
              borderRadius: normalize(8),
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '5%',
              }}>
              <Image
                source={image.reviewSuccess}
                style={{ width: normalize(170), height: normalize(168) }}
              />
              <Text
                style={{
                  fontFamily: font.AnuphanBold,
                  fontSize: normalize(22),
                  color: 'black',
                  marginVertical: normalize(10),
                }}>
                รีวิวสำเร็จ
              </Text>
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  fontSize: normalize(18),
                  color: 'black',
                  marginVertical: normalize(5),
                }}>
                ขอบคุณสำรับการรีวิวงานนักบินโดรน
              </Text>
            </View>

            <MainButton
              label="ตกลง"
              color={'#2EC46D'}
              onPress={() => submitReviewSuccess()}
            />
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={showGetPoint}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            paddingHorizontal: '5%',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: normalize(20),
              borderRadius: normalize(8),
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '5%',
              }}>
              <Image
                source={image.getPoint}
                resizeMode="contain"
                style={{ width: normalize(130), height: normalize(100) }}
              />
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  fontSize: normalize(22),
                  color: colors.fontBlack,
                  marginTop: normalize(16),
                }}>
                คุณได้รับ{' '}
                <Text
                  style={{
                    fontFamily: font.AnuphanMedium,
                    fontSize: normalize(22),
                    color: colors.greenLight,
                  }}>
                  {taskPointDetail?.receivePoint || 0} แต้ม
                </Text>{' '}
              </Text>
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  fontSize: normalize(22),
                  color: colors.fontBlack,
                }}>
                จากการจ้างโดรนเกษตร
              </Text>
            </View>

            <MainButton
              label="ตกลง"
              color={'#2EC46D'}
              onPress={onCloseGetPoint}
            />
          </View>
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

export default MyTaskDetailScreen;

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
  totalPrice: {
    fontFamily: font.AnuphanMedium,
    color: colors.gray,
    fontSize: normalize(18),
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#32AFFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: normalize(10),
  },
  reviewBar: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: '3%',
  },
  star: {
    width: normalize(40),
    height: normalize(40),
    resizeMode: 'cover',
    marginHorizontal: 5,
  },
});
