import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import HTML from 'react-native-render-html';
import colors from '../../assets/colors/colors';
import CustomHeader from '../../components/CustomHeader';
import { normalize } from '../../functions/Normalize';
import { font } from '../../assets/index';
import { useIsFocused } from '@react-navigation/native';
import { GuruKaset } from '../../datasource/GuruDatasource';
import { momentExtend } from '../../utils/moment-buddha-year';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import { mixpanel } from '../../../mixpanel';
import Text from '../../components/Text/Text';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';

const renderers = {
  iframe: IframeRenderer,
};

const customHTMLElementModels = {
  iframe: iframeModel,
};

const DetailNewsScreen: React.FC<any> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [pinAll, setPinAll] = useState<boolean>(false);
  const [pinMain, setPinMain] = useState<boolean>(false);

  useEffect(() => {
    getGuruById();
  }, [isFocused]);

  const getGuruById = async () => {
    setLoading(true);
    const guruId = await AsyncStorage.getItem('guruId');
    GuruKaset.getById(guruId!)
      .then(res => {
        if (res) {
          setData(res);
          setPinAll(res.pinAll);
          setPinMain(res.pinMain);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, flex: 1 }}>
      <CustomHeader
        showBackBtn
        onPressBack={async () => {
          mixpanel.track('Tab back from Detail Guru Screen');
          navigation.goBack();

          const guruId = await AsyncStorage.getItem('guruId');
          await GuruKaset.updateId(guruId!, 1, pinAll, pinMain);
        }}
      />
      {data !== undefined ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View>
              <ProgressiveImage
                style={{ height: 160 }}
                resizeMode="contain"
                source={{ uri: data.imagePath }}
              />
              <View style={{ paddingHorizontal: 15, top: 15 }}>
                <Text style={styles.text}>{data.title}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 20,
                  paddingHorizontal: 15,
                }}>
                <Text style={styles.textDate} numberOfLines={1}>
                  {momentExtend.toBuddhistYear(data.createAt, 'DD MMM YY')}
                </Text>
                <Text style={[styles.textDate, { left: 15 }]} numberOfLines={1}>
                  {`อ่านแล้ว ` + data.read + ` ครั้ง`}
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 0.3,
                  borderColor: colors.disable,
                  width: Dimensions.get('screen').width * 0.9,
                  alignSelf: 'center',
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 20,
                  paddingHorizontal: 15,
                }}>
                <HTML
                  renderers={renderers}
                  WebView={WebView}
                  customHTMLElementModels={customHTMLElementModels}
                  renderersProps={{
                    iframe: {
                      scalesPageToFit: true,
                      webViewProps: {
                        width: Dimensions.get('screen').width - 30,
                        height: Dimensions.get('screen').width * 0.3,
                      },
                    },
                  }}
                  source={{ html: data.details }}
                  defaultTextProps={{
                    allowFontScaling: false,
                  }}
                  contentWidth={Dimensions.get('screen').width}
                  tagsStyles={{
                    img: {
                      width: Dimensions.get('screen').width - 30,
                      marginRight: 30,
                      resizeMode: 'contain',
                    },
                    strong: {
                      color: colors.grey60,
                      fontSize: normalize(18),
                      fontWeight: '400',
                      lineHeight: 28,
                    },
                    em: {
                      color: colors.grey60,
                      fontSize: normalize(18),
                      fontWeight: '200',
                      lineHeight: 28,
                    },
                    ul: {
                      color: colors.grey60,
                      fontSize: normalize(18),
                      fontWeight: '200',
                      lineHeight: 28,
                    },
                    u: {
                      color: colors.grey60,
                      fontSize: normalize(18),
                      fontWeight: '200',
                      lineHeight: 28,
                    },
                    p: {
                      color: colors.grey60,
                      fontSize: normalize(18),
                      fontWeight: '200',
                      lineHeight: 28,
                      margin: 0,
                      padding: 0,
                    },
                    ol: {
                      color: colors.grey60,
                      fontSize: normalize(18),
                      fontWeight: '200',
                      lineHeight: 28,
                    },
                    li: {
                      color: colors.grey60,
                      fontSize: normalize(18),
                      fontWeight: '200',
                      lineHeight: 28,
                    },
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      ) : null}
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </SafeAreaView>
  );
};

const ImageRenderer = (
  htmlAttribs: any,
  children: any,
  convertedCSSStyles: any,
  passProps: any,
) => {
  const { src } = htmlAttribs;
  return (
    <View style={styles.centeredImageView}>
      <Image source={{ uri: src }} style={styles.centeredImageContent} />
    </View>
  );
};

export default DetailNewsScreen;
const styles = StyleSheet.create({
  card: {
    width: Dimensions.get('window').width - normalize(25),
    height: 'auto',
    borderWidth: 1,
    borderColor: '#D9DCDF',
    margin: normalize(5),
    borderRadius: normalize(10),
  },
  text: {
    fontSize: 20,
    fontFamily: font.AnuphanBold,
    color: colors.fontGrey,
    lineHeight: 28,
  },
  textDate: {
    fontSize: 16,
    fontFamily: font.SarabunLight,
    color: colors.fontGrey,
    lineHeight: 28,
  },
  centeredImageView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredImageContent: {
    width: '100%',
    resizeMode: 'contain',
  },
});
