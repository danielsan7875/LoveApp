import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const LocationMap = () => {
  const region = {
    latitude: 10.0735,
    longitude: -69.3229,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <Marker
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title="Nuestra ubicación"
          description="Centro Plaza, Barquisimeto"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  map: {
    width: Dimensions.get('window').width - 40,
    height: 300,
    borderRadius: 12,
  },
});

export default LocationMap;
