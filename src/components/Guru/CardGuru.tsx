import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { font, image } from '../../assets';
import colors from '../../assets/colors/colors';
import { normalize } from '../../functions/Normalize';
import { momentExtend } from '../../utils/moment-buddha-year';
interface guruData {
  index: any;
  background: any;
  title: any;
  date: any;
  read: any;
}
export const CardGuru: React.FC<guruData> = ({
  index,
  background,
  title,
  date,
  read,
}) => {
  return (
    <View
      key={index}
      style={{
        padding: 10,
      }}>
      <View style={styles.card}>
        <Image
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          style={{ height: normalize(128) }}
          source={background === '' ? image.bg_droner : { uri: background }}
        />
        <View style={{ paddingHorizontal: 15, top: 15 }}>
          <Text style={styles.text} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 20,
            paddingHorizontal: 15,
          }}>
          <Text style={styles.textDate} numberOfLines={1}>
            {date}
          </Text>
          <Text style={[styles.textDate, { left: 15 }]} numberOfLines={1}>
            {`อ่านแล้ว ` + read + ` ครั้ง`}
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width - normalize(25),
    height: 'auto',
    borderWidth: 1,
    borderColor: '#D9DCDF',
    margin: normalize(5),
    borderRadius: normalize(10),
  },
  text: {
    fontSize: 20,
    fontFamily: font.AnuphanBold,
    color: colors.fontGrey,
    lineHeight: 24,
  },
  textDate: {
    fontSize: 16,
    fontFamily: font.SarabunLight,
    color: colors.fontGrey,
    lineHeight: 24,
  },
});
