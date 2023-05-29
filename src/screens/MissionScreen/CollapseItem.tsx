import {View, StyleSheet, Animated, Pressable} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Text from '../../components/Text';

import moment from 'moment';
import {colors, font, icons} from '../../assets';
import {momentExtend, numberWithCommas} from '../../function/utility';
import CardMission from '../../components/CardMission/CardMission';

export default function CollapseItem() {
  const [isCollapse, setIsCollapse] = React.useState<boolean>(true);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rai = 600;
  const dateEnd = moment().add(4, 'months').toISOString();
  const dateStart = moment().toISOString();
  const animate = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const resetAnimate = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <Pressable
        style={[
          styles.row,
          {
            marginBottom: 8,
          },
        ]}
        onPress={() => {
          if (!isCollapse) {
            animate();
          } else {
            resetAnimate();
          }
          setIsCollapse(!isCollapse);
        }}>
        <View
          style={{
            flex: 0.9,
          }}>
          <Text title>
            บินปั๊บรับแต้ม ลุ้นโชคชั้นที่ 2 ลุ้นโชคชั้นที่ 2 (1/4)
          </Text>
          <Text>อีก {moment(dateEnd).diff(moment(), 'days')} วัน</Text>
        </View>
        <View
          style={{
            flex: 0.1,
            marginTop: 4,
          }}>
          <Animated.Image
            source={icons.arrowUpCollapse}
            style={{
              width: 30,
              height: 30,
              transform: [
                {
                  rotate: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            }}
          />
        </View>
      </Pressable>
      {isCollapse && (
        <>
          <View style={styles.content}>
            <View style={styles.boxOrange}>
              <View style={styles.row}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: 14,
                  }}>
                  จำนวนไร่สะสม
                </Text>
                <Text
                  style={{
                    marginLeft: 8,
                    fontFamily: font.bold,
                    fontSize: 14,

                    color: colors.orange,
                  }}>
                  {numberWithCommas(rai.toString(), true)} ไร่
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: font.light,
                  fontSize: 10,
                  marginTop: 4,
                }}>
                เริ่มนับจำนวนไร่สะสมตั้งแต่{' '}
                {momentExtend.toBuddhistYear(dateStart, 'DD MMM YYYY')} ถึง{' '}
                {momentExtend.toBuddhistYear(dateEnd)}
              </Text>
            </View>
          </View>
          <CardMission />
        </>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  content: {
    paddingVertical: 16,
    height: 100,
  },
  boxOrange: {
    flex: 0.9,
    padding: 12,
    backgroundColor: colors.lightOrange,
    borderWidth: 1,
    borderColor: colors.orangeSoft,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    borderRadius: 6,
  },
});
