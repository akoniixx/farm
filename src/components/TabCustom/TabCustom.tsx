import {Animated, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import colors from '../../assets/colors/colors';
import Text from '../Text';
import {font} from '../../assets';
export default function TabSelector({
  value,
  tabs,
  tabWidth = 80,
  height = 44,
  onChangeTab,
}: {
  tabWidth?: number;
  value: string;
  onChangeTab: (value: string) => void;
  tabs: {
    value: string;
    title: string;
  }[];
  height?: number;
}) {
  const [animation] = useState(new Animated.Value(0));
  const active = tabs.findIndex(tab => tab.value === value);
  const handleTabPress = (tabIndex: number) => {
    onChangeTab(tabs[tabIndex].value);
    Animated.spring(animation, {
      toValue: tabIndex,
      useNativeDriver: true,
      speed: 1,
    }).start();
  };

  const translateX =
    tabs.length > 1
      ? animation.interpolate({
          inputRange: tabs.map((_, index) => index),
          outputRange: tabs.map((_, index) => index * tabWidth),
        })
      : 0;
  return (
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      directionalLockEnabled
      horizontal
      style={{
        flexDirection: 'row',
        paddingVertical: 8,
        height,
        alignSelf: 'flex-start',
      }}>
      {[...tabs].map((tab, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              handleTabPress(index);
            }}
            key={tab.value}
            style={[
              styles({
                tabWidth,
              }).tab,
            ]}>
            <Text
              style={{
                color: colors.white,
                fontSize: 16,
                fontFamily: font.bold,
              }}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
      {active !== -1 && (
        <Animated.View
          style={[styles({tabWidth}).tabSelector, {transform: [{translateX}]}]}
        />
      )}
    </ScrollView>
  );
}

const styles = ({tabWidth}: {tabWidth: number}) => {
  return StyleSheet.create({
    tab: {
      height: 24,
      width: tabWidth,

      justifyContent: 'center',
      alignItems: 'center',
    },
    tabSelector: {
      position: 'absolute',
      zIndex: -1,
      width: tabWidth ? tabWidth * 0.8 : 0,
      bottom: 0,
      left: tabWidth ? tabWidth * 0.1 : 0,

      height: 4,
      backgroundColor: colors.white,

      borderRadius: 4,
    },
  });
};
