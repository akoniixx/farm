import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalize } from '@rneui/themed';
import { font, icons } from '../../assets';
import { stylesCentral } from '../../styles/StylesCentral';
import colors from '../../assets/colors/colors';
import { MainButton } from '../../components/Button/MainButton';
import { StatusObject } from '../../components/Drone/DroneBranding';

const ProfileDocument: React.FC<any> = ({ navigation, route }) => {
  const profilestate = route.params.profile;

  return (
    <SafeAreaView style={[stylesCentral.container]}>
      <View style={styles.appBarBack}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.arrowLeft} style={styles.listTileIcon} />
        </TouchableOpacity>
        <Text style={[styles.appBarHeader]}>โปรไฟล์ของฉัน </Text>
        <View style={styles.listTileIcon} />
      </View>
      <View style={styles.body}>
        <View style={styles.content}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.header}>สถานะบัญชีนักบินโดรน</Text>
            <View
              style={{
                marginTop: normalize(10),
                width: normalize(109),
                height: normalize(24),
                borderRadius: normalize(12),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: StatusObject(profilestate.status).colorBg,
              }}>
              <Text
                style={{
                  color: StatusObject(profilestate.status).fontColor,
                  fontFamily: font.light,
                  fontSize: normalize(14),
                }}>
                {StatusObject(profilestate.status).status === 'ตรวจสอบแล้ว'
                  ? 'ยืนยันตัวตนแล้ว'
                  : StatusObject(profilestate.status).status}
              </Text>
            </View>
          </View>


        </View>
        <View style={styles.content}>
          <TouchableOpacity  >

         
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{fontFamily:font.medium,fontSize:normalize(16)}}>อัพโหลดใบอนุญาตนักบิน</Text>
            <Image source={icons.arrowRight} style={{ width: normalize(15.5), height: normalize(8.5) }} />
          </View>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => {
                navigation.navigate('UploadBankingScreen');
              }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{fontFamily:font.medium,fontSize:normalize(16)}}>อัพโหลดสมุดบัญชีธนาคาร</Text>

            <Image source={icons.arrowRight} style={{ width: normalize(15.5), height: normalize(8.5) }} />
          </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileDocument;

const styles = StyleSheet.create({
  appBarBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(12),
    alignItems: 'center',
  },
  appBarHeader: {
    fontFamily: font.bold,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  body: {
    flex: 9,
    paddingTop: normalize(10),
    backgroundColor: colors.disable,
  },
  content: {
    backgroundColor: colors.white,
    padding: normalize(17),
    marginHorizontal: normalize(16),
    marginVertical: normalize(8),
    borderRadius: 10

  },
  listTileIcon: {
    width: normalize(24),
    height: normalize(24),
    color: colors.fontBlack,
  },
  header: {
    fontFamily: font.bold,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(5),
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  idcardheader: {
    fontFamily: font.medium,
    fontSize: normalize(14),
    paddingTop: normalize(20),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.light,
    fontSize: normalize(14),
    color: colors.gray,
  },
});
