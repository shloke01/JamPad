import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { auth, db } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { setDoc, doc } from "@firebase/firestore";
import {
    validateEmail,
    validateNames,
    validateUsername,
    validatePassword,
    usernameExists,
    emailExists,
} from "../../utils/InputValidators";
import { CommonActions } from "@react-navigation/routers";

function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const lowerEmail = (email) => {
        setEmail(email.toLowerCase());
    };

    const lowerUsername = (username) => {
        setUsername(username.toLowerCase());
    };

    const handleRegister = async () => {
        // Make sure all fields are entered
        if (
            email === "" ||
            username === "" ||
            firstName === "" ||
            lastName === "" ||
            password === ""
        ) {
            Alert.alert("All fields are mandatory");
            return;
        }

        // Make sure passwords match
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match");
            return;
        }

        // Make sure email is valid
        if (!validateEmail(email)) {
            Alert.alert("Please enter a valid email address");
            return;
        } else if (await emailExists(email)) {
            Alert.alert("A user with this email address already exists");
            return;
        }

        // Make sure username is valid
        if (!validateUsername(username)) {
            Alert.alert("Username");
            return;
        } else if (await usernameExists(username)) {
            Alert.alert("Username is taken");
            return;
        }

        // Make sure first and last names are valid
        if (!validateNames(firstName)) {
            Alert.alert("Invalid first name");
            return;
        } else if (!validateNames(lastName)) {
            Alert.alert("Invalid last name");
            return;
        }

        // Make sure password is valid
        if (!validatePassword(password)) {
            Alert.alert("Please enter a valid password");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("User registered successfully!");
            setEmail("");
            setUsername("");
            setFirstName("");
            setLastName("");
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Error registering user:", error.message);
        }

        try {
            uid = auth.currentUser.uid;
            userData = {
                email: email,
                username: username,
                firstName: firstName,
                lastName: lastName,
            };
            setDoc(doc(db, "Users", uid), userData);
            navigation.navigate("Main");
        } catch (error) {
            console.error("Error registering user:", error.message);
        }

        // Reset stack to disallow going back
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Main" }],
            })
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email*"
                value={email}
                onChangeText={lowerEmail}
                placeholderTextColor="lightgray"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Username*"
                value={username}
                onChangeText={lowerUsername}
                placeholderTextColor="lightgray"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="First Name*"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="lightgray"
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name*"
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor="lightgray"
            />
            <TextInput
                style={styles.input}
                placeholder="Password*"
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="lightgray"
                autoCapitalize="none"
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password*"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="lightgray"
                autoCapitalize="none"
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#28282B", // Dark background
        padding: 20,
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
        textTransform: "lowercase",
    },
    button: {
        backgroundColor: "#3A3A3D", // Slightly lighter than the base for buttons
        height: 40,
        width: "40%",
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: "#FFF", // White text for the button
        fontSize: 16,
    },
});

export default RegisterScreen;
