import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useAuth} from '../../contexts/AuthContext';
import DroneBrandingItem from '../../components/Drone/DroneBranding';

export default function ListDrone() {
  const {
    state: {user},
  } = useAuth();
  if (!user) {
    return null;
  }
  const droneList = user?.dronerDrone.sort((a, b) => {
    return a.createdAt < b.createdAt ? 1 : -1;
  });
  return (
    <View style={styles.container}>
      {droneList.map(drone => {
        return (
          <DroneBrandingItem
            dronebrand={drone.drone.series}
            status={drone.status}
            image={drone.drone.droneBrand.logoImagePath}
            serialbrand={drone.serialNo}
          />
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  cardDrone: {
    height: 100,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
