import {normalize} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {mixpanel} from '../../../mixpanel';
import {colors} from '../../assets';
import fonts from '../../assets/fonts';
import Text from '../Text';

interface WaitReceiveProp {
  mainFunc: () => void;
  togleModal: () => void;
  updatedAt: string;
}

export const WaitReceiveFooter: React.FC<WaitReceiveProp> = ({
  mainFunc,
  togleModal,
  updatedAt,
}) => {
  const insets = useSafeAreaInsets();

  const expire = new Date(new Date(updatedAt).getTime() + 30 * 60 * 1000);
  const now = new Date();
  const diff = new Date(expire.getTime() - now.getTime());
  const [minutes, setMinutes] = useState(diff.getMinutes());
  const [seconds, setSeconds] = useState(diff.getSeconds());
  useEffect(() => {
    let interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <View style={[styles.footer, {paddingBottom: insets.bottom}]}>
      <TouchableOpacity
        style={styles.receiveFooter}
        onPress={() => {
          mixpanel.track('Accept task from detail task');
          mainFunc();
        }}>
        <View
          style={{
            width: '50%',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontWeight: '600',
              fontSize: normalize(19),
              color: '#ffffff',
              textAlign: 'left',
              left: '15%',
            }}>
            รับงาน
          </Text>
        </View>
        <View
          style={{
            width: '50%',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#014D40',
              width: '40%',
              borderRadius: 39,
              left: '50%',
            }}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontWeight: '600',
                fontSize: normalize(19),
                color: '#ffffff',
                textAlign: 'center',
              }}>
              {minutes + ':' + (seconds < 10 ? `0${seconds}` : seconds)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  receiveFooter: {
    width: '100%',
    height: normalize(49),
    borderRadius: normalize(8),
    backgroundColor: '#2EC66E',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: normalize(10),
  },
});
