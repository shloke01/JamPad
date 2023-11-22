import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// firebase
import app from "../../config/firebase";
import { getAuth, signOut } from "@firebase/auth";
import { colors } from "../../../assets/styles";

function ProfileScreen({ navigation }) {
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logout Successful");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <View style={styles.homeScreen}>
      <Ionicons name="person" size={80} color="tomato" style={styles.icon} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.tertiary,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
