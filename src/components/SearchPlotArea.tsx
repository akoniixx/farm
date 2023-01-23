import React, { FunctionComponent, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ViewStyle,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { colors, font, icons } from '../assets';
import { PredictionType } from '../screens/RegisterScreen/ThirdFormScreen';
import { normalize } from '@rneui/themed';

type SearchBarProps = {
  value: string;
  style?: ViewStyle | ViewStyle[];
  onChangeText: (text: string) => void;
  predictions: PredictionType[];
  showPredictions: boolean;
  onPredictionTapped: (placeId: string, description: string) => void;
};
const SearchPlotArea: FunctionComponent<SearchBarProps> = props => {
  const [inputSize, setInputSize] = useState({ width: 0, height: 0 });
  const {
    value,
    style,
    onChangeText,
    onPredictionTapped,
    predictions,
    showPredictions,
  } = props;

  const { container, inputStyle } = styles;
  const passedStyles = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style;
  const inputBottomRadius = showPredictions
    ? {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      }
    : {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      };

  const _renderPredictions = (predictions: PredictionType[]) => {
    const { predictionsContainer, predictionRow } = styles;
    const calculatedStyle = {
      width: inputSize.width,
    };

    return (
      <FlatList
        data={predictions}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={[predictionRow, { flexDirection: 'row' }]}
              onPress={() =>
                onPredictionTapped(item.place_id, item.description)
              }>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={styles.list}>
                  {/* {item.terms[0].value} */}
                </Text>
                <Text numberOfLines={1} style={styles.list2}>
                  {/* {item.description} */}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.place_id}
        keyboardShouldPersistTaps="handled"
        style={[predictionsContainer, calculatedStyle]}
      />
    );
  };

  return (
    <View style={[container, { ...passedStyles }]}>
      <TextInput
        style={[inputStyle, inputBottomRadius]}
        placeholder="ระบุพื้นที่แปลงเกษตร"
        placeholderTextColor="gray"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onLayout={event => {
          const { height, width } = event.nativeEvent.layout;
          setInputSize({ height, width });
        }}
      />
      {showPredictions && _renderPredictions(predictions)}
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: colors.white,
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderRadius: 10,
  },
  predictionRow: {
    height: normalize(65),
    marginBottom: 15,
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

export default SearchPlotArea;
