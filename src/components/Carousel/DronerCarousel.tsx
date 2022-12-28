import React from 'react';
import {Text, View, Image, StyleSheet, Dimensions} from 'react-native';
import {normalize, width} from '../../functions/Normalize';
import Carousel from 'react-native-reanimated-carousel';
import {colors, font, icons, image} from '../../assets';
import {Avatar} from '@rneui/themed';

const DronerCarousel: React.FC<any> = () => {
  const screen = Dimensions.get('window');
  const RenderItem: React.FC<any> = ({index}) => {

    
    return (
      <View style={{flex: 1, top: '10%', padding: 10}}>
        <View style={[styles.cards]}>
          <View
            style={[
              {
                backgroundColor: colors.greenDark,
                height: '35%',
                width: normalize(160),
                borderWidth: 0.3,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              },
            ]}>
            <View
              style={{
                borderColor: colors.bg,
                borderWidth: 1,
                width: 30,
                height: 30,
                borderRadius: 15,
                alignSelf: 'flex-end',
                margin: 10,
              }}>
              <Image
                source={icons.heart}
                style={{alignSelf: 'center', width: 20, height: 20, top: 4}}
              />
            </View>
            <View style={{alignSelf: 'center'}}>
              <Avatar
                size={normalize(56)}
                source={image.empty_plot}
                avatarStyle={{
                  borderRadius: normalize(56),
                  borderColor: colors.greenLight,
                  borderWidth: 1,
                }}
              />
            </View>
            <View style={{paddingLeft: 10}}>
              <Text style={styles.h1}>นายเอิร์ท</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={icons.star}
                  style={{width: 20, height: 20, marginRight: 10}}
                />
                <Text style={styles.label}>5.0 คะแนน</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={icons.location}
                  style={{width: 20, height: 20, marginRight: 10}}
                />
                <Text style={styles.label}>จ.เลย</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={icons.distance}
                  style={{width: 20, height: 20, marginRight: 10}}
                />
                <Text style={styles.label}> ห่างคุณ 40 กม</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
<Carousel
      width={screen.width}
      pagingEnabled
      data={[1,2,3,4,5,6,7]}
        // autoPlay
      renderItem={({index}: any) => {
        return <RenderItem index={index} />;
      }}
    />    
  );
};

export default DronerCarousel;

const styles = StyleSheet.create({
  label: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
    justifyContent: 'center',
    alignItems: 'center'
  },
  h1: {
    color: colors.primary,
    fontFamily: font.SarabunBold,
    fontSize: normalize(18),
  },
  cards: {
    backgroundColor: colors.white,
    height:  normalize(250),
    width: normalize(160),
    borderRadius: 10,
    borderWidth: 0.3,
  },
  mainButton: {
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: normalize(8),
    width: normalize(343),
  },
  headFont: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(26),
    color: 'black',
  },
  detail: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(14),
    color: 'black',
    textAlign: 'center',
    marginTop: normalize(16),
    flexShrink: 1,
  },
});
