import {View, Text, StyleSheet, Image, useWindowDimensions} from 'react-native';
import React from 'react';
import {stylesCentral} from '../../../styles/StylesCentral';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import fonts from '../../../assets/fonts';
import {normalize} from '../../../function/Normalize';
import colors from '../../../assets/colors/colors';
import image from '../../../assets/images/image';
import {MainButton} from '../../../components/Button/MainButton';

const DeleteSuccess: React.FC<any> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();

  return (
    <View
      style={[
        stylesCentral.container,
        {
          paddingTop: '40%',
          paddingHorizontal: 16,
          justifyContent: 'space-between',
          paddingBottom: 32,
        },
      ]}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.fontTitle}>บัญชีถูกลบแล้ว!</Text>
        <Text style={styles.fontBody}>
          มีคำถามเพิ่มเติมสามารถติดต่อเจ้าหน้าที่
        </Text>
        <Text style={styles.fontBody}>โทร. 02-113-6159</Text>
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
