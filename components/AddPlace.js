import React, { useState, useEffect } from "react";
import { Overlay, Input } from "@rneui/themed";
import { Text, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { View } from "react-native";
import useMLkit from "../functions/useMLkit";
import useRealm from "../functions/useRealm";
import GetLocation from "react-native-get-location";
import Geocoder from "@timwangdev/react-native-geocoder";

// import styles from "../stylesheet";

// The AddTask is a button for adding tasks. When the button is pressed, an
// overlay shows up to request user input for the new task name. When the
// "Create" button on the overlay is pressed, the overlay closes and the new
// task is created in the realm.
export function AddPlace({ createPlace }) {
  const [placeName, setPlaceName] = useState("");
  const [placeType, setPlaceType] = useState("");
  const [placeLocation, setPlaceLocation] = useState([]);
  const [placeAddress, setPlaceAddress] = useState("");
  const [placePhone, setPlacePhone] = useState("");
  const [placeEmail, setPlaceEmail] = useState("");
  const [placeWebsite, setPlaceWebsite] = useState("");
  const [currentLocation, setCurrentLocation] = useState([]);
  const [scannedLocation, setScannedLocation] = useState(null);
  const [scannedAddress, setScannedAddress] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [moreInfo, setMoreInfo] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [textArray, setTextArray] = useState(null);
  const { recognizeFromCamera, recognizeFromPicker } = useMLkit();
  const { places, createplace } = useRealm();

  useEffect(() => {
    // Get current Location
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        setCurrentLocation([location.longitude, location.latitude]);
        // console.log(`Hadi hiya : ${currentLocation}`);
        // console.log(location);
        // console.log(`[${location.latitude},${location.longitude}]`);
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
      });
    // Use geocoder
    (async () => {
      let loc = await Geocoder.geocodeAddress(textArray.join());
      let position = [];
      loc.map((block) => {
        // console.log(`[${block.position.lat},${block.position.lng}]`);
        setScannedLocation([block.position.lat, block.position.lng]);
        console.log(`Hada li scanni ${scannedLocation}`);
        // console.log(block.formattedAddress);
        position = { lat: block.position.lat, lng: block.position.lng };
      });
      // Use reverse geocoder
      let test = await Geocoder.geocodePosition(position);
      console.log(test);
      // console.log(loc);
    })();
  }, [textArray]);

  return (
    <>
      <Overlay
        isVisible={overlayVisible}
        overlayStyle={{
          width: "90%",
          backgroundColor: "black",
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
        onBackdropPress={() => setOverlayVisible(false)}
      >
        {!textArray ? (
          <>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Choose a picture of place panel or its card
            </Text>
            <Button
              mode="contained"
              color="black"
              onPress={() => {
                setMoreInfo(false);
                recognizeFromCamera(setTextArray);
              }}
              style={{
                width: 350,
                borderRadius: 50,
                margin: 4,
              }}
            >
              Pick from Camera
            </Button>
            <Button
              mode="contained"
              color="black"
              onPress={() => {
                setMoreInfo(false);
                recognizeFromPicker(setTextArray);
              }}
              style={{
                width: 350,
                borderRadius: 50,
                margin: 4,
              }}
            >
              Pick from gallery
            </Button>
          </>
        ) : (
          <>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <Input
                placeholder="Name"
                onChangeText={setPlaceName}
                defaultValue={textArray[0]}
                containerStyle={{ width: 170 }}
                style={{
                  color: "white",
                  width: 170,
                }}
                autoFocus={true}
              />
              <Picker
                selectedValue={selectedValue}
                style={{
                  height: 50,
                  width: 170,
                }}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
              >
                <Picker.Item label="Store" value="store" />
                <Picker.Item label="Cafe" value="cafe" />
                <Picker.Item label="Restaurant" value="restaurant" />
              </Picker>
            </View>
            {!moreInfo ? (
              <>
                <Button
                  color="black"
                  onPress={() => setMoreInfo(true)}
                  style={{
                    width: 350,
                    borderRadius: 50,
                    margin: 4,
                  }}
                >
                  <Text style={{ color: "white" }}>
                    Want to add more infos ?
                  </Text>
                </Button>
              </>
            ) : (
              <>
                <Input
                  onChangeText={setPlacePhone}
                  placeholder="Phone "
                  containerStyle={{ width: 350 }}
                  style={{
                    color: "white",
                  }}
                  autoFocus={true}
                />
                <Input
                  onChangeText={setPlaceEmail}
                  placeholder="Email"
                  containerStyle={{ width: 350 }}
                  style={{
                    color: "white",
                  }}
                  autoFocus={true}
                />
                <Input
                  onChangeText={setPlaceWebsite}
                  placeholder="Website"
                  containerStyle={{ width: 350 }}
                  style={{
                    color: "white",
                  }}
                  autoFocus={true}
                />
              </>
            )}
            <View style={{ flexDirection: "row" }}>
              <Button
                mode="contained"
                color="black"
                onPress={() => setTextArray(null)}
                style={{
                  width: 170,
                  borderRadius: 50,
                  margin: 4,
                }}
              >
                Confirm
              </Button>
              <Button
                mode="contained"
                color="black"
                onPress={() => {
                  setTextArray(null);
                  setOverlayVisible(false);
                }}
                style={{
                  width: 170,
                  borderRadius: 50,
                  margin: 4,
                }}
              >
                Cancel
              </Button>
            </View>
          </>
        )}
      </Overlay>
      <Button
        mode="contained"
        color="black"
        onPress={() => setOverlayVisible(true)}
        style={{
          position: "absolute",
          top: 35,
          width: 350,
          borderRadius: 50,
        }}
      >
        Add place to map
      </Button>
    </>
  );
}
