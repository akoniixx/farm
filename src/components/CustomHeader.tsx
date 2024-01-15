import React from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ViewProps,
} from 'react-native';
import { normalize } from '../functions/Normalize';
import Icon from 'react-native-vector-icons/AntDesign';
import { colors, font } from '../assets';
import Text from './Text/Text';

interface Prop {
  title?: string;
  showBackBtn?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  onPressBack?: () => void;
  headerRight?: () => React.ReactNode;
  headerLeft?: () => JSX.Element;
  style?: ViewProps;
  styleWrapper?: ViewProps['style'];
  image?: (() => JSX.Element) | (() => boolean);
}

const CustomHeader: React.FC<Prop> = ({
  style,
  title,
  showBackBtn,
  backgroundColor,
  titleColor,
  onPressBack,
  headerLeft,
  headerRight,
  image,
  styleWrapper,
}) => {
  return (
    <SafeAreaView
      style={[{ backgroundColor: backgroundColor ?? colors.white }, style]}>
      <View style={[styles.headerWrapper, styleWrapper]}>
        <View style={styles.headerLeftWrapper}>
          {showBackBtn && (
            <TouchableOpacity
              style={{ paddingVertical: 14, paddingHorizontal: 24 }}
              onPress={onPressBack}>
              <Icon name="left" size={24} color={titleColor ?? 'black'} />
            </TouchableOpacity>
          )}
          {headerLeft?.()}
        </View>
        <View style={styles.headerTitleWraper}>
          <Text
            style={{
              fontFamily: font.AnuphanSemiBold,
              fontSize: normalize(20),
              color: titleColor ?? colors.fontBlack,
              textAlign: 'center',
            }}>
            {title}
          </Text>
        </View>
        <View style={styles.headerRightWrapper}>{headerRight?.()}</View>
        <View style={styles.fav}>{image?.()}</View>
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  fav: {
    flexDirection: 'row',
    alignItems: 'center',
    right: '5%',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: normalize(75),
  },
  headerTitleWraper: {
    flex: 3,
    justifyContent: 'center',
  },
  headerLeftWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightWrapper: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
    textAlign: 'center',
  },
});
