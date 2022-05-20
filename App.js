import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import MapboxGL from "@react-native-mapbox-gl/maps";
import useRealm from "./functions/useRealm";
import GetLocation from "react-native-get-location";
import MapboxDirectionsFactory from "@mapbox/mapbox-sdk/services/directions";
import * as geolib from "geolib";
import { lineString as makeLineString } from "@turf/helpers";
import { SearchPlace } from "./components/SearchPlace";
import { AddPlace } from "./components/AddPlace";
import { ShowPlace } from "./components/ShowPlace";
import { IconAdd } from "./components/Icons/AddIcon.js";
import { IconMinus } from "./components/Icons/MinusIcon";
import { IconPlace } from "./components/Icons/PlaceIcon";
import { IconDirection } from "./components/Icons/DirectionIcon";
import { IconStore } from "./components/Icons/StoreIcon";
import { IconCafe } from "./components/Icons/CafeIcon";
import { IconRestaurant } from "./components/Icons/RestaurantIcon";
import { IconBakery } from "./components/Icons/BakeryIcon";
import { IconGym } from "./components/Icons/GymIcon";
import { IconOther } from "./components/Icons/OtherIcon";
import { IconDarkLight } from "./components/Icons/DarkLightIcon";

const accessToken =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";
MapboxGL.setAccessToken(accessToken);
MapboxGL.setConnected(true);
const directionsClient = MapboxDirectionsFactory({ accessToken });

const layerStyles = {
  routing: {
    lineColor: "#ed5555",
    lineCap: MapboxGL.LineJoin.Round,
    lineWidth: 6,
    lineOpacity: 1,
  },
};

const Stack = createStackNavigator();

