import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
  Linking,
  Alert,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, image} from '../../assets';
import CustomHeader from '../../components/CustomHeader';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {ProgressBar} from '../../components/ProgressBar';
import Geolocation from 'react-native-geolocation-service';
import fonts from '../../assets/fonts';
import ActionSheet from 'react-native-actions-sheet';
import { icons } from "../../assets"
import Animated from 'react-native-reanimated';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'react-native-image-picker';
import { normalize } from '../../functions/Normalize';
import { PlantSelect } from '../../components/PlantSelect';
import { plantList } from '../../definitions/plants';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';


const AddPlotScreen: React.FC<any> = ({route, navigation}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
    const [plantListSelect, setPlantListSelect] = useState(plantList);


  return (
    <SafeAreaView style={stylesCentral.container}>
      <CustomHeader
        title="เพิ่มแปลงเกษตร"
        showBackBtn
        onPressBack={() => navigation.goBack()}
      />
      <View style={styles.first}>
        <View style={styles.inner}>
          <View style={styles.container}>
            <ScrollView>
            <Text style={[styles.h1, {marginTop: normalize(39)}]}>ชื่อแปลงเกษตร</Text>
            <TextInput
              style={styles.input}
              editable={true}
              placeholder={'ระบุชื่อแปลงเกษตร'}
              placeholderTextColor={colors.disable}
            />
              <Text style={styles.h1}>จำนวนไร่</Text>
            <TextInput
              style={styles.input}
              editable={true}
              placeholder={'ระบุจำนวนไร่'}
              placeholderTextColor={colors.disable}
            />
               <Text style={styles.h1}>พืชที่ปลูก</Text>
               <View
                style={{
                  top: '5%',
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {plantListSelect.map((v, i) => (
                  <PlantSelect
                    key={i}
                    label={v.value}
                    active={v.active}
                  />
                ))}
              </View>
              <TextInput
              style={[styles.input, {top: '2%'}]}
              editable={true}
              placeholder={'เพิ่มพืชอื่นๆ'}
              placeholderTextColor={colors.disable}
            />
            <Text style={[styles.h1, {marginTop: normalize(39)}]}>
            เลือกตำแหน่งแปลง
              </Text>
              <View
                style={{
                  borderColor: colors.gray,
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  marginVertical: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={image.map}
                  style={{
                    width: normalize(24),
                    height: normalize(22),
                    marginRight: 10,
                  }}
                />
                <Text
                  style={{
                    fontFamily: fonts.AnuphanMedium,
                    fontSize: normalize(16),
                    color: colors.gray,
                  }}>
                </Text>
              </View>
              <View style={{flex: 1}}>
                <MapView.Animated
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  showsUserLocation={true}
                  // onRegionChangeComplete={region => setPosition(region)}
                  showsMyLocationButton={true}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default AddPlotScreen;

const styles = StyleSheet.create({
  first: {
    flex: 1,
    justifyContent: 'space-around',
  },
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(18),
    color: colors.fontBlack,
  },
  h2: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  varidate: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(12),
    color: 'red',
  },
  hSheet: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.AnuphanLight,
    fontSize: normalize(14),
    color: colors.gray,
  },
  container: {
    flex: 1,
  },

  map: {
    width: normalize(344),
    height: normalize(190),
  },
  markerFixed: {
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
    position: 'absolute',
    top: '50%',
  },
  marker: {
    height: normalize(31),
    width: normalize(26),
  },
  input: {
    fontFamily: font.Sarabun,
    height: normalize(56),
    marginVertical: 12,
    padding: 10,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontSize: normalize(16),
  },
});
