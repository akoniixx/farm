import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../assets';
import fonts from '../../assets/fonts';
import CustomHeader from '../../components/CustomHeader';
import {normalize} from '../../functions/Normalize';
import {stylesCentral} from '../../styles/StylesCentral';

const PrivacyScreen: React.FC<any> = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title="นโยบายความเป็นส่วนตัว"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <View>
          <ScrollView style={{padding: 15, height: '100%'}}>
            <Text style={[styles.head, {color: colors.greenLight}]}>
              Icon Kaset
              <Text style={[styles.head]}>
                {`  นโยบายคุ้มครองความเป็นส่วนตัว`}
              </Text>
              <View>
                <Text
                  style={[
                    styles.head,
                    {fontWeight: '200', top: normalize(20)},
                  ]}>
                  มีผลบังคับเมื่อวันที่ 24 กุมภาพันธ์ 2564
                </Text>
              </View>
            </Text>
            <View>
              <Text
                style={[styles.head, {fontWeight: '200', top: normalize(40)}]}>
                นโยบายความเป็นส่วนตัวของ Icon Kaset Co., Ltd. นี้ (“ไอคอนเกษตร”
                หรือ “เรา” “พวกเรา” หรือ “ของเรา”) ใช้กับการดำเนินการไม่ว่า
                จะเป็นผลิตภัณฑ์หรือบริการที่มีอยู่แล้วหรือจะมีขึ้นในภายหลัง
                ของไลน์แมน และ/หรือ บริษัทในเครือและบริษัทสาขา ซึ่งได้มีการนำ
                เสนอผ่านแพลตฟอร์มของไลน์ โดยไม่คำนึงถึง ช่องทางการเข้าถึง
                ไม่ว่าจะเป็นการเข้าถึงผ่าน แอปพลิเคชันโทรศัพท์มือถือ
                หรือเว็บไซต์ (“บริการ”) โดยนโยบายความเป็นส่วนตัวนี้ได้
                กำหนดนโยบาย และวิธีการดำเนินการในการเก็บ รวบรวม ใช้
                และเปิดเผยข้อมูลของผู้ที่เข้ามา เยี่ยมชม
                หรือผู้ใช้แต่ละคนของบริการ (“ท่าน” หรือ “ของท่าน” หรือ “ผู้ใช้”)
                ซึ่งในนโยบาย ความเป็นส่วนตัวนี้ (“นโยบาย”) ได้ชี้แจ้ง
                รายละเอียดว่า ข้อมูลใดบ้างที่เราเก็บรวบรวม และนำไปใช้ทำอะไร
                โดยเราให้ความสำคัญกับ การคุ้มครองความเป็นส่วนตัวของท่าน
                และอยากให้ท่านได้เข้าใจอย่างถ่องแท้ว่าเรานำข้อมูลของท่านไปใช้อย่างไร
                และทำไมถึงนำไปใช้ ทั้งนี้ โปรดอ่านนโยบายนี้ด้วยความระมัดระวัง
                เนื่องจากนโยบายนี้ชี้แจงว่าเราได้ทำการเก็บรวบรวม ใช้ เปิดเผย
                และ/หรือ โอนข้อมูลส่วนบุคคล ของท่านอย่างไรบ้าง
                ข้อมูลอะไรบ้างที่เราเก็บรวบรวม 1.   ข้อมูลเกี่ยวกับผู้ใช้
                เราอาจเก็บรวบรวมข้อมูลเกี่ยวกับท่าน
                และการทำคำสั่งเกี่ยวกับบริการของท่าน ตัวอย่างเช่น ชื่อของผู้ส่ง
                หมายเลขโทรศัพท์ของผู้ส่ง ชื่อของผู้รับ ที่อยู่ของผู้รับ
                หมายเลขโทรศัพท์ของผู้รับ สิ่งของ ข้อมูลร้านค้า
                ที่อยู่ของสถานที่จัดส่งและประวัติการสั่งซื้อ ที่อยู่อีเมล
                ประเภทการชำระเงิน ข้อมูลบัญชีธนาคาร (ชื่อเจ้าของบัญชี
                หมายเลขบัญชี ชื่อธนาคาร)
                โดยข้อมูลเหล่านี้ทำให้เราสามารถปรับปรุงบริการ
                และให้บริการในรูปแบบและการใช้งานอื่นๆ เพิ่มเติมได้
              </Text>
            </View>
          </ScrollView>
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
});
