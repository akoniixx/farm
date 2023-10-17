import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../../components/CustomHeader';
import { stylesCentral } from '../../../styles/StylesCentral';
import PredictionType from '../../RegisterScreen/ThirdFormScreen';
import { PlotDatasource, UpdatePlot } from '../../../datasource/PlotDatasource';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { mixpanel } from '../../../../mixpanel';
import PlotForm from './PlotForm';
import { SubmitPlotType } from './AddPlotScreen';

export type PredictionType = {
  description: string;
  place_id: string;
  reference: string;
  matched_substrings: any[];
  tructured_formatting: Object[];
  terms: Object[];
  types: string[];
};

const EditPlotScreen: React.FC<any> = ({ navigation, route }) => {
  const { fromRegister, data } = route.params;

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   getFarmerPlot();
  // }, []);
  // const getFarmerPlot = async () => {
  //   setLoading(true);
  //   const plotId = await AsyncStorage.getItem('plot_id');
  //   PlotDatasource.getFarmerPlotById(plotId!)
  //     .then(res => {
  //       setData(res);
  //       setplotName(res.plotName);
  //       setPlantName(res.plantName);
  //       setraiAmount(res.raiAmount);
  //       setlandmark(res.landmark);
  //       setSelectPlot(res.plotArea);
  //       // setlat(res.lat);
  //       // setlong(res.long);
  //       setPosition(prev => ({
  //         ...prev,
  //         latitude: parseFloat(res.lat),
  //         longitude: parseFloat(res.long),
  //       }));
  //       setSearch({ term: res.locationName });
  //     })
  //     .catch(err => console.log(err))
  //     .finally(() => setLoading(false));
  // };
  const onSubmitEditPlot = async ({
    landmark,
    plantName,
    plotName,
    position,
    raiAmount,
    search,
    selectPlot,
    timeSpent,
  }: SubmitPlotType) => {
    const payload: UpdatePlot = {
      plotName,
      raiAmount,
      landmark,
      plantName,
      lat: position.latitude.toString(),
      long: position.longitude.toString(),
      plotAreaId: selectPlot.subdistrictId,
      locationName: search.term,
      plotId: data.id,
    };
    if (data.status === 'REJECTED') {
      setLoading(true);
      PlotDatasource.updateFarmerPlot({ ...payload, status: 'PENDING' })
        .then(() => {
          setLoading(false);
          mixpanel.track('EditPlotScreen_ButtonSave_tapped', {
            navigateTo: fromRegister ? 'SecondFormScreen' : 'AllPlotScreen',
            plotName,
            raiAmount,
            landmark,
            plantName,
            latitude: position.latitude,
            longitude: position.longitude,
            locationName: search.term,
            subdistrictId: selectPlot.subdistrictId,
            status: 'PENDING',
            timeSpent,
          });
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
      setLoading(true);
      PlotDatasource.updateFarmerPlot({
        ...payload,
        status: data.status,
      })
        .then(() => {
          setLoading(false);
          mixpanel.track('EditPlotScreen_ButtonSave_tapped', {
            navigateTo: fromRegister ? 'SecondFormScreen' : 'AllPlotScreen',
            plotName,
            raiAmount,
            landmark,
            plantName,
            latitude: position.latitude,
            longitude: position.longitude,
            locationName: search.term,
            subdistrictId: selectPlot.subdistrictId,
            timeSpent,
          });
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
      <SafeAreaView style={[stylesCentral.container]}>
        <CustomHeader
          title="แก้ไขแปลงเกษตร"
          showBackBtn
          onPressBack={() => navigation.goBack()}
        />
        <PlotForm
          navigation={navigation}
          onSubmitCreatePlot={onSubmitEditPlot}
          setLoading={setLoading}
          fromRegister={fromRegister}
          initialData={data}
        />

        <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={{ color: '#FFF' }}
        />
      </SafeAreaView>
    </>
  );
};
export default EditPlotScreen;
