import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Alert,
} from "react-native";
// import { Ionicons } from "@expo/vector-icons";
import app from "../../config/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth(app);

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, username, password);
      console.log("User registered successfully!");
    } catch (error) {
      console.error("Error registering user:", error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, username, password);
      Alert.alert("Login Successful");
      navigation.navigate("Main");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* <Ionicons name="musical-notes" size={70} color="tomato" /> */}

      <TextInput
        style={styles.input}
        placeholder="username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholderTextColor="dimgray"
      />

      <TextInput
        style={styles.input}
        placeholder="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholderTextColor="dimgray"
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#28282B",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    width: "80%",
    height: "6%",
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  buttonContainer: {
    marginTop: 5,
    width: "80%",
    height: "6%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    flex: 1,
    backgroundColor: "tomato",
    margin: 5,
    height: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
