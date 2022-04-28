import React, {useState} from 'react';
import {Text, View, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MapboxGL from '@react-native-mapbox-gl/maps';
import useRealm from './functions/useRealm';
import {Button} from 'react-native-paper';
// import {SearchBar} from 'react-native-elements';

const accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
MapboxGL.setAccessToken(accessToken);
MapboxGL.setConnected(true);

const App = () => {
  const {places, createplace} = useRealm();

  return (
    <SafeAreaProvider style={styles.page}>
      <StatusBar translucent backgroundColor="transparent" />
      <MapboxGL.MapView
        // styleURL={'mapbox://styles/mapbox/streets-v11'}
        styleURL={'mapbox://styles/mapbox/dark-v10'}
        style={styles.map}>
        <MapboxGL.UserLocation />

        <MapboxGL.Camera
          // centerCoordinate={coordinatesPointer || coordinates}
          zoomLevel={14}
          animationMode="flyTo"
        />
      </MapboxGL.MapView>
      <Button
        opacity={0.6}
        icon="camera"
        mode="contained"
        color="black"
        onPress={() => console.log('Pressed')}
        style={{
          elevation: 1,
          position: 'absolute',
          top: 40,
          width: 350,
          borderRadius: 50,
        }}>
        Add Place
      </Button>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    height: '100%',
    width: '100%',
    elevation: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
