import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts';
import { colors } from '../../assets';
import SlipCard, { TaskDataTypeSlip } from '../../components/SlipCard/SlipCard';
import Text from '../../components/Text/Text';
import image from '../../assets/images/image';

export interface DronerTemp {
  id: string;
  taskId: string;
  dronerId: string;
  status: string;
  distance: string;
  dronerDetail: string[];
}

const renderDronerCard = (item: DronerTemp) => {
  const dronerDetail = JSON.parse(item.dronerDetail[0]);
  if (dronerDetail.image_droner) {
    dronerDetail.image_droner = { uri: dronerDetail.image_droner };
  } else {
    dronerDetail.image_droner = image.bg_droner;
  }

  return (
    <View key={item.id} style={styled.shadow}>
      <View style={styled.dronerCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={dronerDetail.image_droner}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
            }}
          />
          <View style={{ marginLeft: 16 }}>
            <Text
              style={{
                color: colors.fontBlack,
                fontFamily: fonts.SarabunMedium,
                fontSize: 18,
              }}>
              {dronerDetail.nickname}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  marginLeft: 4,
                  color: colors.gray,
                  fontFamily: fonts.SarabunLight,
                }}>
                {dronerDetail.firstname} {dronerDetail.lastname}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function SectionBody(props: TaskDataTypeSlip) {
  return (
    <View style={styled.container}>
      <View>
        <Text
          style={{
            color: colors.orangeLight,
            fontFamily: fonts.AnuphanBold,
            fontSize: 24,
            textAlign: 'center',
            paddingVertical: 8,
          }}>
          รอนักบินโดรนรับงานให้คุณ
        </Text>
        <Text
          style={{
            color: colors.fontBlack,
            textAlign: 'center',
            fontFamily: fonts.SarabunMedium,
            fontSize: 18,
          }}>
          อาจจะใช้เวลาสักครู่ คุณสามารถใช้ส่วนอื่นๆ เพื่อรอนักบินโดรนรับงาน
        </Text>
        {props.taskDronerTemp &&
          props.taskDronerTemp.length === 1 &&
          props.taskDronerTemp.map(
            (item: any) => item.dronerDetail[0] && renderDronerCard(item),
          )}
        <SlipCard {...props} />
      </View>
    </View>
  );
}
const styled = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 0,
  },
  fontSarabunM: {
    fontFamily: fonts.SarabunMedium,
  },
  fontSarabunB: {
    fontFamily: fonts.SarabunBold,
  },
  dronerCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
});
