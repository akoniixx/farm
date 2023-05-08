import React from 'react';
import { Image, StyleSheet, Text, View, FlatList } from 'react-native';
import { colors, font, icons } from '../../assets';
import { normalize, width } from '../../functions/Normalize';
import image from '../../assets/images/image';
import CustomHeader from '../../components/CustomHeader';
import { HistoryPoint } from '../../components/Point/HistoryPoint';

const DetailPointScreen: React.FC<any> = ({ navigation, route }) => {
  const data = [
    { title: 'จ้างโดรนเกษตร', point: 200, date: '' },
    { title: 'แลกส่วนลดฉีดพ่น', point: -40, date: '' },
    { title: 'แลกส่วนลดฉีดพ่น', point: -100, date: '' },
    { title: 'จ้างโดรนเกษตร', point: 80, date: '' },
    { title: 'จ้างโดรนเกษตร', point: 20, date: '' },
    { title: 'จ้างโดรนเกษตร', point: 200, date: '' },
    { title: 'จ้างโดรนเกษตร', point: 80, date: '' },
    { title: 'จ้างโดรนเกษตร', point: 20, date: '' },
    { title: 'จ้างโดรนเกษตร', point: 200, date: '' },
    { title: 'จ้างโดรนเกษตร', point: 80, date: '' },
    { title: 'จ้างโดรนเกษตร', point: 20, date: '' },
    { title: 'จ้างโดรนเกษตร', point: 200, date: '' },
  ];
  return (
    <View
      style={{
        backgroundColor: colors.white,
      }}>
      <View
        style={{
          position: 'relative',
        }}>
        <View style={styles.HeadBg} />
        <View
          style={{
            width: '100%',
            position: 'absolute',
          }}>
          <View>
            <CustomHeader
              title="คะแนนของฉัน"
              titleColor="white"
              showBackBtn
              onPressBack={() => navigation.goBack()}
              backgroundColor={colors.greenLight}
            />
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            top: '82%',
            height: normalize(50),
            alignSelf: 'center',
          }}>
          <View
            style={{
              borderRadius: normalize(10),
              borderWidth: normalize(1),
              borderColor: colors.greenLight,
              height: '100%',
              width: normalize(330),
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              shadowRadius: normalize(30),
              backgroundColor: colors.white,
              shadowColor: colors.greenLight,
              shadowOpacity: 0.4,
            }}>
            <Image
              source={icons.ickPoint}
              style={{
                width: normalize(35),
                height: normalize(35),
              }}
            />
            <Text
              style={{
                fontFamily: font.AnuphanBold,
                color: colors.fontBlack,
                fontSize: normalize(18),
                marginLeft: normalize(15),
                marginRight: normalize(5),
              }}>
              123,450 คะแนน
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.inner}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: normalize(10),
          }}>
          <Text
            style={{
              fontFamily: font.AnuphanMedium,
              fontSize: normalize(20),
              color: colors.fontBlack,
            }}>
            ประวัติการได้รับ/ใช้คะแนน
          </Text>
        </View>
      </View>
      {data.length != 0 ? (
        <View
          style={{
            backgroundColor: colors.white,
          }}>
          <FlatList
            ListFooterComponent={<View style={{ height: normalize(450) }} />}
            data={data}
            renderItem={({ item, index }) => (
              <HistoryPoint
                index={index}
                date={item.date}
                title={item.title}
                point={item.point}
              />
            )}
          />
        </View>
      ) : (
        <View
          style={{
            alignSelf: 'center',
            paddingVertical: normalize(150),
            height: '100%',
          }}>
          <Image
            source={image.empty_coupon}
            style={{ width: normalize(130), height: normalize(120) }}
          />
          <View style={{ top: normalize(20) }}>
            <Text style={styles.textEmpty}>ไม่มีคะแนนที่ได้รับ</Text>
            <Text style={styles.textEmpty}>และการที่ใช้คะแนน</Text>
          </View>
        </View>
      )}
    </View>
  );
};
export default DetailPointScreen;

const styles = StyleSheet.create({
  inner: {
    marginTop: normalize(50),
    paddingHorizontal: normalize(17),
  },
  container: {
    flex: 1,
  },
  HeadBg: {
    width: '100%',
    height: normalize(140),
    backgroundColor: colors.greenLight,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    display: 'flex',
    paddingVertical: '50%',
  },
  textEmpty: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(18),
    lineHeight: normalize(30),
    textAlign: 'center',
    color: colors.grey40,
  },
});
