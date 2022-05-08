import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";

export const ShowPlace = ({
  showPlace,
  setShowPlace,
  searchQuery,
  setSearchQuery,
  scannedPlace,
  setScnnedPlace,
  userPosition,
  setUserPosition,
  currentPosition,
  setCurrentPosition,
}) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 50,

        backgroundColor: "black",
        borderRadius: 20,

        height: 190,
        width: 350,
        padding: 10,
        opacity: 0.6,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            fontSize: 19,
            color: "white",
            fontWeight: "bold",
            fontFamily: "Times New Roman",
          }}
        >
          {showPlace?.name}
        </Text>
        <Text
          style={{
            fontSize: 19,
            color: "white",
            fontWeight: "bold",
            fontFamily: "Times New Roman",
          }}
        >
          {" "}
          {showPlace?.type}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 13,
          color: "#ABC5E5",
          fontWeight: "bold",
          fontFamily: "Times New Roman",
        }}
      >
        {showPlace?.formattedAddress}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#ABC5E5",
          fontWeight: "bold",
          fontFamily: "Times New Roman",
        }}
      >
        {showPlace?.phoneNumber}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#ABC5E5",
          fontWeight: "bold",
          fontFamily: "Times New Roman",
        }}
      >
        {showPlace?.emailAddress}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#ABC5E5",
          fontWeight: "bold",
          fontFamily: "Times New Roman",
        }}
      >
        {showPlace?.website}
      </Text>
      <Button
        mode="contained"
        color="#2F435B"
        style={{
          width: 350,
          position: "absolute",
          bottom: 0,
          height: 40,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
        onPress={() => {
          setShowPlace(null);
          setSearchQuery("");
          setScnnedPlace(null);
          setCurrentPosition(userPosition);
        }}
      >
        clear
      </Button>
    </View>
  );
};
