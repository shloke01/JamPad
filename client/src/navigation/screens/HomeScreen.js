import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  TouchableHighlight,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SwipeComponent from "../../components/SwipeComponent";
import { FlatList } from "react-native";
import { colors } from "../../../assets/styles";

const DATA = [
  { id: "1", title: "First Post", content: "This is the first post." },
  { id: "2", title: "Second Post", content: "This is the second post." },
  { id: "3", title: "Third Post", content: "This is the third post." },
];

const renderItem = ({ item }) => (
  <View style={styles.item}>
    <SwipeComponent post={item} />
  </View>
);

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.homeScreen}>
      <View style={{ flex: 3, width: "100%", alignItems: "center" }}>
        <Ionicons
          name="musical-notes"
          size={50}
          color="tomato"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="What are you jamming to?"
          placeholderTextColor="dimgray"
        />
        <TouchableHighlight
          style={styles.search}
          onPress={() => console.log("clicked")}
        >
          <Text color="white">Search</Text>
        </TouchableHighlight>
      </View>

      <View style={{ flex: 7, width: "100%" }}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.primary,
    width: "100%",
    height: 200,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
  },
  homeScreen: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  icon: {
    flex: 1,
  },
  input: {
    flex: 1,
    width: "90%",
    backgroundColor: "white",
    color: "black",
    marginTop: 10,
    padding: 20,
    borderRadius: 10,
  },
  post: {
    height: 200,
    width: "90%",
    margin: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },
  search: {
    flex: 1,
    margin: 10,
    backgroundColor: "lightskyblue",
    height: 50,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
