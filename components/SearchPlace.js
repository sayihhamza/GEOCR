import React, { useState, useEffect } from "react";
import { Searchbar } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import useRealm from "../functions/useRealm";

export const SearchPlace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const { fetchPlaces } = useRealm();

  const onChangeSearch = (e) => {
    if (e != "") {
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
    } else {
      setSearchQuery("");
      setPlaces([]);
    }
  };

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
        iconColor="white"
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
        }}
      />
      {searchQuery != "" && places[0] && (
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
          {places?.slice(0, 5).map((place) => (
            <View
              style={{ backgroundColor: "black" }}
              key={place._id.toString()}
            >
              <Text style={{ fontSize: 20 }}>{place.name}</Text>
              <Text style={{ fontSize: 12 }}>{place.formattedAddress}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
