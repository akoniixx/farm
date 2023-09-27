import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font } from '../../../assets';
import CustomHeader from '../../../components/CustomHeader';
import { normalize } from '../../../functions/Normalize';
import { stylesCentral } from '../../../styles/StylesCentral';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ProfileDatasource } from '../../../datasource/ProfileDatasource';
// import { plant } from '../../../definitions/plants';
import PredictionType from '../../RegisterScreen/ThirdFormScreen';
// import fonts from '../../../assets/fonts';
// import icons from '../../../assets/icons/icons';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import ActionSheet from 'react-native-actions-sheet';
// import { PlantSelect } from '../../../components/PlantSelect/PlantSelect';
// import SearchBarWithAutocomplete from '../../../components/SearchBarWithAutocomplete';
// import Geolocation from 'react-native-geolocation-service';
// import axios from 'axios';
// import { useDebounce } from '../../../hook/useDebounce';
// import { QueryLocation } from '../../../datasource/LocationDatasource';
// import { LAT_LNG_BANGKOK } from '../../../definitions/location';
// import { PlotDatasource } from '../../../datasource/PlotDatasource';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import PlotForm from './PlotForm';
import { PlotDatasource } from '../../../datasource/PlotDatasource';
import { mixpanel } from '../../../../mixpanel';
// import Icon from 'react-native-vector-icons/AntDesign';
// import { CropDatasource } from '../../../datasource/CropDatasource';
// import Text from '../../../components/Text/Text';
// import { mixpanel } from '../../../../mixpanel';
// import useTimeSpent from '../../../hook/useTimeSpent';
// import InputTextLabel from '../../../components/InputText/InputTextLabel';

export type PredictionType = {
  description: string;
  place_id: string;
  reference: string;
  matched_substrings: any[];
  tructured_formatting: Object[];
  terms: Object[];
  types: string[];
};
export interface SubmitPlotType {
  plotName: string;
  raiAmount: number;
  landmark: string;
  plantName: string;
  lat: string;
  long: string;
  search: {
    term: string;
    prediction: PredictionType[];
  };
  selectPlot: any;
  position: any;
  timeSpent: number;
  plotLength: number;
}