const NativeMAP = () => {
  LogBox.ignoreAllLogs();
  const {
    fetchPlaces,
    fetchStores,
    fetchOther,
    fetchGym,
    fetchBakery,
    fetchRestaurants,
    fetchCafes,
  } = useRealm();
  const [loaded, setLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [currentPosition, setCurrentPosition] = useState([]);
  const [userPosition, setUserPosition] = useState([]);
  const [scannedPlace, setScnnedPlace] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPlace, setShowPlace] = useState(null);
  const [showStores, setShowStores] = useState(false);
  const [showCafes, setShowCafes] = useState(false);
  const [showBakery, setShowBakery] = useState(false);
  const [showRestaurants, setShowRestaurants] = useState(false);
  const [showGym, setShowGym] = useState(false);
  const [showOther, setShowOther] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [routing, setRouting] = useState(null);
  const [goBack, setGoBack] = useState(false);
  const [distance, setDistance] = useState(0);
  const [nearestStore, setNearestStore] = useState(null);
  const [nearestCafe, setNearestCafe] = useState(null);
  const [nearestRestaurant, setNearestRestaurant] = useState(null);
  const [nearestBakery, setNearestBakery] = useState(null);
  const [nearestGym, setNearestGym] = useState(null);
  const [nearestOther, setNearestOther] = useState(null);
  const [storesArray, setStoresArray] = useState([]);
  const [cafesArray, setCafesArray] = useState([]);
  const [restaurantsArray, setRestaurantsArray] = useState([]);
  const [bakeryArray, setBakeryArray] = useState([]);
  const [gymArray, setGymArray] = useState([]);
  const [otherArray, setOtherArray] = useState([]);
  const [mapStyleURL, setMapStyleURL] = useState(
    "mapbox://styles/mapbox/dark-v10"
  );

  useEffect(() => {
    const findNearestStore = () => {
      if (fetchStores() != []) {
        fetchStores().forEach((store) =>
          storesArray.push({
            latitude: store.location[0],
            longitude: store.location[1],
            _id: store._id,
            emailAddress: store.emailAddress,
            formattedAddress: store.formattedAddress,
            location: store.location,
            name: store.name,
            phoneNumber: store.phoneNumber,
            type: store.type,
            website: store.website,
          })
        );
      }
      if (storesArray != []) {
        setNearestStore(
          geolib.findNearest(
            { latitude: userPosition[0], longitude: userPosition[1] },
            storesArray
          )
        );
      }
    };
    const findNearestCafe = () => {
      if (fetchCafes() != []) {
        fetchCafes().forEach((cafe) =>
          cafesArray.push({
            latitude: cafe.location[0],
            longitude: cafe.location[1],
            _id: cafe._id,
            emailAddress: cafe.emailAddress,
            formattedAddress: cafe.formattedAddress,
            location: cafe.location,
            name: cafe.name,
            phoneNumber: cafe.phoneNumber,
            type: cafe.type,
            website: cafe.website,
          })
        );
      }
      if (cafesArray != []) {
        setNearestCafe(
          geolib.findNearest(
            { latitude: userPosition[0], longitude: userPosition[1] },
            cafesArray
          )
        );
      }
    };
    const findNearestRestaurant = () => {
      if (fetchRestaurants() != []) {
        fetchRestaurants().forEach((restaurant) =>
          restaurantsArray.push({
            latitude: restaurant.location[0],
            longitude: restaurant.location[1],
            _id: restaurant._id,
            emailAddress: restaurant.emailAddress,
            formattedAddress: restaurant.formattedAddress,
            location: restaurant.location,
            name: restaurant.name,
            phoneNumber: restaurant.phoneNumber,
            type: restaurant.type,
            website: restaurant.website,
          })
        );
      }
      if (restaurantsArray != []) {
        setNearestRestaurant(
          geolib.findNearest(
            { latitude: userPosition[0], longitude: userPosition[1] },
            restaurantsArray
          )
        );
      }
    };
    const findNearestBakery = () => {
      if (fetchBakery() != []) {
        fetchBakery().forEach((bakery) =>
          bakeryArray.push({
            latitude: bakery.location[0],
            longitude: bakery.location[1],
            _id: bakery._id,
            emailAddress: bakery.emailAddress,
            formattedAddress: bakery.formattedAddress,
            location: bakery.location,
            name: bakery.name,
            phoneNumber: bakery.phoneNumber,
            type: bakery.type,
            website: bakery.website,
          })
        );
      }
      if (bakeryArray != []) {
        setNearestBakery(
          geolib.findNearest(
            { latitude: userPosition[0], longitude: userPosition[1] },
            bakeryArray
          )
        );
      }
    };
    const findNearestGym = () => {
      if (fetchGym() != []) {
        fetchGym().forEach((gym) =>
          gymArray.push({
            latitude: gym.location[0],
            longitude: gym.location[1],
            _id: gym._id,
            emailAddress: gym.emailAddress,
            formattedAddress: gym.formattedAddress,
            location: gym.location,
            name: gym.name,
            phoneNumber: gym.phoneNumber,
            type: gym.type,
            website: gym.website,
          })
        );
      }
      if (gymArray != []) {
        setNearestGym(
          geolib.findNearest(
            { latitude: userPosition[0], longitude: userPosition[1] },
            gymArray
          )
        );
      }
    };
    const findNearestOther = () => {
      if (fetchOther() != []) {
        fetchOther().forEach((other) =>
          otherArray.push({
            latitude: other.location[0],
            longitude: other.location[1],
            _id: other._id,
            emailAddress: other.emailAddress,
            formattedAddress: other.formattedAddress,
            location: other.location,
            name: other.name,
            phoneNumber: other.phoneNumber,
            type: other.type,
            website: other.website,
          })
        );
      }
      if (otherArray != []) {
        setNearestOther(
          geolib.findNearest(
            { latitude: userPosition[0], longitude: userPosition[1] },
            otherArray
          )
        );
      }
    };
    findNearestStore();
    findNearestCafe();
    findNearestRestaurant();
    findNearestBakery();
    findNearestGym();
    findNearestOther();
  }, [fetchStores, fetchCafes]);

  useEffect(() => {
    if (currentPosition != userPosition) {
      const fetchRoute = async () => {
        const reqOptions = {
          waypoints: [
            { coordinates: [userPosition[0], userPosition[1]] },
            { coordinates: [currentPosition[0], currentPosition[1]] },
          ],
          profile: "walking",
          geometries: "geojson",
        };
        const res = await directionsClient.getDirections(reqOptions).send();
        setDistance(res.body.routes[0].distance / 1000, 4);
        const newRoute = makeLineString(
          res.body.routes[0].geometry.coordinates
        );
        setRouting(newRoute);
      };
      try {
        showDirections && fetchRoute();
      } catch (error) {
        console.warn(error);
      }
    }
  }, [currentPosition, showDirections, setShowDirections]);

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
  }, [goBack, setGoBack]);

  return (
    <SafeAreaProvider style={styles.page}>
      <StatusBar translucent backgroundColor="transparent" />
      {loaded ? (
        <>
          <MapboxGL.MapView
            // styleURL={"mapbox://styles/mapbox/streets-v11"}
            styleURL={mapStyleURL}
            style={styles.map}
            onPress={(event) => {
              setCurrentPosition(event.geometry.coordinates);
            }}
          >
            <MapboxGL.UserLocation />
            <MapboxGL.Camera
              style={styles.map}
              centerCoordinate={currentPosition}
              zoomLevel={zoomLevel}
              animationMode="flyTo"
            />

            {fetchStores() && showStores ? (
              fetchStores()?.map((place, index) => (
                <MapboxGL.PointAnnotation
                  onSelected={() => {
                    setShowPlace(place);
                    setCurrentPosition([place.location[0], place.location[1]]);
                  }}
                  id={place?._id.toString()}
                  key={index}
                  coordinate={[place?.location[0], place?.location[1]]}
                >
                  <View
                    style={{
                      borderRadius: 50,
                    }}
                  >
                    <IconStore />
                  </View>
                </MapboxGL.PointAnnotation>
              ))
            ) : (
              <></>
            )}
            {fetchCafes() && showCafes ? (
              fetchCafes()?.map((place, index) => (
                <MapboxGL.PointAnnotation
                  onSelected={() => {
                    setShowPlace(place);
                    setCurrentPosition([place.location[0], place.location[1]]);
                  }}
                  id={place?._id.toString()}
                  key={index}
                  coordinate={[place?.location[0], place?.location[1]]}
                >
                  <View
                    style={{
                      borderRadius: 50,
                    }}
                  >
                    <IconCafe />
                  </View>
                </MapboxGL.PointAnnotation>
              ))
            ) : (
              <></>
            )}
            {fetchBakery() && showBakery ? (
              fetchBakery()?.map((place, index) => (
                <MapboxGL.PointAnnotation
                  onSelected={() => {
                    setShowPlace(place);
                    setCurrentPosition([place.location[0], place.location[1]]);
                  }}
                  id={place?._id.toString()}
                  key={index}
                  coordinate={[place?.location[0], place?.location[1]]}
                >
                  <View
                    style={{
                      borderRadius: 50,
                    }}
                  >
                    <IconBakery />
                  </View>
                </MapboxGL.PointAnnotation>
              ))
            ) : (
              <></>
            )}
            {fetchRestaurants() && showRestaurants ? (
              fetchRestaurants()?.map((place, index) => (
                <MapboxGL.PointAnnotation
                  onSelected={() => {
                    setShowPlace(place);
                    setCurrentPosition([place.location[0], place.location[1]]);
                  }}
                  id={place?._id.toString()}
                  key={index}
                  coordinate={[place?.location[0], place?.location[1]]}
                >
                  <View
                    style={{
                      borderRadius: 50,
                    }}
                  >
                    <IconRestaurant />
                  </View>
                </MapboxGL.PointAnnotation>
              ))
            ) : (
              <></>
            )}
            {fetchGym() && showGym ? (
              fetchGym()?.map((place, index) => (
                <MapboxGL.PointAnnotation
                  onSelected={() => {
                    setShowPlace(place);
                    setCurrentPosition([place.location[0], place.location[1]]);
                  }}
                  id={place?._id.toString()}
                  key={index}
                  coordinate={[place?.location[0], place?.location[1]]}
                >
                  <View
                    style={{
                      borderRadius: 50,
                    }}
                  >
                    <IconGym />
                  </View>
                </MapboxGL.PointAnnotation>
              ))
            ) : (
              <></>
            )}
            {fetchOther() && showOther ? (
              fetchOther()?.map((place, index) => (
                <MapboxGL.PointAnnotation
                  onSelected={() => {
                    setShowPlace(place);
                    setCurrentPosition([place.location[0], place.location[1]]);
                  }}
                  id={place?._id.toString()}
                  key={index}
                  coordinate={[place?.location[0], place?.location[1]]}
                >
                  <View
                    style={{
                      borderRadius: 50,
                    }}
                  >
                    <IconOther />
                  </View>
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
            {routing && showDirections ? (
              <MapboxGL.ShapeSource id="routeSource" shape={routing}>
                <MapboxGL.LineLayer
                  id="routeFill"
                  style={layerStyles.routing}
                />
              </MapboxGL.ShapeSource>
            ) : null}
            {showDirections && routing ? (
              <MapboxGL.PointAnnotation coordinate={currentPosition} />
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
          <AddPlace
            userPosition={userPosition}
            currentPosition={currentPosition}
            setCurrentPosition={setCurrentPosition}
            showPlace={showPlace}
            setShowPlace={setShowPlace}
            setShowStores={setShowStores}
            setShowCafes={setShowCafes}
            setShowRestaurants={setShowRestaurants}
            setShowBakery={setShowBakery}
            setShowGym={setShowGym}
            setShowOther={setShowOther}
          />
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
          <View
            style={{
              flexDirection: "column",
              position: "absolute",
              right: 27,
              top: 140,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                width: 45,
                height: 45,
                margin: 5,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setZoomLevel(zoomLevel + 1)}
            >
              <IconAdd />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                width: 45,
                height: 45,
                margin: 5,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setZoomLevel(zoomLevel - 1)}
            >
              <IconMinus />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                width: 45,
                height: 45,
                margin: 5,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setCurrentPosition(userPosition);
                setGoBack(!goBack);
                setZoomLevel(14);
                setShowPlace(null);
              }}
            >
              <IconPlace />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                width: 45,
                height: 45,
                margin: 5,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setShowDirections(!showDirections);
              }}
            >
              <IconDirection />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                width: 45,
                height: 45,
                margin: 5,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                mapStyleURL != "mapbox://styles/mapbox/outdoors-v11"
                  ? setMapStyleURL("mapbox://styles/mapbox/outdoors-v11")
                  : setMapStyleURL("mapbox://styles/mapbox/dark-v10");
              }}
            >
              <IconDarkLight />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: "row", position: "absolute", bottom: 20 }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowStores(!showStores);
                if (!showStores) {
                  setShowPlace(nearestStore);
                  nearestStore.location != []
                    ? setCurrentPosition([
                        nearestStore.location[0],
                        nearestStore.location[1],
                      ])
                    : null;
                }
                !showStores ? setShowPlace(nearestStore) : setShowPlace(null);
              }}
            >
              <Button
                icon={IconStore}
                mode="contained"
                color="black"
                style={{
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  margin: 10,
                }}
              >
                Stores
              </Button>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowCafes(!showCafes);
                if (!showCafes) {
                  setShowPlace(nearestCafe);
                  nearestCafe.location != []
                    ? setCurrentPosition([
                        nearestCafe.location[0],
                        nearestCafe.location[1],
                      ])
                    : null;
                }
                !showCafes ? setShowPlace(nearestCafe) : setShowPlace(null);
              }}
            >
              <Button
                icon={IconCafe}
                mode="contained"
                color="black"
                style={{
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  margin: 10,
                }}
              >
                Cafes
              </Button>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowRestaurants(!showRestaurants);
                if (!showRestaurants) {
                  setShowPlace(nearestRestaurant);
                  nearestRestaurant.location != []
                    ? setCurrentPosition([
                        nearestRestaurant.location[0],
                        nearestRestaurant.location[1],
                      ])
                    : null;
                  setShowPlace(nearestRestaurant);
                }
                !showRestaurants
                  ? setShowPlace(nearestRestaurant)
                  : setShowPlace(null);
              }}
            >
              <Button
                icon={IconRestaurant}
                mode="contained"
                color="black"
                style={{
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  margin: 10,
                }}
              >
                Restaurants
              </Button>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowBakery(!showBakery);
                if (!showBakery) {
                  setShowPlace(nearestBakery);
                  nearestBakery.location != []
                    ? setCurrentPosition([
                        nearestBakery.location[0],
                        nearestBakery.location[1],
                      ])
                    : null;
                  setShowPlace(nearestBakery);
                }
                !showBakery ? setShowPlace(nearestBakery) : setShowPlace(null);
              }}
            >
              <Button
                icon={IconBakery}
                mode="contained"
                color="black"
                style={{
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  margin: 10,
                }}
              >
                Bakery
              </Button>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowGym(!showGym);
                if (!showGym) {
                  setShowPlace(nearestGym);
                  nearestGym.location != []
                    ? setCurrentPosition([
                        nearestGym.location[0],
                        nearestGym.location[1],
                      ])
                    : null;
                  setShowPlace(nearestGym);
                }
                !showGym ? setShowPlace(nearestGym) : setShowPlace(null);
              }}
            >
              <Button
                icon={IconGym}
                mode="contained"
                color="black"
                style={{
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  margin: 10,
                }}
              >
                Sports
              </Button>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowOther(!showOther);
                if (!showOther) {
                  setShowPlace(nearestOther);
                  nearestOther.location != []
                    ? setCurrentPosition([
                        nearestOther.location[0],
                        nearestOther.location[1],
                      ])
                    : null;
                  setShowPlace(nearestOther);
                }
                !showOther ? setShowPlace(nearestOther) : setShowPlace(null);
              }}
            >
              <Button
                icon={IconOther}
                mode="contained"
                color="black"
                style={{
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  margin: 10,
                }}
              >
                Others
              </Button>
            </TouchableOpacity>
          </ScrollView>
        </>
      ) : (
        <></>
      )}
    </SafeAreaProvider>
  );
};

