import {StyleSheet, View, Image} from 'react-native';
import React, {useState} from 'react';
import Modal from '../Modal';
import Text from '../../Text';
import {colors, font, icons, image} from '../../../assets';
import Dropdown from '../../Dropdown/Dropdown';
import ZoomableImage from '../../ZoomableImage/ZoomableImage';
import AsyncButton from '../../Button/AsyncButton';

interface Props {
  visible: boolean;
  onPressBack: () => void;
}

const staticData = [
  {
    label: 'DJI',
    value: 'dji',
    image: 'test',
  },
  {
    label: 'Air Fast Drone',
    value: 'airFastDrone',
    image: 'test',
  },
];

export default function ModalImageExample({visible, onPressBack}: Props) {
  const [selected, setSelected] = useState<{
    label: string;
    value: string;
  }>({
    label: '',
    value: '',
  });

  return (
    <Modal visible={visible}>
      <View
        style={{
          backgroundColor: 'white',
          justifyContent: 'center',
          padding: 16,
          borderRadius: 12,
          width: '100%',
        }}>
        <Text
          style={{
            fontFamily: font.semiBold,
            textAlign: 'center',
          }}>
          ภาพตัวอย่างบินงานเสร็จสิ้น
        </Text>
        <Text
          style={{
            fontFamily: font.semiBold,
            textAlign: 'center',
          }}>
          ของโดรนแต่ละยี่ห้อ
        </Text>
        <View
          style={{
            marginVertical: 16,
          }}>
          <Dropdown
            placeholder="เลือกยี่ห้อโดรน"
            items={staticData}
            onChange={(v: any) => {
              console.log(v);
              setSelected(v);
            }}
            value={selected?.value}
          />
        </View>
        <View
          style={{
            width: 320,
            height: 320,
            borderRadius: 12,
            overflow: 'hidden',
          }}>
          <ZoomableImage
            source={image.defaultImageController}
            style={{
              width: 320,
              height: 320,
              borderRadius: 12,
            }}
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: font.light,
            color: colors.darkOrange2,
            marginTop: 8,
            marginBottom: 16,
          }}>
          สามารถขยายภาพได้ด้วยการใช้ 2 นิ้วลากขยาย
        </Text>
        <View style={styles.warningGray}>
          <Image
            source={icons.warningBlack}
            style={{
              width: 18,
              height: 18,
            }}
          />
          <View
            style={{
              marginLeft: 8,
              alignSelf: 'flex-start',
              flex: 1,
            }}>
            <Text
              style={{
                color: colors.gray,
                fontSize: 12,
              }}>
              ลักษณะภาพที่อัพโหลดควรแสดงวัน เวลา
              และจำนวนไร่ของงานที่คุณบินเสร็จในครั้งนี้อย่างชัดเจน
            </Text>
          </View>
        </View>
        <AsyncButton
          title="กลับไปอัพโหลดภาพ"
          type="secondary"
          onPress={onPressBack}
        />
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  warningGray: {
    backgroundColor: colors.grayBg,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
});
