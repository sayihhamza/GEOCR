import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MapboxGL from '@react-native-mapbox-gl/maps';
import useRealm from './functions/useRealm';
import useMLkit from './functions/useMLkit';
import {Searchbar, Button} from 'react-native-paper';
import GetLocation from 'react-native-get-location';
import Geocoder from '@timwangdev/react-native-geocoder';
import {AddPlace} from './components/AddPlace';

const accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
MapboxGL.setAccessToken(accessToken);
MapboxGL.setConnected(true);

const App = () => {
  const [textArray, setTextArray] = useState([]);
  const [currentPosition, setCurrentPosition] = useState([0, 0]);

  const {places, createplace} = useRealm();
  const {reconizeFromCamera, recognizeFromPicker} = useMLkit();

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        setCurrentPosition([location.longitude, location.latitude]);
        console.log(location);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
    (async () => {
      let loc = await Geocoder.geocodeAddress(textArray.join(), {
        locale: 'fr',
        maxResults: 10,
      });
      console.log(loc);
    })();
  }, [textArray]);

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
          centerCoordinate={currentPosition}
          zoomLevel={14}
          animationMode="flyTo"
        />
      </MapboxGL.MapView>
      <Button
        // opacity={0.6}
        mode="contained"
        color="black"
        onPress={() => reconizeFromCamera(setTextArray)}
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
          // opacity: 0.6,
        }}
      />
      <AddPlace />
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
