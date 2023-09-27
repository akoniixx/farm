import { StyleSheet, View } from 'react-native';
import React from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import Text from '../Text/Text';
import { colors, font } from '../../assets';
import { MainButton } from '../Button/MainButton';

interface Props {
  sheetId: 'placePlot' | 'positionPlot';
  payload: {
    type: 'placePlot' | 'positionPlot';
  };
}
const mappingObj = {
  placePlot: {
    title: 'พื้นที่แปลงเกษตร คืออะไร?',
    description:
      'การระบุตำบลที่ตั้งแปลง \n เกษตรของท่าน โดยมีผลต่อการค้นหาและรับงาน \n ของนักบินโดรนในพื้นที่ที่ท่านอยู่',
    height: '33%',
  },
  positionPlot: {
    title: 'ตำแหน่งแปลง คืออะไร?',
    description:
      'การระบุสถานที่ หรือตำแหน่ง \n แปลงเกษตรของท่านให้นักบินโดรนทราบ \n เพื่อให้นักบินโดรนเดินทางมาที่แปลงเกษตรได้ \n อย่างถูกต้อง',
    height: '36%',
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
          <Text style={styles.h3}>
            {mappingObj[type as keyof typeof mappingObj].description}
          </Text>
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
