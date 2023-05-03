import { BackgroundImage } from '@rneui/base';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, font, icons, image } from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import { HistoryPoint } from '../../components/Point/HistoryPoint';
import { normalize } from '../../functions/Normalize';

const DetailPointScreen: React.FC<any> = ({ navigation }) => {
  //mock data
  const data = [
    { title: 'จ้างโดรนเกษตร', point: 200, date: '' },
    { title: 'แลกส่วนลดฉีดพ่น', point: -40, date: '' },
    { title: 'แลกส่วนลดฉีดพ่น', point: -100, date: '' },
    { title: 'จ้างโดรนเกษตร', point: 80, date: '' },
    { title: 'จ้างโดรนเกษตร', point: 20, date: '' },
    { title: 'จ้างโดรนเกษตร', point: 200, date: '' },
    
  ];
  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: colors.white }}>
        <CustomHeader
          title="คะแนนของฉัน"
          titleColor="white"
          showBackBtn
          onPressBack={() => navigation.goBack()}
          backgroundColor={colors.greenLight}
        />
        <View
          style={{ backgroundColor: colors.greenLight, height: normalize(16) }}>
          <View style={styles.point}>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                paddingVertical: 12,
              }}>
              <Image
                source={icons.ickPoint}
                style={{ width: 30, height: 30 }}
              />
              <Text style={styles.textHead}>12,480 คะแนน</Text>
            </View>
          </View>
        </View>
      </View>
      {data.length != undefined ? (
        <View style={{ paddingTop: normalize(50) }}>
          <Text style={styles.textHead}>ประวัติการได้รับ/ใช้คะแนน</Text>
          <ScrollView style={{ paddingVertical: 20 }}>
            {data.map((x, i) => (
              <HistoryPoint
                index={i}
                date={x.date}
                title={x.title}
                point={x.point}
              />
            ))}
            {/* <View style={{height:500}}></View> */}
          </ScrollView>
        </View>
      ) : (
        <View style={{ paddingTop: normalize(50) }}>
          <Text style={styles.textHead}>ประวัติการได้รับ/ใช้คะแนน</Text>
          <View
            style={{ alignSelf: 'center', paddingVertical: normalize(150) }}>
            <Image
              source={image.empty_coupon}
              style={{ width: normalize(130), height: normalize(120) }}
            />
            <View style={{ top: normalize(20) }}>
              <Text style={styles.text_empty}>ไม่มีคะแนนที่ได้รับ</Text>
              <Text style={styles.text_empty}>และการที่ใช้คะแนน</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default DetailPointScreen;
const styles = StyleSheet.create({
  textHead: {
    fontFamily: font.AnuphanBold,
    fontSize: 20,
    fontWeight: '600',
    left: 10,
    color: colors.fontBlack
  },
  bgHead: {
    justifyContent: 'center',
    height: normalize(140),
  },
  point: {
    height: normalize(52),
    width: normalize(345),
    borderWidth: 1.2,
    borderRadius: 10,
    borderColor: colors.greenLight,
    alignSelf: 'center',
    top: -10,
    backgroundColor: colors.bgGreen,
    shadowColor: colors.greenLight,
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 5,
  },
  text_empty: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    lineHeight: normalize(30),
    textAlign: 'center',
    color: colors.grey40,
  },
});
