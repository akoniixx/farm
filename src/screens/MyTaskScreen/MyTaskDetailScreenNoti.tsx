import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, icons } from '../../assets';
import fonts from '../../assets/fonts';
import CustomHeader from '../../components/CustomHeader';
import { DronerCard } from '../../components/Mytask/DronerCard';
import {
  DateTimeDetail,
  PlotDetail,
  TargetSpray,
} from '../../components/TaskDetail/TaskDetail';
import { DronerDatasource } from '../../datasource/DronerDatasource';
import { normalize } from '../../functions/Normalize';
import { getStatusToText, numberWithCommas } from '../../functions/utility';
import Text from '../../components/Text/Text';

const MyTaskDetailScreenNoti: React.FC<any> = ({ navigation, route }) => {
  const task = route.params.task;
  const getLabelBotton = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'โทรหาเจ้าหน้าที่/นักบินโดรน';
      case 'WAIT_START':
        return 'โทรหาเจ้าหน้าที่/นักบินโดรน';
      case 'WAIT_REVIEW':
        return 'กลับหน้าหลัก';
      case 'DONE':
        return 'กลับหน้าหลัก';
    }
  };
  const [dronerImg, setDronerImg] = useState<string | null>(null);
  useEffect(() => {
    DronerDatasource.getDronerData(task.droner.id).then(res => {
      res.file.map((item: any) => {
        if (item.category === 'PROFILE_IMAGE') {
          DronerDatasource.getDronerProfileImage(item.path).then(resImg => {
            setDronerImg(resImg);
          });
        }
      });
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        title="รายละเอียดงาน"
        showBackBtn
        onPressBack={() => navigation.navigate('MainScreen')}
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal={false}>
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
            {'#' + task.taskNo}
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
        <View style={{ padding: normalize(16), backgroundColor: 'white' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: normalize(10),
            }}>
            <Text style={styles.label}>วันและเวลา</Text>
          </View>
          <DateTimeDetail
            date={task.dateAppointment}
            time={task.dateAppointment}
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
            plotName={task.farmerPlot.plotName}
            plotAmout={task.farmerPlot.raiAmount}
            plant={task.farmerPlot.plantName}
            location={task.farmerPlot.locationName}
          />
        </View>
        <View
          style={{
            padding: normalize(16),
            backgroundColor: 'white',
            marginTop: normalize(10),
          }}>
          <Text style={styles.label}>แปลงเกษตร</Text>
          <TargetSpray
            periodSpray={task.purposeSpray.purposeSprayName}
            preparationBy={task.preparationBy}
            target={task.targetSpray.map((d: string) => ' ' + d + ' ')}
          />
        </View>
        <View
          style={{
            padding: normalize(16),
            backgroundColor: 'white',
            marginTop: normalize(10),
          }}>
          <Text style={styles.label}>นักบินโดรน</Text>
          <DronerCard
            name={task.droner.firstname + ' ' + task.droner.lastname}
            profile={dronerImg}
            telnumber={task.droner.telephoneNo}
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
            <Text style={styles.unitPrice}>{task.unitPrice} บาท/ไร่</Text>
          </View>
        </View>
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
            <Text style={styles.totalPrice}>{task.unitPrice} บาท/ไร่</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.totalPrice}>ราคารวม</Text>
            <Text style={styles.totalPrice}>{task.price} บาท</Text>
          </View>
          {task.discountCoupon != 0 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  styles.totalPrice,
                  {
                    color: '#1F8449',
                  },
                ]}>
                ส่วนลด
              </Text>
              <Text
                style={[
                  styles.totalPrice,
                  {
                    color: '#1F8449',
                  },
                ]}>
                - {task.discountCoupon} บาท
              </Text>
            </View>
          ) : (
            <></>
          )}
          {task.discountPromotion != 0 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  styles.totalPrice,
                  {
                    color: '#1F8449',
                  },
                ]}>
                ส่วนลดโปรโมชั่น
              </Text>
              <Text
                style={[
                  styles.totalPrice,
                  {
                    color: '#1F8449',
                  },
                ]}>
                - {task.discountPromotion} บาท
              </Text>
            </View>
          ) : (
            <></>
          )}
          {task.discountCampaignPoint != 0 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  styles.totalPrice,
                  {
                    color: '#1F8449',
                  },
                ]}>
                ส่วนลดแต้ม
              </Text>
              <Text
                style={[
                  styles.totalPrice,
                  {
                    color: '#1F8449',
                  },
                ]}>
                - {task.discountCampaignPoint} บาท
              </Text>
            </View>
          ) : (
            <></>
          )}
          <View
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              borderColor: colors.disable,
              marginVertical: normalize(20),
            }}></View>

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
                color: colors.fontBlack,
              }}>
              รวมค่าบริการ
            </Text>
            <View>
              <Text
                style={{
                  fontSize: normalize(20),
                  fontFamily: font.AnuphanMedium,
                  color: '#2EC46D',
                }}>
                {numberWithCommas(task.totalPrice, true)} บาท
              </Text>
              {/* {+task.price !== +task.totalPrice && (
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
                  payload: { tel: task.droner.telephoneNo },
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
      ) : (
        <></>
      )}
    </View>
  );
};

export default MyTaskDetailScreenNoti;

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
    color: colors.fontBlack,
  },
  unitPrice: {
    fontFamily: fonts.SarabunLight,
    fontSize: normalize(20),
    color: '#2EC46D',
  },
  totalPrice: {
    fontFamily: font.SarabunMedium,
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
});