const Welcome = ({ navigation }) => {
  LogBox.ignoreAllLogs();
  const [isSingUp, setIsSingUP] = useState(false);
  const [username, setUsername] = useState("sayihhamza");
  const [email, setEmail] = useState("sayihhamza@gmail.com");
  const [password, setPassword] = useState("Sayihhamza");
  const [confirmPassword, setConfirmPassword] = useState("Sayihhamza");
  const [message, setMessage] = useState("");

  useEffect(() => {
    email.length < 5 && email.length > 0
      ? setMessage("email is short")
      : setMessage("");
    password.length < 5 && password.length > 0
      ? setMessage("password is short")
      : setMessage("");
  }, [email, password]);

  return (
    <View
      style={{
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 25,
          marginBottom: 15,
          color: "grey",
        }}
      >
        WELCOME TO
      </Text>
      <Text
        style={{
          fontSize: 50,
          fontWeight: "bold",
          marginBottom: 40,
          color: "white",
        }}
      >
        GEO OCR
      </Text>
      {isSingUp ? (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={setUsername}
              value={username}
              placeholder="username"
              style={{
                borderColor: "white",
                borderWidth: 2,
                margin: 5,
                padding: 10,
                borderRadius: 15,
                width: 300,
                height: 45,
                fontSize: 15,
                fontWeight: "bold",
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={setEmail}
              value={email}
              placeholder="email"
              style={{
                borderColor: "white",
                borderWidth: 2,
                margin: 5,
                padding: 10,
                borderRadius: 15,
                width: 300,
                height: 45,
                fontSize: 15,
                fontWeight: "bold",
              }}
            />
          </View>
          <View style={{ padding: 5 }}>
            <TextInput
              onChangeText={(text) => setPassword(text)}
              value={password}
              placeholder="password"
              style={{
                borderColor: "white",
                borderWidth: 2,
                margin: 5,
                padding: 10,
                borderRadius: 15,
                width: 300,
                height: 45,
                fontSize: 15,
                fontWeight: "bold",
              }}
              secureTextEntry
            />
          </View>
          <View style={{ padding: 5, marginBottom: 30 }}>
            <TextInput
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              placeholder="Confirm passwrod"
              style={{
                borderColor: "white",
                borderWidth: 2,
                margin: 5,
                padding: 10,
                borderRadius: 15,
                width: 300,
                height: 45,
                fontSize: 15,
                fontWeight: "bold",
              }}
              secureTextEntry
            />
          </View>
          <Button
            mode="contained"
            color="white"
            onPress={() => {
              if (email.length > 5 && password.length > 5) {
                navigation.navigate("App View");
              } else {
                setMessage("email or password is short or invalid");
              }
            }}
            contentStyle={{
              width: 300,
              justifyContent: "center",
            }}
            style={{
              margin: 5,
              width: 300,
              alignItems: "center",
              height: 40,
              borderRadius: 15,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>SING UP</Text>
          </Button>
          <Button
            mode="contained"
            color="black"
            contentStyle={{
              width: 300,
              justifyContent: "center",
            }}
            style={{
              margin: 5,
              width: 300,
              alignItems: "center",
              height: 40,
              borderRadius: 15,
            }}
            onPress={() => setIsSingUP(false)}
          >
            WANT TO SING IN ?
          </Button>
          <Text>{message}</Text>
        </>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={setEmail}
              value={email}
              placeholder="email"
              style={{
                borderColor: "white",
                borderWidth: 2,
                margin: 5,
                padding: 10,
                borderRadius: 15,
                width: 300,
                height: 45,
                fontSize: 15,
                fontWeight: "bold",
              }}
            />
          </View>
          <View style={{ padding: 5, marginBottom: 30 }}>
            <TextInput
              onChangeText={(text) => setPassword(text)}
              value={password}
              placeholder="password"
              style={{
                borderColor: "white",
                borderWidth: 2,
                margin: 5,
                padding: 10,
                borderRadius: 15,
                width: 300,
                height: 45,
                fontSize: 15,
                fontWeight: "bold",
              }}
              secureTextEntry
            />
          </View>
          <Button
            mode="contained"
            color="white"
            onPress={() => {
              if (
                email.length > 5 &&
                password.length > 5 &&
                email.toLocaleLowerCase() == "sayihhamza@gmail.com"
              ) {
                navigation.navigate("App View");
              } else {
                setMessage("email or password is invalid or short");
              }
            }}
            contentStyle={{
              width: 300,
              justifyContent: "center",
            }}
            style={{
              margin: 5,
              width: 300,
              alignItems: "center",
              height: 40,
              borderRadius: 15,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>SING IN</Text>
          </Button>
          <Button
            mode="contained"
            color="black"
            contentStyle={{
              width: 300,
              justifyContent: "center",
            }}
            style={{
              margin: 5,
              width: 300,
              alignItems: "center",
              height: 40,
              borderRadius: 15,
            }}
            onPress={() => setIsSingUP(true)}
          >
            WANT TO SING UP ?
          </Button>
          <Text>{message}</Text>
        </>
      )}
    </View>
  );
};

const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome View"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="App View"
          component={NativeMAP}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  map: {
    flex: 1,
    position: "absolute",
    height: "100%",
    width: "100%",
  },
});
