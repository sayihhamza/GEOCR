import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MapboxGL from '@react-native-mapbox-gl/maps';
import useRealm from './functions/useRealm';
import useMLkit from './functions/useMLkit';
import {Searchbar, Button, FAB} from 'react-native-paper';

const accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
MapboxGL.setAccessToken(accessToken);
MapboxGL.setConnected(true);

const App = () => {
  const [textArray, setTextArray] = useState([]);

  const {places, createplace} = useRealm();
  const {reconizeFromCamera, recognizeFromPicker} = useMLkit();

  return (
    <SafeAreaProvider style={styles.page}>
      <StatusBar translucent backgroundColor="transparent" />
      {textArray ? textArray.map(text => console.log(text)) : null}
      <MapboxGL.MapView
        // styleURL={'mapbox://styles/mapbox/streets-v11'}
        styleURL={'mapbox://styles/mapbox/dark-v10'}
        style={styles.map}>
        <MapboxGL.UserLocation />

        <MapboxGL.Camera
          centerCoordinate={[-5.016864, 34.021562]}
          zoomLevel={14}
          animationMode="flyTo"
        />
      </MapboxGL.MapView>
      <Button
        opacity={0.6}
        mode="contained"
        color="black"
        onPress={() => recognizeFromPicker(setTextArray)}
        style={{
          position: 'absolute',
          top: 35,
          width: 350,
          borderRadius: 50,
        }}>
        Add place to map
      </Button>
      <Searchbar
        placeholder="Search for place in map"
        // onChangeText={onChangeSearch}
        // value={searchQuery}
        iconColor="white"
        theme={{
          dark: true,
          colors: {
            primary: 'white',
            text: 'white',
            placeholder: 'white',
          },
          roundness: 50,
        }}
        style={{
          position: 'absolute',
          top: 80,
          width: 350,
          height: 42,
          backgroundColor: 'black',
          opacity: 0.6,
        }}
      />
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    height: '100%',
    width: '100%',
  },
});
