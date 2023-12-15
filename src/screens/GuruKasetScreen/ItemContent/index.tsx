import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import { Image } from 'react-native';
import { colors, font, icons } from '../../../assets';
import moment from 'moment';
import RenderHTML from 'react-native-render-html';
import FastImage from 'react-native-fast-image';
import { GuruData } from '..';
import Text from '../../../components/Text/Text';
import BadgeGuru from '../../../components/BadgeGuru';
import { numberWithCommas } from '../../../functions/utility';
import { momentExtend } from '../../../utils/moment-buddha-year';

interface Props {
  navigation: any;
  item: GuruData;
}
const Desc = ({ text }: { text: string }) => {
  const htmlCss = useMemo(() => {
    return {
      body: {
        color: colors.fontBlack,
        fontSize: 18,
        fontFamily: font.SarabunRegular,
        width: Dimensions.get('window').width - 100,
        lineHeight: 26,
      },
    };
  }, []);
  return (
    <RenderHTML
      source={{ html: text }}
      defaultTextProps={{
        allowFontScaling: false,
        numberOfLines: 1,
      }}
      ignoredDomTags={['br', 'iframe']}
      contentWidth={Dimensions.get('window').width - 64}
      tagsStyles={htmlCss}
      systemFonts={[
        font.SarabunRegular,
        font.SarabunMedium,
        font.SarabunSemiBold,
        font.SarabunBold,
      ]}
    />
  );
};

export default function ItemContent({ navigation, item }: Props) {
  const loveCount = item.like;
  // const commentCount =  item.commentCount;
  const readCount = item.view;
  const dateCreate = moment(item.createdAt);
  const isMoreThanOneDay = moment().diff(dateCreate, 'days') > 0;
  const dateFormat = momentExtend.toBuddhistYear(dateCreate, 'DD MMMM YYYY');

  const onNavigateToDetail = () => {
    navigation.navigate('GuruKasetDetailScreen', {
      guruId: item._id,
    });
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={onNavigateToDetail}>
        <FastImage
          source={{
            uri: item.image,
            priority: FastImage.priority.normal,
          }}
          style={styles.image}
        />
        <BadgeGuru title={item.groupName} />
      </Pressable>
      <View style={styles.containerFooter}>
        <Text numberOfLines={3} style={styles.textTitle}>
          {item.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            overflow: 'hidden',
            height: 50,
          }}>
          <Desc text={item.description} />
          {/* <Text style={styles.textReadMore}>{' อ่านเพิ่ม'}</Text> */}
        </View>

        <View style={styles.footer}>
          <View style={styles.row}>
            <View style={styles.row}>
              <Image
                source={item.favorite ? icons.loveFill : icons.loveIcon}
                style={styles.icon}
              />
              <Text style={styles.textBold}>{loveCount}</Text>
            </View>
            {/* <View style={styles.row}> 
              <Image source={icons.commentIcon} style={styles.icon} />
              <Text style={styles.textBold}>{commentCount}</Text>
            </View> */}
          </View>
          <View style={styles.row}>
            <Text style={styles.textNormal}>
              {isMoreThanOneDay ? dateFormat : dateCreate.fromNow()}
            </Text>
            <Text style={styles.textNormal}>・</Text>
            <View style={[styles.row, { marginRight: 0 }]}>
              <Image source={icons.showReadIcon} style={styles.icon} />
              <Text style={styles.textNormal}>
                {numberWithCommas(readCount.toString(), true)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('window').width - 32,
    height: Dimensions.get('window').width - 32,
    borderRadius: 10,
  },
  container: {
    marginBottom: 16,
  },
  containerFooter: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 0,
  },
  textTitle: {
    fontSize: 22,
    fontFamily: font.AnuphanSemiBold,
    paddingRight: 32,
  },
  textReadMore: {
    color: colors.gray,
  },
  textDesc: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  textBold: {
    fontFamily: font.AnuphanBold,
    fontSize: 14,
  },
  textNormal: {
    fontSize: 13,
    color: colors.grey40,
    fontFamily: font.SarabunRegular,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.disable,
    marginVertical: 8,
  },
});
