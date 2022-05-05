import React, { useState, useEffect } from "react";
import { Overlay, Input } from "@rneui/themed";
import { Text, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { View } from "react-native";
import useMLkit from "../functions/useMLkit";
import useRealm from "../functions/useRealm";
import GetLocation from "react-native-get-location";
import Geocoder from "@timwangdev/react-native-geocoder";
import gallery from "../assets/gallery.png";
import add from "../assets/add.png";
import camera from "../assets/camera.png";

export function AddPlace() {
  const [placeName, setPlaceName] = useState("");
  const [placeType, setPlaceType] = useState("Store");
  const [placeLocation, setPlaceLocation] = useState([]);
  const [placeAddress, setPlaceAddress] = useState("no address");
  const [placePhone, setPlacePhone] = useState("");
  const [placeEmail, setPlaceEmail] = useState("");
  const [placeWebsite, setPlaceWebsite] = useState("");
  const [currentLocation, setCurrentLocation] = useState([]);
  const [scannedLocation, setScannedLocation] = useState(null);
  const [scannedAddress, setScannedAddress] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [moreInfo, setMoreInfo] = useState(false);
  const [cameraOption, setCameraOption] = useState(true);
  const [textArray, setTextArray] = useState(null);
  const { recognizeFromCamera, recognizeFromPicker } = useMLkit();
  const { createplace } = useRealm();

  const getPhone = (text) => {
    return text.match(/[\+]?\d{12}|\d{10}|\(\d{3}\)\s?-\d{6}/gi)[0];
  };

  const getWebsite = (text) => {
    return text.match(
      /((www)\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/gi
    )[0];
  };

  const getEmail = (text) => {
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)[0];
  };

  useEffect(() => {
    (async () => {
      if (!scannedLocation) {
        let addr = await Geocoder.geocodePosition({
          lat: currentLocation[1],
          lng: currentLocation[0],
        });

        Object.entries(addr)[0].map((block) =>
          block.formattedAddress != undefined && block.formattedAddress != null
            ? setPlaceAddress(block.formattedAddress)
            : null
        );
      } else {
        console.log(`Scanned address :`, scannedAddress);
        let addr = await Geocoder.geocodePosition({
          lat: placeLocation[0],
          lng: placeLocation[1],
        });
        Object.entries(addr)[0].map((block) =>
          block.formattedAddress
            ? setScannedAddress(block.formattedAddress)
            : null
        );
        setPlaceAddress(scannedAddress);
      }
      textArray[0] ? setPlaceName(textArray[0]) : null;
      textArray !== [] ? setPlacePhone(getPhone(textArray.join("\n"))) : null;
      textArray !== [] ? setPlaceEmail(getEmail(textArray.join("\n"))) : null;
      textArray !== []
        ? setPlaceWebsite(getWebsite(textArray.join("\n")))
        : null;
      currentLocation !== [] ? setPlaceLocation(currentLocation) : null;
      scannedLocation
        ? setPlaceLocation(scannedLocation)
        : setPlaceLocation(currentLocation);
    })();
  }, [textArray, moreInfo, scannedLocation, currentLocation, scannedAddress]);

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        setCurrentLocation([location.longitude, location.latitude]);
      })
      .catch((error) => {
        const { code, message } = error;
        console.warn(code, message);
      });

    (async () => {
      let loc = await Geocoder.geocodeAddress(textArray.join());

      loc.map((block) => {
        setScannedLocation([block.position.lat, block.position.lng]);
      });
    })();
  }, [textArray, moreInfo]);

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
            {cameraOption ? (
              <>
                <Button
                  mode="contained"
                  color="#1F1F1F"
                  icon={camera}
                  onPress={() => {
                    (async () => {
                      await recognizeFromCamera(setTextArray);
                      setMoreInfo(false);
                    })();
                  }}
                  style={{
                    width: 350,
                    borderRadius: 50,
                    margin: 4,
                  }}
                >
                  Card picture
                </Button>
                <Button
                  mode="contained"
                  color="#1F1F1F"
                  icon={camera}
                  onPress={() => {
                    (async () => {
                      await recognizeFromCamera(setTextArray);
                      setMoreInfo(false);
                    })();
                  }}
                  style={{
                    width: 350,
                    borderRadius: 50,
                    margin: 4,
                  }}
                >
                  Panel picture
                </Button>
                <Button
                  color="black"
                  onPress={() => setCameraOption(false)}
                  style={{
                    width: 350,
                    borderRadius: 50,
                    margin: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>
                    want to open gallery ?
                  </Text>
                </Button>
              </>
            ) : (
              <>
                <Button
                  mode="contained"
                  color="#1F1F1F"
                  icon={gallery}
                  onPress={() => {
                    (async () => {
                      await recognizeFromPicker(setTextArray);
                      setMoreInfo(false);
                    })();
                  }}
                  style={{
                    width: 350,
                    borderRadius: 50,
                    margin: 4,
                  }}
                >
                  Card picture
                </Button>
                <Button
                  mode="contained"
                  color="#1F1F1F"
                  icon={gallery}
                  onPress={() => {
                    (async () => {
                      await recognizeFromPicker(setTextArray);
                      setMoreInfo(false);
                    })();
                  }}
                  style={{
                    width: 350,
                    borderRadius: 50,
                    margin: 4,
                  }}
                >
                  Panel picture
                </Button>
                <Button
                  color="black"
                  onPress={() => setCameraOption(true)}
                  style={{
                    width: 350,
                    borderRadius: 50,
                    margin: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 10 }}>
                    want to open camera ?
                  </Text>
                </Button>
              </>
            )}
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
                selectedValue={placeType}
                style={{
                  height: 50,
                  width: 170,
                }}
                onValueChange={(itemValue) => setPlaceType(itemValue)}
              >
                <Picker.Item label="Store" value="Store" />
                <Picker.Item label="Cafe" value="Cafe" />
                <Picker.Item label="Restaurant" value="Restaurant" />
                <Picker.Item label="Bakery" value="Bakery" />
                <Picker.Item label="Gym" value="Gym" />
                <Picker.Item label="Public shower" value="Public shower" />
                <Picker.Item label="Other " value="Other" />
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
                  defaultValue={placePhone ? placePhone : null}
                  placeholder="Phone "
                  containerStyle={{ width: 350 }}
                  style={{
                    color: "white",
                  }}
                  autoFocus={true}
                />
                <Input
                  onChangeText={setPlaceEmail}
                  defaultValue={placeEmail ? placeEmail : null}
                  placeholder="Email"
                  containerStyle={{ width: 350 }}
                  style={{
                    color: "white",
                  }}
                  autoFocus={true}
                />
                <Input
                  onChangeText={setPlaceWebsite}
                  defaultValue={placeWebsite ? placeWebsite : null}
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
                onPress={() =>
                  (async () => {
                    await createplace(
                      placeName,
                      placeLocation,
                      placeAddress,
                      placeType,
                      placePhone,
                      placeEmail,
                      placeWebsite
                    );
                    setTextArray(null);
                    setMoreInfo(false);
                    setOverlayVisible(false);
                  })()
                }
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
                  setMoreInfo(false);
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
        icon={add}
        color="black"
        onPress={() => setOverlayVisible(true)}
        style={{
          position: "absolute",
          top: 35,
          width: 350,
          borderRadius: 50,
        }}
        contentStyle={{ justifyContent: "flex-start" }}
      >
        Add place to map
      </Button>
    </>
  );
}
