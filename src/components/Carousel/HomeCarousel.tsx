import React from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {font, image} from '../../assets';
import {carouselItems} from '../../assets/constant/constant';
import {normalize} from '../../function/Normalize';
import {stylesCentral} from '../../styles/StylesCentral';
interface ItemProps {
  title: string;
  text: string;
}

const HomeCarousel: React.FC<any> = () => {
  const screen = Dimensions.get('window');
  const imageHeight = Math.round((screen.width * 9) / 16);
  const imageWidth = screen.width;
  const RenderItem: React.FC<any> = ({index}) => {
    return (
      <View style={[stylesCentral.center, {flex: 1}]}>
        <Image
          source={carouselItems[index].src}
          style={{height: imageHeight, width: imageWidth}}
          resizeMode={'contain'}
        />
        <View>
          <Text style={styles.headFont}>{carouselItems[index].title}</Text>
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
      renderItem={({index}: any) => {
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
    fontFamily: font.bold,
    fontSize: normalize(32),
  },
});
