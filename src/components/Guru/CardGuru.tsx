import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { font, icons, image } from '../../assets';
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
interface guruPinData {
  index: any;
  background: any;
  title: any;
  date: any;
  read: any;
  pin: boolean;
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
        alignSelf: 'center',
        paddingVertical: 5,
      }}>
      <View style={styles.card}>
        <Image
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          style={{ height: 130 }}
          resizeMode="cover"
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
            {date + `    อ่านแล้ว ` + read + ` ครั้ง`}
          </Text>
        </View>
      </View>
    </View>
  );
};
export const CardPinGuru: React.FC<guruPinData> = ({
  index,
  background,
  title,
  date,
  read,
  pin,
}) => {
  return (
    <View
      key={index}
      style={{
        alignSelf: 'center',
        paddingVertical: 5,
      }}>
      <View style={styles.card}>
        <Image
          borderTopLeftRadius={10}
          borderTopRightRadius={10}
          style={{ height: 130 }}
          resizeMode="cover"
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
            justifyContent: 'space-between',
          }}>
          <Text style={styles.textDate} numberOfLines={1}>
            {date + `    อ่านแล้ว ` + read + ` ครั้ง`}
          </Text>

          {pin === true && (
            <View style={{ alignSelf: 'flex-end' }}>
              <Image source={icons.pin} style={{ height: 22, width: 22 }} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width - normalize(35),
    height: 'auto',
    borderWidth: 1,
    borderColor: '#C0C5CA',
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
