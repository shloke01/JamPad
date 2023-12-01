import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

function LoadingScreen(navigation) {
    return (
        <View style={styles.container}>
            <Ionicons name="musical-notes" color="violet" style={styles.icon} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#28282B",
        padding: 20,
    },
    icon: {
        fontSize: 100,
        marginBottom: "20%",
    },
});

export default LoadingScreen;
