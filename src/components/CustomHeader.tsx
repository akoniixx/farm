import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ViewProps,
} from 'react-native';
import {colors, font} from '../assets';
import {normalize} from '../function/Normalize';
import Icon from 'react-native-vector-icons/AntDesign';

interface Prop {
  title?: string;
  showBackBtn?: boolean;
  titleColor?: string;
  backgroundColor?: string;
  onPressBack?: () => void;
  headerRight?: () => JSX.Element;
  headerLeft?: () => JSX.Element;
  style?: ViewProps;
  image?: () => JSX.Element;
}

const CustomHeader: React.FC<Prop> = ({
  style,
  title,
  showBackBtn,
  titleColor,
  backgroundColor,
  onPressBack,
  headerLeft,
  headerRight,
  image,
}) => {
  return (
    <SafeAreaView style={[{ backgroundColor: backgroundColor ?? colors.white }, style]}>
      <View style={styles.headerWraper}>
        <View style={styles.headerLeftWrapper}>
          {showBackBtn && (
            <TouchableOpacity
              style={{paddingVertical: 14, paddingHorizontal: 24}}
              onPress={onPressBack}>
              <Icon name="left" size={30} color={titleColor ?? "black"} />
            </TouchableOpacity>
          )}
          {headerLeft?.()}
        </View>
        <View style={styles.headerTitleWraper}>
          <Text style={{
              fontFamily: font.bold,
              fontSize: normalize(20),
              color: titleColor ?? colors.fontBlack,
              textAlign: 'center',
            }}>{title}</Text>
        </View>
        <View style={styles.headerRightWrapper}>{headerRight?.()}</View>
        <View style={styles.fav}>{image?.()}</View>
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerSafeArea: {
    backgroundColor: colors.white,
  },
  headerWraper: {
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
    fontFamily: font.bold,
    fontSize: normalize(18),
    color: colors.fontBlack,
    textAlign: 'center',
  },
  fav: {
    flexDirection: 'row',
    alignItems: 'center',
    right: '5%',
  },
});
