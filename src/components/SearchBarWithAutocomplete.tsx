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
  PermissionsAndroid,
  Platform,
  Linking,
  Alert,
  ToastAndroid,
} from 'react-native';
import { colors, font, icons } from '../assets';
import ThirdFormScreen, {
  PredictionType,
} from '../screens/RegisterScreen/ThirdFormScreen';
import { normalize } from '@rneui/themed';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/AntDesign';
import { navigationRef } from '../navigations/RootNavigation';

type SearchBarProps = {
  value: string;
  style?: ViewStyle | ViewStyle[];
  onChangeText: (text: string) => void;
  predictions: PredictionType[];
  showPredictions: boolean;
  onPredictionTapped: (placeId: string, description: string) => void;
};
const SearchBarWithAutocomplete: FunctionComponent<SearchBarProps> = props => {
  const [inputSize, setInputSize] = useState({ width: 0, height: 0 });
  const [location, setLocation] = useState(false);
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
              <Image
                source={icons.myLocation}
                style={{
                  width: 26,
                  height: 26,
                  right: 10,
                  alignSelf: 'center',
                }}
              />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={styles.list}>
                  {item.terms[0].value}
                </Text>
                <Text numberOfLines={1} style={styles.list2}>
                  {item.description}
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
  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        'Turn on Location Services to allow  to determine your location.',
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => {} },
        ],
      );
    }

    return false;
  };
  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };
  const getLocation = () => {
    const result = hasLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          (position: any) => {
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    });
  };

  return (
    <View style={[container, { ...passedStyles }]}>
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
            [inputBottomRadius,container],
            {
              fontSize: 19,
              flex: 1,
              color: colors.fontBlack,
              fontFamily: font.SarabunLight,

            },
          ]}
          onLayout={event => {
            const { height, width } = event.nativeEvent.layout;
            setInputSize({ height, width });
          }}
          placeholder={'ระบุสถานที่ใกล้แปลง'}
          placeholderTextColor={colors.disable}
        />
        {value ? (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => {
              onChangeText('')
              onPredictionTapped('','')
            }}
          >
            <Icon name="close" />
          </TouchableOpacity>
        ) : null}
      </View>
      {showPredictions && _renderPredictions(predictions)}
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
    ...Platform.select({
      ios: {
        height: normalize(65),
        marginBottom: 15,
        borderBottomColor: colors.disable,
        borderBottomWidth: 1,
      },
      android: {
        left: 10,
        height: normalize(65),
        marginBottom: 15,
        borderBottomColor: colors.disable,
        borderBottomWidth: 1,
      },
    }),
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
