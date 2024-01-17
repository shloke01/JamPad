import React, { useState } from "react";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    View,
    Alert,
    KeyboardAvoidingView,
} from "react-native";
import { CommonActions } from "@react-navigation/routers";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

function LoginScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, username, password);
            Alert.alert("Login Successful");
            navigation.navigate("Main");
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        }

        // Reset stack to disallow going back
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }], // Replace 'Home' with the name of your home screen
            })
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Ionicons name="musical-notes" color="violet" style={styles.icon} />

            <TextInput
                style={styles.input}
                textContentType="oneTimeCode"
                placeholder="email"
                value={username}
                onChangeText={(text) => setUsername(text)}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="lightgray"
            />

            <TextInput
                style={styles.input}
                placeholder="password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor="lightgray"
                autoCapitalize="none"
                secureTextEntry
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.registerButton}
                onPress={() => {
                    navigation.navigate("Register");
                }}
            >
                <Text style={styles.registerText}>
                    [ Click here to register ]
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

export default LoginScreen;

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
    input: {
        width: "80%",
        height: 40,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "lightgrey",
        margin: 5,
        fontSize: 16,
        color: "lightgrey",
    },
    loginButton: {
        backgroundColor: "#3A3A3D",
        height: 40,
        width: "40%",
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
    },
    loginText: {
        color: "lightgrey",
        fontSize: 16,
    },
    registerButton: {
        margin: 20,
    },
    registerText: {
        color: "white",
        fontSize: 20,
        fontWeight: "100",
    },
});
