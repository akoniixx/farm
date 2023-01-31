import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../assets';
import { condition } from '../../assets/constant/constant';
import fonts from '../../assets/fonts';
import CustomHeader from '../../components/CustomHeader';
import { normalize } from '../../functions/Normalize';
import { stylesCentral } from '../../styles/StylesCentral';

const PrivacyScreen: React.FC<any> = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title="นโยบายความเป็นส่วนตัว"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <View style={styles.inner}>
          <View style={{ flex: 5 }}>
            <ScrollView>
              <Text style={[styles.head, { color: colors.greenLight }]}>
                Icon Kaset
                <Text style={[styles.head]}>
                  {`  นโยบายคุ้มครองความเป็นส่วนตัว`}
                </Text>
                <View>
                  <Text
                    style={[
                      styles.head,
                      { fontWeight: '200', top: normalize(20) },
                    ]}>
                    มีผลบังคับเมื่อวันที่ 24 กุมภาพันธ์ 2564
                  </Text>
                </View>
              </Text>
              <View>
                <Text
                  style={[
                    styles.head,
                    { fontWeight: '200', top: normalize(40) },
                  ]}>
                  {condition}
                </Text>
              </View>
              <View style={{ height: normalize(70) }}></View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default PrivacyScreen;

const styles = StyleSheet.create({
  head: {
    fontFamily: fonts.SarabunMedium,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
});
