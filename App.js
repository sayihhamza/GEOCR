import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MapboxGL from "@react-native-mapbox-gl/maps";
import useRealm from "./functions/useRealm";
import GetLocation from "react-native-get-location";
import { SearchPlace } from "./components/SearchPlace";
import { AddPlace } from "./components/AddPlace";
import { ShowPlace } from "./components/ShowPlace";

const accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";
MapboxGL.setAccessToken(accessToken);
MapboxGL.setConnected(true);

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [currentPosition, setCurrentPosition] = useState([]);
  const [userPosition, setUserPosition] = useState([]);
  const [scannedPlace, setScnnedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPlace, setShowPlace] = useState(null);

  const { fetchPlaces } = useRealm();

  useEffect(() => {
    showPlace ? console.log(showPlace) : null;
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 1500000,
    })
      .then((location) => {
        setUserPosition([location.longitude, location.latitude]);
        setCurrentPosition([location.longitude, location.latitude]);
        setLoaded(true);
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
      });
  }, []);

  return (
    <SafeAreaProvider style={styles.page}>
      <StatusBar translucent backgroundColor="transparent" />
      {loaded ? (
        <>
          <MapboxGL.MapView
            // styleURL={"mapbox://styles/mapbox/streets-v11"}
            styleURL={"mapbox://styles/mapbox/dark-v10"}
            style={styles.map}
          >
            <MapboxGL.UserLocation />

            <MapboxGL.Camera
              style={{ marginTop: 12 }}
              centerCoordinate={currentPosition}
              zoomLevel={14}
              animationMode="flyTo"
            />

            {fetchPlaces() ? (
              fetchPlaces()?.map((place) => (
                <MapboxGL.PointAnnotation
                  onSelected={() => {
                    setShowPlace(place);
                  }}
                  id={place?._id.toString()}
                  coordinate={[place?.location[0], place?.location[1]]}
                >
                  <MapboxGL.Callout title={place?.name} />
                </MapboxGL.PointAnnotation>
              ))
            ) : (
              <></>
            )}
            {scannedPlace ? (
              <MapboxGL.PointAnnotation
                id={scannedPlace?._id}
                coordinate={scannedPlace?.location}
              >
                <MapboxGL.Callout title={scannedPlace?.name} />
              </MapboxGL.PointAnnotation>
            ) : (
              <></>
            )}
          </MapboxGL.MapView>
          <SearchPlace
            currentPosition={currentPosition}
            setCurrentPosition={setCurrentPosition}
            scannedPlace={scannedPlace}
            setScnnedPlace={setScnnedPlace}
            showPlace={showPlace}
            setShowPlace={setShowPlace}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <AddPlace />
          {showPlace ? (
            <ShowPlace
              showPlace={showPlace}
              setShowPlace={setShowPlace}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              scannedPlace={scannedPlace}
              setScnnedPlace={setScnnedPlace}
              userPosition={userPosition}
              setUserPosition={setUserPosition}
              currentPosition={currentPosition}
              setCurrentPosition={setCurrentPosition}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  map: {
    height: "100%",
    width: "100%",
  },
});
