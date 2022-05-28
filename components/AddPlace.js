import React, { useState, useEffect } from "react";
import { Overlay, Input } from "@rneui/themed";
import { Text, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { View } from "react-native";
import useMLkit from "../functions/useMLkit";
import useRealm from "../functions/useRealm";
import GetLocation from "react-native-get-location";
import Geocoder from "@timwangdev/react-native-geocoder";
// import gallery from "../assets/gallery.png";
// import add from "../assets/add.png";
// import camera from "../assets/camera.png";
import { IconGallery } from "./Icons/GalleryIcon";
import { IconCamera } from "./Icons/CameraIcon";
import { IconAdd } from "./Icons/AddIcon";

export function AddPlace({
  userPosition,
  currentPosition,
  setCurrentPosition,
  showPlace,
  setShowPlace,
  setShowStores,
  setShowCafes,
  setShowBakery,
  setShowRestaurants,
  setShowGym,
  setShowOther,
}) {
  const [placeName, setPlaceName] = useState("");
  const [placeType, setPlaceType] = useState("Store");
  const [placeLocation, setPlaceLocation] = useState(userPosition);
  const [placeAddress, setPlaceAddress] = useState("no address");
  const [placePhone, setPlacePhone] = useState("");
  const [placeEmail, setPlaceEmail] = useState("");
  const [placeWebsite, setPlaceWebsite] = useState("");
  const [placeDescription, setPlaceDescription] = useState("");
  // const [currentLocation, setCurrentLocation] = useState([]);
  const [description, setDescription] = useState("Product type");
  const [scannedLocation, setScannedLocation] = useState(null);
  const [scannedAddress, setScannedAddress] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [moreInfo, setMoreInfo] = useState(false);
  const [textArray, setTextArray] = useState(null);
  const { recognizeFromCamera, recognizeFromPicker } = useMLkit();
  const { fetchPlaces, createplace } = useRealm();

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
      let addr;
      if (!scannedLocation) {
        addr = await Geocoder.geocodePosition({
          lng: userPosition[0],
          lat: userPosition[1],
        });
        console.log(addr);
        Object.entries(addr)[0].map((block) =>
          block.formattedAddress != undefined && block.formattedAddress != null
            ? setPlaceAddress(block.formattedAddress)
            : null
        );
      } else {
        console.log(`Scanned address :`, scannedAddress);
        let addr = await Geocoder.geocodePosition({
          lat: placeLocation[1],
          lng: placeLocation[0],
        });
        console.log(addr);
        Object.entries(addr)[0].map((block) =>
          block.formattedAddress
            ? setScannedAddress(block.formattedAddress)
            : null
        );

        scannedAddress
          ? setPlaceAddress(scannedAddress)
          : setPlaceAddress(addr);
      }
      textArray[0] ? setPlaceName(textArray[0]) : null;
      textArray !== [] ? setPlacePhone(getPhone(textArray.join("\n"))) : null;
      textArray !== [] ? setPlaceEmail(getEmail(textArray.join("\n"))) : null;
      textArray !== []
        ? setPlaceWebsite(getWebsite(textArray.join("\n")))
        : null;
      // currentLocation !== [] ? setPlaceLocation(currentLocation) : null;
      // scannedLocation
      //   ? setPlaceLocation(scannedLocation)
      //   : setPlaceLocation(currentLocation);
    })();
  }, [
    textArray,
    scannedAddress,
    scannedLocation,
    placeLocation,
    placeAddress,
    placeName,
  ]);

  useEffect(() => {
    scannedLocation
      ? setPlaceLocation(scannedLocation)
      : setPlaceLocation(userPosition);
  }, [scannedLocation]);

  useEffect(() => {
    if (placeType == "Store") {
      setDescription("Products");
    } else if (placeType == "Cafe") {
      setDescription("Services");
    } else if (placeType == "Restaurant") {
      setDescription("Services");
    } else if (placeType == "Bakery") {
      setDescription("Breads");
    } else if (placeType == "Sports") {
      setDescription("Activities");
    } else if (placeType == "Other") {
      setDescription("Description");
    }
  }, [placeType]);

  useEffect(() => {
    (async () => {
      let loc = await Geocoder.geocodeAddress(textArray.join());
      console.log(loc);
      loc.map((block) => {
        setScannedLocation([block.position.lng, block.position.lat]);
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
            <Button
              mode="contained"
              color="#1F1F1F"
              icon={IconCamera}
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
              PANEL FROM CAMERA
            </Button>
            <Button
              mode="contained"
              color="#1F1F1F"
              icon={IconCamera}
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
              CARD FROM CAMERA
            </Button>

            <Button
              mode="contained"
              color="#1F1F1F"
              icon={IconGallery}
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
              CARD FROM GALLERY
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
                <Picker.Item label="Sports" value="Sports" />

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
                  <Text style={{ color: "white" }}>MODIFY OR ADD INFOS ??</Text>
                </Button>
              </>
            ) : (
              <>
                <Input
                  onChangeText={setPlaceAddress}
                  defaultValue={placeAddress ? placeAddress : null}
                  placeholder="Address"
                  containerStyle={{ width: 350 }}
                  style={{
                    color: "white",
                  }}
                  autoFocus={true}
                />
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
                <Input
                  onChangeText={setPlaceDescription}
                  // defaultValue={description ? description : null}
                  placeholder={description}
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
                onPress={() => {
                  switch (placeType) {
                    case "Store":
                      setShowStores(true);
                      break;
                    case "Cafe":
                      setShowCafes(true);
                      break;
                    case "Restaurant":
                      setShowRestaurants(true);
                      break;
                    case "Bakery":
                      setShowBakery(true);
                      break;
                    case "Gym":
                      setShowGym(true);
                      break;
                    case "Other":
                      setShowOther(true);
                      break;
                    default:
                      setShowStores(true);
                  }
                  if (placeLocation[0]) {
                    createplace(
                      placeName,
                      placeLocation,
                      placeAddress,
                      placeType,
                      placePhone,
                      placeEmail,
                      placeWebsite,
                      placeDescription
                    );
                  } else {
                    createplace(
                      placeName,
                      userPosition,
                      placeAddress,
                      placeType,
                      placePhone,
                      placeEmail,
                      placeWebsite,
                      placeDescription
                    );
                  }
                  setCurrentPosition([
                    placeLocation[0] ? placeLocation[0] : userPosition[0],
                    placeLocation[1] ? placeLocation[1] : userPosition[1],
                  ]);
                  setShowPlace({
                    name: placeName,
                    type: placeType,
                    formattedAddress: placeAddress,
                    phoneNumber: placePhone,
                    emailAddress: placeEmail,
                    website: placeWebsite,
                    description: placeDescription,
                  });
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
                Confirm
              </Button>
              <Button
                mode="contained"
                color="black"
                onPress={() => {
                  setTextArray(null);
                  setMoreInfo(false);
                  setOverlayVisible(false);
                  setPlaceName("");
                  setPlaceType("");
                  setPlaceLocation(null);
                  setPlaceAddress(null);
                  setPlacePhone("");
                  setPlaceEmail("");
                  setPlaceWebsite("");
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
        icon={IconAdd}
        onPress={() => setOverlayVisible(true)}
        style={{
          position: "absolute",
          top: 35,
          width: 350,
          borderRadius: 50,

          height: 42,
        }}
        contentStyle={{ justifyContent: "flex-start" }}
      >
        Add place to map
      </Button>
    </>
  );
}
