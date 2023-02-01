import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import fonts from '../../assets/fonts';
import { colors, image } from '../../assets';
import SlipCard, { TaskDataTypeSlip } from '../../components/SlipCard/SlipCard';
import icons from '../../assets/icons/icons';
import { DronerDatasource } from '../../datasource/DronerDatasource';

export default function SectionBody(props: TaskDataTypeSlip) {
  return (
    <View style={styled.container}>
      <View>
        <Text
          style={{
            color: colors.greenLight,
            fontFamily: fonts.AnuphanBold,
            fontSize: 24,
            textAlign: 'center',
            paddingVertical: 8,
          }}>
          นักบินโดรนรับงานแล้ว
        </Text>
        <Text
          style={{
            color: colors.fontBlack,
            textAlign: 'center',
            fontFamily: fonts.SarabunMedium,
            fontSize: 18,
          }}>
          คุณสามารถติดต่อพูดคุย กับนักบินโดรนได้เลย
        </Text>
        <View style={styled.shadow}>
          <View style={styled.dronerCard}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={!(props.img)?image.bg_droner:{uri : props.img}}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                }}
              />
              <View
                style={{
                  marginLeft: 16,
                }}>
                <Text
                  style={{
                    color: colors.fontBlack,
                    fontFamily: fonts.SarabunMedium,
                    fontSize: 18,
                  }}>
                  {props.firstname + " " + props.lastname}
                </Text>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.star}
                    style={{
                      width: 16,
                      height: 16,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: 4,
                      color: colors.gray,
                    }}>
                    5.0 คะแนน (10)
                  </Text>
                </View> */}
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${props.telNo}`);
              }}
              style={{
                backgroundColor: '#E8F6FF',
                borderRadius: 20,
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={icons.calling}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
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
