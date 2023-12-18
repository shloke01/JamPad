import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserSearchComponent from "../../components/UserSearchComponent";

function SearchScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.homeScreen}>
            <UserSearchComponent />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    homeScreen: {
        flex: 1,
        backgroundColor: "black",
        // justifyContent: "center",
        // alignItems: "center",
    },
});

export default SearchScreen;
