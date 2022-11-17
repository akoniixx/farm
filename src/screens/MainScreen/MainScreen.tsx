import {Switch} from '@rneui/themed';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, font} from '../../assets';
import {stylesCentral} from '../../styles/StylesCentral';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Avatar} from '@rneui/base';
import icons from '../../assets/icons/icons';
import {SheetManager} from 'react-native-actions-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {normalize, width} from '../../functions/Normalize';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import image from '../../assets/images/image';
const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;
const MainScreen: React.FC<any> = ({navigation, route}) => {

  return (
    <BottomSheetModalProvider>
      <View style={[stylesCentral.container]}>
        <View style={{flex: 2}}>
          <View>
            <ImageBackground
              source={image.bgHead}
              style={{
                width: (windowWidth * 380) / 375,
                height: (windowHeight * 300) / 812,
              }}
            >
                   <View style={styles.headCard}>
            <View>
              <Text
                style={{
                  fontFamily: font.AnuphanMedium,
                  fontSize: normalize(18),
                  color: colors.fontBlack,
                }}>
                ยินดีต้อนรับ
              </Text>
              <Text
                style={{
                  fontFamily: font.AnuphanBold,
                  fontSize: normalize(26),
                  color: colors.orange,
                }}>
                Icon
                <Text
                  style={{
                    fontFamily: font.AnuphanBold,
                    fontSize: normalize(26),
                    color: colors.greenLight,
                  }}>
                  Kaset
                </Text>
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', top: '35%'}}>
            <View
              style={{
                backgroundColor: '#3B996E',
                marginHorizontal: 15,
                paddingHorizontal: 10,
                paddingVertical: normalize(10),
                width: 180,
                height: 150,
                borderRadius: 24,
                alignItems: 'center',
              }}>
              <Image source={icons.drone}/>

              <Text style={styles.font}>จ้างโดรนเกษตร</Text>
            </View>
            <View
              style={{
                backgroundColor: '#ECFBF2',
                marginHorizontal: 10,
                paddingHorizontal: 10,
                paddingVertical: normalize(10),
                width: 180,
                height: 150,
                borderRadius: 24,
                alignItems: 'center',
              }}>
              <Image source={icons.plots} />
              <Text style={styles.font1}>แปลงของคุณ</Text>
            </View>
          </View>
            </ImageBackground>
          </View>
        </View>
      </View>
    </BottomSheetModalProvider>
  );
};
export default MainScreen;

const styles = StyleSheet.create({
  headCard: {
    top: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(23),
    paddingTop: normalize(5),
  },
  activeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayBg,
    padding: normalize(5),
    borderRadius: normalize(12),
    marginTop: normalize(10),
  },
  activeFont: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(14),
    marginLeft: normalize(18),
    color: colors.fontBlack,
  },
  font: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
    color: colors.white,
  },
  font1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
    color: colors.greenDark,
  },
});
