import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function SearchScreen({ navigation }) {
  return (
    <View style={styles.homeScreen}>
      <Ionicons name="search" size={80} color="tomato" style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  homeScreen: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SearchScreen;
