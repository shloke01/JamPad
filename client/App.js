import { Platform, StyleSheet, StatusBar, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { colors } from "./assets/styles";
import Toast from "react-native-toast-message";

// Firebase
import app from "./src/config/firebase";

// Screens
import MainContainer from "./src/navigation/MainContainer";
import LoginScreen from "./src/navigation/screens/LoginScreen";
import LoadingScreen from "./src/navigation/screens/LoadingScreen";
import RegisterScreen from "./src/navigation/screens/RegisterScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(false);

    const auth = getAuth(app);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsSignedIn(true);
            } else {
                setIsSignedIn(false);
            }
            setIsLoading(false);
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    }, []);

    if (isLoading) {
        // If the app is still loading, show a loading screen
        return <LoadingScreen />;
    }

    return (
        <>
            <View style={styles.container}>
                {Platform.OS === "android" && <StatusBar hidden={true} />}
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            cardStyle: { backgroundColor: colors.primary },
                        }}
                    >
                        {isSignedIn ? (
                            // If the user is signed in, show the Home Screen
                            <Stack.Screen
                                name="Main"
                                component={MainContainer}
                                options={{ headerShown: false }}
                            />
                        ) : (
                            // Otherwise, show the Login Screen
                            <Stack.Screen
                                name="Login"
                                component={LoginScreen}
                                options={{ headerShown: false }}
                            />
                        )}
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{ headerShown: false }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
            <Toast />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    text: {
        color: "white",
        fontSize: 20,
    },
});
