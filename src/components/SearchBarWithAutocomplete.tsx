import React, { FunctionComponent, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ViewStyle,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { colors, font, icons } from '../assets';
import { PredictionType } from '../screens/RegisterScreen/ThirdFormScreen';
import { normalize } from '@rneui/themed';
import Icon from 'react-native-vector-icons/AntDesign';
import Text from './Text/Text';

type SearchBarProps = {
  value: string;
  style?: ViewStyle | ViewStyle[];
  onChangeText: (text: string) => void;
  predictions: PredictionType[];
  onPredictionTapped: (placeId: string, description: string) => void;
};
const SearchBarWithAutocomplete: FunctionComponent<SearchBarProps> = props => {
  const { value, style, onChangeText, onPredictionTapped, predictions } = props;

  const { container } = styles;
  const passedStyles = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style;
  // const inputBottomRadius = showPredictions
  //   ? {
  //       borderBottomLeftRadius: 10,
  //       borderBottomRightRadius: 10,
  //     }
  //   : {
  //       borderBottomLeftRadius: 10,
  //       borderBottomRightRadius: 10,
  //     };

  const _renderPredictions = (predictions: PredictionType[]) => {
    return (
      <FlatList
        data={predictions}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.predictionRow}
              onPress={() =>
                onPredictionTapped(item.place_id, item.description)
              }>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.myLocation}
                  style={{
                    width: 26,
                    height: 26,
                    marginRight: 16,
                  }}
                />
                <View style={{ flex: 0.9 }}>
                  <Text numberOfLines={1} style={styles.list}>
                    {item.terms[0].value}
                  </Text>
                  <Text style={styles.list2}>{item.description}</Text>
                </View>
              </View>
              <Image
                source={icons.topLeft}
                resizeMode="contain"
                style={{
                  width: 22,
                  height: 22,
                }}
              />
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.place_id}
        keyboardShouldPersistTaps="handled"
      />
    );
  };

  return (
    <View style={[container, { ...passedStyles }]}>
      <View
        style={{
          paddingHorizontal: 16,
        }}>
        <View
          style={{
            borderColor: colors.disable,
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
            height: normalize(55),
            justifyContent: 'space-between',
          }}>
          <TextInput
            onChangeText={onChangeText}
            value={value}
            returnKeyType="search"
            style={[
              [
                // inputBottomRadius,
                container,
              ],
              {
                height: 60,
                justifyContent: 'center',
                lineHeight: 25,
                fontSize: 20,
                paddingHorizontal: 16,
                flex: 1,
                width: '100%',
                color: colors.fontBlack,
                fontFamily: font.SarabunLight,
              },
            ]}
            placeholder={'ระบุสถานที่ใกล้แปลง'}
            placeholderTextColor={colors.disable}
          />
          {value ? (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => {
                onChangeText('');
                onPredictionTapped('', '');
              }}>
              <Icon name="close" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {predictions.length > 0 && _renderPredictions(predictions)}
    </View>
  );
};

const styles = StyleSheet.create({
  clearBtn: {
    flex: 0.1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
  },
  inputStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 10,
    color: 'black',
    fontSize: 18,
    fontFamily: font.SarabunLight,
    borderWidth: 1,
    borderColor: colors.disable,
  },
  predictionsContainer: {
    ...Platform.select({
      ios: {
        backgroundColor: colors.white,
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderRadius: 10,
      },
      android: {
        backgroundColor: colors.white,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderRadius: 10,
      },
    }),
  },
  predictionRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderBottomColor: colors.disable,
    borderBottomWidth: 1,
  },
  list: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.fontGrey,
  },

  list2: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: '#8D96A0',
  },
});

export default SearchBarWithAutocomplete;
