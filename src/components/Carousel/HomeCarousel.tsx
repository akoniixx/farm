import React from 'react';
import { Text, View, Image, StyleSheet, Dimensions } from 'react-native';
import { carouselItems } from '../../assets/constant/constant';
import { normalize } from '../../functions/Normalize';
import { stylesCentral } from '../../styles/StylesCentral';
import Carousel from 'react-native-reanimated-carousel';
import { font } from '../../assets';

const HomeCarousel: React.FC<any> = () => {
  const screen = Dimensions.get('window');
  const imageHeight = Math.round((screen.width * 12) / 16);
  const imageWidth = screen.width;
  const RenderItem: React.FC<any> = ({ index }) => {
    return (
      <View style={[stylesCentral.center, { flex: 1 }]}>
        <Image
          source={carouselItems[index].src}
          style={{ height: imageHeight, width: imageWidth }}
          resizeMode={'contain'}
        />
        <View>
          <Text style={styles.headFont}>{carouselItems[index].title}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.detail}>{carouselItems[index].text}</Text>
        </View>
      </View>
    );
  };

  return (
    <Carousel
      width={screen.width}
      pagingEnabled
      data={[1, 2, 3]}
      autoPlay
      scrollAnimationDuration={5000}
      renderItem={({ index }: any) => {
        return <RenderItem index={index} />;
      }}
    />
  );
};

export default HomeCarousel;

const styles = StyleSheet.create({
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
    fontSize: normalize(18),
    color: 'black',
    textAlign: 'center',
    marginTop: normalize(16),
    flexShrink: 1,
  },
});
