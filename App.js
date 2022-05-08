import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
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

const Stack = createStackNavigator();

const NativeMAP = () => {
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
                  key={place?._id.toString()}
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

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: "row", position: "absolute", bottom: 20 }}
          >
            <View
              style={{
                height: 60,
                width: 100,
                borderRadius: 20,
                backgroundColor: "#131313",
                margin: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Stores
              </Text>
            </View>
            <View
              style={{
                height: 60,
                width: 100,
                borderRadius: 20,
                backgroundColor: "#131313",
                margin: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Cafes
              </Text>
            </View>
            <View
              style={{
                height: 60,
                width: 100,
                borderRadius: 20,
                backgroundColor: "#131313",
                margin: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Restaurants
              </Text>
            </View>
            <View
              style={{
                height: 60,
                width: 100,
                borderRadius: 20,
                backgroundColor: "#131313",
                margin: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Bakery
              </Text>
            </View>
            <View
              style={{
                height: 60,
                width: 100,
                borderRadius: 20,
                backgroundColor: "#131313",
                margin: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Gym
              </Text>
            </View>
            <View
              style={{
                height: 60,
                width: 100,
                borderRadius: 20,
                backgroundColor: "#131313",
                margin: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Others
              </Text>
            </View>
          </ScrollView>
        </>
      ) : (
        <></>
      )}
    </SafeAreaProvider>
  );
};

const Welcome = ({ navigation }) => {
  const [email, setEmail] = useState("FUCKING");
  const [password, setPassword] = useState("FUCKING");
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
          fontSize: 40,
          fontWeight: "bold",
          marginBottom: 40,
          color: "white",
        }}
      >
        Native MAP
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="email"
          style={{
            borderColor: "white",
            borderWidth: 1,
            margin: 5,
            padding: 10,
            borderRadius: 15,
            width: 300,
          }}
          autoCapitalize="none"
        />
      </View>
      <View style={{ padding: 5, marginBottom: 50 }}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="password"
          style={{
            borderColor: "white",
            borderWidth: 1,
            margin: 5,
            padding: 10,
            borderRadius: 15,
            width: 300,
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
            setMessage("email or password is short");
          }
        }}
        style={{
          margin: 5,
          width: 300,
          borderRadius: 15,
          alignItems: "center",
        }}
        contentStyle={{ justifyContent: "flex-start" }}
      >
        SING IN
      </Button>
      <Button
        mode="contained"
        color="white"
        onPress={() => {
          if (email.length > 5 && password.length > 5) {
            navigation.navigate("App View");
          } else {
            setMessage("email or password is short");
          }
        }}
        style={{
          margin: 5,
          width: 300,
          borderRadius: 15,
          alignItems: "center",
        }}
        contentStyle={{ justifyContent: "flex-start" }}
      >
        <Text>SING UP</Text>
      </Button>
      <Text>{message}</Text>
    </View>
  );
};

const App = () => {
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
  },
  map: {
    height: "100%",
    width: "100%",
  },
});
