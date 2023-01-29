import { normalize } from '@rneui/themed';
import { StatusBar, StyleSheet } from 'react-native';
import colors from '../assets/colors/colors';
import fonts from '../assets/fonts';

export const stylesCentral = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    fontFamily: `Anuphan-Light`,
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
    fontFamily: fonts.AnuphanMedium,
    fontSize: normalize(15),
    color: colors.disable,
  },
  containerSubScreen: {
    flex: 1,
    backgroundColor: colors.grayBg,
    paddingTop: normalize(10),
  },
  flexRowBetwen: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
