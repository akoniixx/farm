import React from 'react'
import { View, Text, Image, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar, ViewProps } from 'react-native'
import { colors, font } from '../assets'
import { normalize } from '../function/Normalize'
import Icon from 'react-native-vector-icons/AntDesign';

interface Prop {
  title?: string
  showBackBtn?: boolean
  onPressBack?: () => void
  headerRight?: () => JSX.Element
  headerLeft?: () => JSX.Element
  style?: ViewProps
}

const CustomHeader: React.FC<Prop> = ({ style, title, showBackBtn, onPressBack, headerLeft, headerRight }) => {
  return (
    <SafeAreaView style={[styles.headerSafeArea, style]}>
      <View style={styles.headerWraper}>
        <View style={styles.headerLeftWrapper}>
          {showBackBtn && (
            <TouchableOpacity style={{ paddingVertical: 14,paddingHorizontal:24 }} onPress={onPressBack}>
              <Icon name="left" size={30} color="black" />
            </TouchableOpacity>
          )}
          {headerLeft?.()}
        </View>
        <View style={styles.headerTitleWraper}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.headerRightWrapper}>{headerRight?.()}</View>
      </View>
    </SafeAreaView>
  )
}

export default CustomHeader

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
    flex: 2,
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
    fontSize: normalize(20),
    color : colors.fontBlack,
    textAlign: 'center',
  },
})
