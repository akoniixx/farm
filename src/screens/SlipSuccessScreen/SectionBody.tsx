import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts';
import { colors, image } from '../../assets';
import SlipCard, { TaskDataTypeSlip } from '../../components/SlipCard/SlipCard';
import icons from '../../assets/icons/icons';
import Text from '../../components/Text/Text';

export default function SectionBody(props: TaskDataTypeSlip) {
  const isHaveNickname = props.nickname ? true : false;
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
                source={
                  !props.img ? image.defaultDronerImage : { uri: props.img }
                }
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                }}
              />
              {isHaveNickname ? (
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
                    {props.nickname}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        marginLeft: 4,
                        color: colors.gray,
                      }}>
                      {props.firstname + ' ' + props.lastname}
                    </Text>
                  </View>
                </View>
              ) : (
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
                    {props.firstname + ' ' + props.lastname}
                  </Text>
                </View>
              )}
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
