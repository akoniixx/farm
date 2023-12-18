import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ScrollViewProps,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../assets/colors/colors';
import Text from '../Text';
import {font} from '../../assets';
export default function TabSelector({
  value,
  tabs = [],
  tabWidth = 80,
  height = 44,
  onChangeTab,
  focusColor = colors.white,
  color = colors.white,
  scrollViewStyle,
  fontSize = 16,
  fontFamily = font.bold,
}: {
  fontSize?: number;
  tabWidth?: number;
  value: string;
  onChangeTab: (value: string) => void;
  tabs: {
    value: string;
    title: string;
  }[];
  height?: number;
  focusColor?: string;
  color?: string;
  scrollViewStyle?: ScrollViewProps['style'];
  fontFamily?: string;
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
      style={[
        {
          flexDirection: 'row',
          paddingVertical: 8,
          height,
          alignSelf: 'flex-start',
        },
        scrollViewStyle,
      ]}>
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
                focusColor,
              }).tab,
            ]}>
            <Text
              style={{
                color: value === tab.value ? focusColor : color,
                fontSize,
                fontFamily: fontFamily,
              }}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
      {active !== -1 && (
        <Animated.View
          style={[
            styles({
              tabWidth,
              focusColor,
            }).tabSelector,
            {transform: [{translateX}]},
          ]}
        />
      )}
    </ScrollView>
  );
}

const styles = ({
  tabWidth,
  focusColor,
}: {
  tabWidth: number;
  focusColor: string;
}) => {
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
      backgroundColor: focusColor ? focusColor : colors.white,

      borderRadius: 4,
    },
  });
};
