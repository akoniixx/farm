import {View, Text, StyleSheet, Image, useWindowDimensions} from 'react-native';
import React from 'react';
import fonts from '../../../assets/fonts';
import {normalize} from '../../../function/Normalize';
import colors from '../../../assets/colors/colors';
import image from '../../../assets/images/image';
import {MainButton} from '../../../components/Button/MainButton';
import { callCenterDash } from '../../../definitions/callCenterNumber';

const DeleteSuccess: React.FC<any> = ({navigation}) => {
  const {width} = useWindowDimensions();

  return (
    <View
      style={{
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        flex: 1,
      }}>
      <View style={{alignItems: 'center', paddingTop: '32%'}}>
        <Text style={styles.fontTitle}>บัญชีถูกลบแล้ว!</Text>
        <Text style={styles.fontBody}>
          มีคำถามเพิ่มเติมสามารถติดต่อเจ้าหน้าที่
        </Text>
        <Text style={styles.fontBody}>โทร. {callCenterDash()}</Text>
        <Image
          source={image.deletePic}
          style={{
            width: width / 2,
            height: 240,
            marginTop: 16,
          }}
        />
      </View>
      <View
        style={{
          marginBottom: 16,
        }}>
        <MainButton
          label="ไปหน้าหลัก"
          color={colors.orange}
          fontColor={'white'}
          onPress={() => navigation.navigate('HomeScreen')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fontTitle: {
    fontFamily: fonts.bold,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  fontBody: {
    fontFamily: fonts.medium,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
});
export default DeleteSuccess;
