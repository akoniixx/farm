import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../../navigations/MainNavigator';
import Container from '../../components/Container/Container';
import Content from '../../components/Content/Content';
import MapView, {
  Marker,
  MarkerAnimated,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Header from '../../components/Header/Header';

export default function ViewMapScreen({
  navigation,
  route,
}: StackScreenProps<MainStackParamList, 'ViewMapScreen'>) {
  const {
    location: { latitude, longitude },
    plotName,
  } = route.params;
  const mapRef = React.useRef<MapView>(null);

  const { height, width } = Dimensions.get('window');
  const LATITUDE_DELTA = 0.02;
  const initialLocation = {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LATITUDE_DELTA * (width / height),
  };
  return (
    <Container>
      <Header title={plotName} />
      <Content noPadding>
        <MapView.Animated
          ref={mapRef}
          mapType="satellite"
          maxZoomLevel={22}
          minZoomLevel={18}
          showsTraffic={true}
          style={styles.map}
          zoomEnabled
          zoomTapEnabled
          zoomControlEnabled
          provider={PROVIDER_GOOGLE}
          initialRegion={initialLocation}
          showsUserLocation={true}>
          <Marker
            coordinate={{
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            }}
          />
        </MapView.Animated>
      </Content>
    </Container>
  );
}
const styles = StyleSheet.create({
  map: {
    alignSelf: 'center',
    width: '100%',
    height: '100%',
  },
});
