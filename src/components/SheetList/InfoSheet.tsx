import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import Text from '../Text/Text';
import { colors, font, icons } from '../../assets';
import { MainButton } from '../Button/MainButton';
import { normalize } from '../../functions/Normalize';

interface Props {
  sheetId: 'placePlot' | 'positionPlot' | 'targetSpray' | 'injectTime';
  payload: {
    type: 'placePlot' | 'positionPlot' | 'targetSpray' | 'injectTime';
  };
}

const mappingObj = {
  placePlot: {
    title: 'พื้นที่แปลงเกษตร คืออะไร?',
    description: [
      'คือ การระบุ “ตำบล” ที่ตั้งของแปลงเกษตรของคุณ',
      'โดยไม่ต้องพิมพ์คำนำหน้าชื่อคำว่า ต. หรือ ตำบล',
      'เช่น ห้วยกรด, คูคต, บางเสาธง',
      ' การระบุหัวข้อนี้ มีผลต่อการจ้างนักบินโดรน',
      'ในพื้นที่ที่คุณอยู่',
    ],
    height: 360,
  },
  positionPlot: {
    title: 'ตำแหน่งแปลง คืออะไร?',
    description:
      'คือ การระบุตำแหน่งที่ตั้งแปลงเกษตร 2 ขั้นตอน \n 1. ระบุสถานที่ใกล้แปลง เช่น วัด โรงเรียน \n 2. เลื่อนหมุดแผนที่ เพื่อไปหาตำแหน่งแปลง \n \n เพื่อให้นักบินโดรนทราบถึงตำแหน่งที่ตั้ง และ \n เดินทางมาที่แปลงเกษตรได้ถูกต้อง',
    height: 400,
  },
  targetSpray: {
    title: 'เป้าหมาย คืออะไร?',
    description:
      'คือ สิ่งที่คุณต้องการให้นักบินโดรนทำ\nในแปลงเกษตรของคุณครั้งนี้\nเช่น ฆ่าหญ้า, กำจัดแมลง, ให้ฮอร์โมน, \n ป้องกันเชื้อรา',
    height: 350,
  },
  injectTime: {
    title: 'ช่วงเวลา คืออะไร?',
    description:
      'คือ การระบุช่วงเวลา หรือ \nอายุของพืชที่ปลูกให้นักบินโดรนทราบ \nเช่น คุมเลน, คุมฆ่า, แตกกอ, ตั้งท้อง',
    height: 350,
  },
};
export default function InfoSheet({ sheetId, payload }: Props) {
  const { type } = payload;

  return (
    <ActionSheet
      id={sheetId}
      useBottomSafeAreaPadding
      containerStyle={{
        height: mappingObj[type as keyof typeof mappingObj].height,
      }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.h1}>
            {mappingObj[type as keyof typeof mappingObj].title}
          </Text>
          {type === 'placePlot' ? (
            <>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.SarabunLight,
                  textAlign: 'center',
                  lineHeight: 28,
                }}>
                {mappingObj[type as keyof typeof mappingObj].description[0]}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.SarabunLight,
                  textAlign: 'center',
                  lineHeight: 28,
                  color: colors.errorText,
                }}>
                {mappingObj[type as keyof typeof mappingObj].description[1]}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.SarabunLight,
                  textAlign: 'center',
                  lineHeight: 28,
                  marginBottom: 16,
                }}>
                {mappingObj[type as keyof typeof mappingObj].description[2]}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.SarabunLight,
                  textAlign: 'center',
                  lineHeight: 28,
                }}>
                {mappingObj[type as keyof typeof mappingObj].description[3]}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: font.SarabunLight,
                  textAlign: 'center',
                  lineHeight: 28,
                }}>
                {mappingObj[type as keyof typeof mappingObj].description[4]}
              </Text>
            </>
          ) : type === 'positionPlot' ? (
            <>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: 18,
                  lineHeight: 28,
                }}>
                ขั้นตอนในการหาตำแหน่งแปลง มีดังนี้
              </Text>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: 18,
                  lineHeight: 28,
                }}>
                1. ให้พิมพ์ค้นหาสถานที่ใกล้แปลง (เช่น วัด, โรงเรียน)
              </Text>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: 18,
                  lineHeight: 28,
                }}>
                2. เลื่อนหาตำแหน่งแปลงเกษตรบนแผนที่ {'\n'} และกดปักหมุด {'\t'}
                <Image
                  source={icons.locationOrange}
                  style={{
                    width: normalize(18),
                    height: normalize(18),
                    marginRight: -20,
                  }}
                  resizeMode="contain"
                />
                แปลงของคุณ แล้วกดปุ่ม “บันทึก”
              </Text>
              <Text
                style={{
                  fontFamily: font.SarabunLight,
                  fontSize: 18,
                  lineHeight: 28,
                  marginTop: 16,
                  textAlign: 'center',
                }}>
                เพื่อให้นักบินโดรนทราบถึงตำแหน่งที่ตั้ง และ
                เดินทางมาที่แปลงเกษตรได้ถูกต้อง
              </Text>
            </>
          ) : (
            <Text style={styles.h3}>
              {mappingObj[type as keyof typeof mappingObj].description}
            </Text>
          )}
        </View>
        <MainButton
          color={colors.greenLight}
          label="เข้าใจแล้ว"
          onPress={() => {
            SheetManager.hide(sheetId);
          }}
        />
      </View>
    </ActionSheet>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  content: {
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  h1: {
    fontSize: 22,
    fontFamily: font.AnuphanSemiBold,
    lineHeight: 30,
    marginBottom: 16,
  },
  h3: {
    fontSize: 18,
    fontFamily: font.SarabunLight,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 28,
  },
});
