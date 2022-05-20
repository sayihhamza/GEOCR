import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Searchbar, Button } from "react-native-paper";
import { Overlay } from "@rneui/themed";
import Geocoder from "@timwangdev/react-native-geocoder";
import { IconCamera } from "./Icons/CameraIcon";
import { IconGallery } from "./Icons/GalleryIcon";
import useRealm from "../functions/useRealm";
import useMLkit from "../functions/useMLkit";

const OverlayExample = ({ visible, setVisible, setTextArray }) => {
  const toggleOverlay = () => {
    setVisible(false);
  };

  const { recognizeFromCamera, recognizeFromPicker } = useMLkit();

  return (
    <View>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{
          width: "90%",
          backgroundColor: "black",
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          mode="contained"
          color="#1F1F1F"
          icon={IconCamera}
          onPress={() => {
            (async () => {
              await recognizeFromCamera(setTextArray);
            })();
          }}
          style={{
            width: 350,
            borderRadius: 50,
            margin: 4,
          }}
        >
          Address from camera
        </Button>
        <Button
          mode="contained"
          color="#1F1F1F"
          icon={IconGallery}
          onPress={() => {
            (async () => {
              await recognizeFromPicker(setTextArray);
            })();
          }}
          style={{
            width: 350,
            borderRadius: 50,
            margin: 4,
          }}
        >
          Address from gallery
        </Button>
      </Overlay>
    </View>
  );
};

export const SearchPlace = ({
  currentPosition,
  setCurrentPosition,
  scannedPlace,
  setScnnedPlace,
  showPlace,
  setShowPlace,
  searchQuery,
  setSearchQuery,
}) => {
  // const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [visible, setVisible] = useState(false);
  const [textArray, setTextArray] = useState(null);
  const [searchGeocoder, setSearchGeocoder] = useState(null);
  const { fetchPlaces } = useRealm();

  const onChangeSearch = async (e) => {
    if (e != "" && fetchPlaces !== []) {
      setSearchQuery(e);
      const strEx = `[a-zA-Z]*${e}[a-zA-Z]*`;
      const regEx = new RegExp(strEx, "gi");
      const fetchedPlaces = fetchPlaces();
      const feltredPlaces = fetchedPlaces.filter((place) =>
        regEx.test(place.name)
      );
      feltredPlaces.map((place) => {
        console.log(place);
      });
      console.log(e);
      setPlaces([...feltredPlaces]);
      console.log(`ha huwa`);
      setSearchGeocoder(await Geocoder.geocodeAddress(searchQuery));
      console.log(searchGeocoder);
    } else {
      setSearchQuery("");
      setSearchGeocoder(null);
      setPlaces([]);
    }
  };

  useEffect(() => {
    (async () => {
      let loc = await Geocoder.geocodeAddress(textArray.join());
      loc.map((block) => {
        // console.log(block);
        setScnnedPlace({
          _id: block.formattedAddress,
          name: block.formattedAddress,
          location: [block.position.lng, block.position.lat],
        });
        setShowPlace({
          name: block.formattedAddress,
          formattedAddress: block.formattedAddress,
        });
        setSearchQuery(block.formattedAddress);
        setVisible(false);
      });
    })();
  }, [textArray]);

  useEffect(() => {
    scannedPlace ? setCurrentPosition(scannedPlace?.location) : null;
  }, [scannedPlace]);

  // useEffect(() => {
  //   console.log(textArray);
  // }, [textArray]);
  //   useEffect(() => {
  //     fetchPlaces() ? fetchPlaces().map((place) => console.log(place)) : null;
  //   }, [fetchPlaces]);
  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        top: 80,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Searchbar
        placeholder="Search place"
        onChangeText={onChangeSearch}
        value={searchQuery}
        // icon={IconCamera}
        iconColor="white"
        // onIconPress={() => setVisible(true)}
        theme={{
          dark: true,
          colors: {
            primary: "white",
            text: "white",
            placeholder: "white",
          },
          roundness: 50,
        }}
        style={{
          width: 350,
          height: 42,
          backgroundColor: "black",
          elevation: 4,
          zIndex: 4,
          // opacity: 0.7,
        }}
      />
      {searchQuery != "" ? (
        <></>
      ) : (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 5,
            right: 10,
            elevation: 5,
            zIndex: 5,
            opacity: 0.8,
          }}
          onPress={() => setVisible(true)}
        >
          <IconCamera />
        </TouchableOpacity>
      )}
      {searchQuery != "" && (searchGeocoder || places[0]) ? (
        <View
          style={{
            width: 350,
            padding: 10,
            position: "absolute",
            top: 17,
            paddingTop: 17,
            backgroundColor: "black",
            elevation: 3,
            zIndex: 3,
            borderRadius: 10,
          }}
        >
          {searchQuery != "" && places[0] && (
            <View>
              {places?.slice(0, 5).map((place) => (
                <TouchableOpacity
                  style={{ backgroundColor: "black" }}
                  key={place._id.toString()}
                  onPress={() => {
                    setCurrentPosition([place.location[0], place.location[1]]);
                    setShowPlace(place);
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 20 }}>{place.name}</Text>
                    <Text
                      style={{ fontSize: 20, position: "absolute", right: 2 }}
                    >
                      {place.type}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12 }}>{place.formattedAddress}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View>
            {searchGeocoder ? (
              searchGeocoder?.map((place) => (
                <TouchableOpacity
                  style={{ backgroundColor: "black" }}
                  key={place.formattedAddress}
                  onPress={() => {
                    setCurrentPosition([
                      place.position.lng,
                      place.position.lat,
                    ]);
                    setScnnedPlace({
                      _id: place.formattedAddress,
                      name: place.formattedAddress,
                      location: [place.position.lng, place.position.lat],
                    });
                    setShowPlace({
                      name: place.formattedAddress,
                      formattedAddress: place.formattedAddress,
                    });
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 20 }}>
                      {place.formattedAddress}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12 }}>{place.formattedAddress}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <></>
            )}
          </View>
        </View>
      ) : (
        <></>
      )}
      <OverlayExample
        visible={visible}
        setVisible={setVisible}
        setTextArray={setTextArray}
      />
    </View>
  );
};
