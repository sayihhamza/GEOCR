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
}) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 50,
        backgroundColor: "#3A3E44",
        //   borderRadius: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 180,
        width: 350,
        padding: 10,
        opacity: 0.8,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 19, color: "white", fontWeight: "bold" }}>
          {showPlace?.name}
        </Text>
        <Text style={{ fontSize: 18, color: "white" }}> {showPlace?.type}</Text>
      </View>
      <Text style={{ fontSize: 12, color: "white" }}>
        {showPlace?.formattedAddress}
      </Text>
      <Text style={{ fontSize: 15, color: "white" }}>
        {showPlace?.phoneNumber}
      </Text>
      <Text style={{ fontSize: 15, color: "white" }}>
        {showPlace?.emailAddress}
      </Text>
      <Text style={{ fontSize: 15, color: "white" }}>{showPlace?.website}</Text>
      <Button
        mode="contained"
        color="#868A8F"
        style={{ width: 350, position: "absolute", bottom: 0 }}
        onPress={() => {
          setShowPlace(null);
          setSearchQuery("");
        }}
      >
        clear
      </Button>
    </View>
  );
};