const AddPlotScreen: React.FC<any> = ({ navigation, route }) => {
  const { fromRegister } = route.params;

  const [loading, setLoading] = useState(false);

  const onSubmitCreatePlot = async ({
    plotName,
    raiAmount,
    landmark,
    plantName,
    lat,
    long,
    search,
    selectPlot,
    position,
    timeSpent,
    plotLength,
  }: SubmitPlotType) => {
    setLoading(true);
    if (!plotName) {
      const plotNameNull = 'แปลงที่ ' + `${plotLength + 1} ${plantName}`;
      PlotDatasource.addFarmerPlot(
        plotNameNull,
        raiAmount,
        landmark,
        plantName,
        position.latitude,
        position.longitude,
        search.term,
        selectPlot.subdistrictId,
      )
        .then(() => {
          mixpanel.track('AddPlotScreen_SavePlot_tapped', {
            plotName: plotNameNull,
            raiAmount: raiAmount,
            landmark: landmark,
            plantName: plantName,
            latitude: position.latitude,
            longitude: position.longitude,
            subSubdistrictId: selectPlot.subdistrictId,
            searchTerm: search.term,
            navigateTo: fromRegister ? 'SecondFormScreen' : 'AllPlotScreen',

            timeSpent,
          });
          setLoading(false);
          setTimeout(() => {
            if (fromRegister) {
              navigation.goBack();
            } else {
              navigation.navigate('AllPlotScreen');
            }
          }, 500);
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });
    } else {
      PlotDatasource.addFarmerPlot(
        plotName,
        raiAmount,
        landmark,
        plantName,
        lat,
        long,
        search.term,
        selectPlot.subdistrictId,
      )
        .then(() => {
          mixpanel.track('AddPlotScreen_SavePlot_tapped', {
            plotName: plotName,
            raiAmount: raiAmount,
            landmark: landmark,
            plantName: plantName,
            latitude: lat,
            longitude: long,
            subSubdistrictId: selectPlot.subdistrictId,
            term: search.term,
            navigateTo: fromRegister ? 'SecondFormScreen' : 'AllPlotScreen',
            timeSpent,
          });
          setLoading(false);
          setTimeout(() => {
            if (fromRegister) {
              navigation.goBack();
            } else {
              navigation.navigate('AllPlotScreen');
            }
          }, 500);
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <>
      <SafeAreaView style={stylesCentral.container}>
        <CustomHeader
          title="เพิ่มแปลงเกษตร"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <PlotForm
          navigation={navigation}
          onSubmitCreatePlot={onSubmitCreatePlot}
          setLoading={setLoading}
          fromRegister={fromRegister}
        />

        <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={{ color: colors.bg }}
        />
      </SafeAreaView>
    </>
  );
};
export default AddPlotScreen;
const styles = StyleSheet.create({
  clearBtn: {
    flex: 0.1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  empty_state: {
    alignSelf: 'center',
    top: '10%',
  },
  list: {
    fontFamily: font.SarabunMedium,
    fontSize: normalize(18),
    color: colors.fontGrey,
  },
  textPending: {
    width: normalize(350),
    height: normalize(70),
    backgroundColor: '#FFF9F2',
    borderRadius: normalize(12),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  search: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    alignItems: 'flex-end',
    tintColor: colors.fontGrey,
  },
  body: {
    paddingHorizontal: 20,
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: 40,
    borderRadius: 5,
    margin: 10,
  },
  imageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
    tintColor: colors.disable,
  },
  ButtonLocation: {
    left: '50%',
    marginLeft: 5,
    marginTop: 40,
    position: 'absolute',
    top: '50%',
  },
  item: {
    top: normalize(20),
    fontSize: normalize(16),
    height: normalize(63),
    fontFamily: font.SarabunLight,
  },
  head: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.fontGrey,
    top: 5,
  },
  first: {
    flex: 1,
    justifyContent: 'space-around',
  },
  button: {
    width: normalize(160),
  },
  inner: {
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'space-around',
  },
  h1: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
  },
  h2: {
    fontFamily: font.SarabunLight,
    fontSize: normalize(16),
    color: colors.fontBlack,
    textAlign: 'center',
  },
  h3: {
    fontFamily: font.AnuphanMedium,
    fontSize: normalize(14),
    color: colors.gray,
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

  rectangleFixed: {
    position: 'relative',
    top: '10%',
  },
  btAdd: {
    top: normalize(100),
    borderRadius: 10,
    height: normalize(80),
    width: normalize(340),
    borderStyle: 'dashed',
    position: 'relative',
  },
  buttonAdd: {
    top: normalize(40),
    borderColor: '#1F8449',
    borderWidth: 1,
    borderRadius: 10,
    height: normalize(80),
    width: normalize(330),
    borderStyle: 'dashed',
    position: 'relative',
    alignSelf: 'center',
  },
  textaddplot: {
    fontFamily: font.AnuphanBold,
    fontSize: normalize(20),
    color: colors.greenLight,
    textAlign: 'center',
    top: '30%',
  },
  rectangle: {
    height: normalize(170),
    width: normalize(375),
    bottom: '15%',
    alignSelf: 'center',
  },
  map: {
    alignSelf: 'center',
    width: normalize(344),
    height: normalize(190),
    borderRadius: normalize(20),
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
    display: 'flex',
    paddingHorizontal: normalize(10),
    alignItems: 'center',
    flexDirection: 'row',
    height: normalize(56),
    marginVertical: 12,
    borderColor: colors.disable,
    borderWidth: 1,
    borderRadius: normalize(10),
    color: colors.fontBlack,
    fontFamily: font.SarabunLight,
    fontSize: normalize(20),
  },
});
