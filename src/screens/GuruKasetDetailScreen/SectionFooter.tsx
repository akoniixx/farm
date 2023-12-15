import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { colors, font, icons } from '../../assets';
import { SheetManager } from 'react-native-actions-sheet';
import RenderHTML from 'react-native-render-html';
import { GuruKaset } from '../../datasource/GuruDatasource';
import Text from '../../components/Text/Text';
import { numberWithCommas } from '../../functions/utility';
import { useDebounceValue } from '../../hook/useDebounceValue';
import WebView from 'react-native-webview';
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';

const renderers = {
  iframe: IframeRenderer,
};

const customHTMLElementModels = {
  iframe: iframeModel,
};
interface Props {
  loveCount: number;
  commentCount: number;
  description: string;
  favorite?: boolean;
  guruId: string;
  isLoved?: boolean;
  setIsLoved: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function SectionFooter({
  loveCount = 0,
  commentCount,
  description,
  isLoved = false,
  setIsLoved,
  guruId,
}: Props) {
  const [isFirst, setIsFirst] = React.useState(true);
  const onPressLove = () => {
    setIsLoved(prev => !prev);
    setIsFirst(false);
  };
  const debounceValue = useDebounceValue(isLoved, 1000);
  const onOpenComment = async () => {
    await SheetManager.show('commentSheet', {
      payload: {
        commentCount,
      },
    });
  };
  useEffect(() => {
    const updateFavorite = async () => {
      try {
        await GuruKaset.updateFavoriteGuru({
          guruId,
        });
      } catch (error) {
        console.log('error_like', error);
      }
    };
    if (!isFirst) {
      updateFavorite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue, guruId]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionTop}>
        <TouchableOpacity style={styles.row} onPress={onPressLove}>
          <Image
            source={isLoved ? icons.loveFill : icons.loveIcon}
            style={styles.icon}
          />
          <Text
            style={[
              styles.textMedium,
              {
                color: isLoved ? colors.primary : colors.fontBlack,
              },
            ]}>
            ถูกใจได้เลย
            {loveCount > 0 && (
              <Text style={styles.textCount}>{` ${numberWithCommas(
                loveCount?.toString(),
                true,
              )}`}</Text>
            )}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.row} onPress={onOpenComment}>
          <Image source={icons.commentIcon} style={styles.icon} />
          <Text style={styles.textMedium}>
            ความคิดเห็น
            {commentCount > 0 && (
              <Text style={styles.textCount}>{` ${numberWithCommas(
                commentCount.toString(),
                true,
              )}`}</Text>
            )}
          </Text>
        </TouchableOpacity> */}
      </View>
      <View style={styles.content}>
        {/* <Text style={styles.textContent}>{}</Text> */}
        <RenderHTML
          renderers={renderers}
          WebView={WebView}
          // ignoredDomTags={['br']}
          customHTMLElementModels={customHTMLElementModels}
          source={{ html: description }}
          defaultTextProps={{
            allowFontScaling: false,
            style: styles.textContent,
          }}
          contentWidth={Dimensions.get('window').width - 64}
          tagsStyles={{
            body: {
              fontSize: 16,
              color: colors.fontBlack,
              fontFamily: font.SarabunRegular,
            },
          }}
          systemFonts={[
            font.SarabunRegular,
            font.SarabunMedium,
            font.SarabunSemiBold,
            font.SarabunBold,
          ]}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  sectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 50,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.grey5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  textMedium: {
    fontFamily: font.AnuphanMedium,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  content: {
    marginTop: 8,
  },
  textContent: {
    fontSize: 16,
    color: colors.fontBlack,
  },
  textCount: {
    fontSize: 14,
    color: colors.grey40,
  },
});
