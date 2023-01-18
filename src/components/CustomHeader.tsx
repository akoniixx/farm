import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ViewProps,
} from 'react-native';
import { normalize } from '../functions/Normalize';
import Icon from 'react-native-vector-icons/AntDesign';
import { colors, font } from '../assets';

interface Prop {
  title?: string;
  showBackBtn?: boolean;
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
  onPressBack,
  headerLeft,
  headerRight,
  image,
}) => {
  return (
    <SafeAreaView style={[styles.headerSafeArea, style]}>
      <View style={styles.headerWraper}>
        <View style={styles.headerLeftWrapper}>
          {showBackBtn && (
            <TouchableOpacity
              style={{ paddingVertical: 14, paddingHorizontal: 24 }}
              onPress={onPressBack}>
              <Icon name="left" size={30} color="black" />
            </TouchableOpacity>
          )}
          {headerLeft?.()}
        </View>
        <View style={styles.headerTitleWraper}>
          <Text style={styles.headerTitle}>{title}</Text>
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
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontBlack,
    textAlign: 'center',
  },
});
