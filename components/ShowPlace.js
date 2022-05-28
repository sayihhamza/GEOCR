import React, { useState } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

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
  const showDescription = () => {
    switch (showPlace?.type) {
      case "Store":
        return "Products";
      case "Cafe":
        return "Services";
      case "Restaurant":
        return "Services";
      case "Bakery":
        return "Breads";
      case "Sports":
        return "Activities";
      case "Other":
        return "Description";
      default:
        return "Description";
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 100,
        backgroundColor: "black",
        borderRadius: 20,
        height: 200,
        width: 350,
        padding: 10,
        opacity: 0.7,
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
            position: "absolute",
            right: 15,
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
          color: "white",

          fontFamily: "Times New Roman",
        }}
      >
        {showPlace?.formattedAddress}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "white",

          fontFamily: "Times New Roman",
        }}
      >
        {showPlace?.phoneNumber}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "white",

          fontFamily: "Times New Roman",
        }}
      >
        {showPlace?.emailAddress}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "white",
          fontFamily: "Times New Roman",
        }}
      >
        {showPlace?.website}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "white",

          fontFamily: "Times New Roman",
        }}
      >
        {showPlace.description
          ? `${showDescription()} : ${showPlace?.description}`
          : null}
      </Text>
      <Button
        mode="contained"
        disabled={true}
        color="transparent"
        style={{
          opacity: 0.5,
          width: 350,
          position: "absolute",
          bottom: 0,
          height: 40,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
        onPress={() => {
          // setShowPlace(null);
          // setSearchQuery("");
          // setScnnedPlace(null);
          // setCurrentPosition(userPosition);
          // deleteplace(showPlace);
        }}
      >
        <Icon name="remove" size={18} color="white" />
        <Text style={{ color: "white" }}> DELETE PLACE</Text>
      </Button>
    </View>
  );
};
