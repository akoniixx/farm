import {normalize} from '@rneui/themed';
import {StatusBar, StyleSheet} from 'react-native';
import {colors, font} from '../assets';

export const stylesCentral = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSafeArea: {
    backgroundColor: '#FFF',
    paddingTop: StatusBar.currentHeight,
  },
  blankFont: {
    fontFamily: font.medium,
    fontSize: normalize(15),
    color: colors.gray,
  },
  containerSubScreen: {
    flex: 1,
    backgroundColor: colors.grayBg,
    paddingTop: normalize(10),
  },
  flexRowBetwen:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  }
});
