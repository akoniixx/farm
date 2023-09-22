import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { carouselItems } from '../../assets/constant/constant';
import { normalize } from '../../functions/Normalize';
import { stylesCentral } from '../../styles/StylesCentral';
import Carousel from 'react-native-reanimated-carousel';
import { colors, font } from '../../assets';
import Text from '../Text/Text';
import { Pagination } from 'react-native-snap-carousel';

interface Props {
  step: number;
  onSnapToItem?: (index: number) => void;
  ref: any;
}
const HomeCarousel: React.FC<Props> = React.forwardRef(
  ({ step, onSnapToItem }, ref) => {
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
      <>
        <Carousel
          scrollAnimationDuration={1000}
          ref={ref as any}
          width={screen.width}
          loop={false}
          onScrollEnd={() => {
            return;
          }}
          onSnapToItem={onSnapToItem}
          data={[1, 2, 3]}
          renderItem={({ index }: any) => {
            return <RenderItem index={index} />;
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: '10%',
          }}>
          <Pagination
            dotsLength={3}
            activeDotIndex={step}
            containerStyle={{ backgroundColor: 'transparent' }}
            dotStyle={styles.dots}
            inactiveDotStyle={styles.inactiveDot}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            renderDots={(activeIndex: number, length: number) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {[...Array(length)].map((_, i) => {
                    return (
                      <View
                        key={i}
                        style={
                          i === activeIndex ? styles.dots : styles.inactiveDot
                        }
                      />
                    );
                  })}
                </View>
              );
            }}
          />
        </View>
      </>
    );
  },
);

export default HomeCarousel;

const styles = StyleSheet.create({
  inactiveDot: {
    width: 24,
    height: 10,
    borderRadius: 10,
    backgroundColor: colors.grey10,
    marginRight: 12,
  },
  dots: {
    backgroundColor: colors.greenLight,
    width: 12,
    height: 12,
    borderRadius: 10,
    marginRight: 12,
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
    fontSize: normalize(18),
    color: 'black',
    textAlign: 'center',
    marginTop: normalize(16),
    flexShrink: 1,
  },
});
