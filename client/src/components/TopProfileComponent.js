import {
    View,
    Animated,
    TouchableOpacity,
    StyleSheet,
    Text,
    Dimensions,
} from "react-native";
import { colors } from "../../assets/styles";
import { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "@react-native-community/blur";
function TopProfileComponent({ onToggleExpand }) {
    const [username, setUsername] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const screenHeight = Dimensions.get("window").height;
    const initialHeight = 0.2 * screenHeight;
    const expandedHeight = 0.8 * screenHeight;
    const heightAnim = useRef(new Animated.Value(initialHeight)).current; // Initial height 30

    // Function to animate the height
    const toggleExpansion = () => {
        Animated.timing(heightAnim, {
            toValue: expanded ? initialHeight : expandedHeight, // Toggle between 30 and 300
            duration: 500, // Duration of the animation
            useNativeDriver: false, // Height animation does not support native driver
        }).start();

        setExpanded(!expanded); // Update the state to reflect expansion/collapse
        onToggleExpand();
    };

    async function getUsername() {
        const docRef = doc(db, "Users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        setUsername(docSnap.data()["username"]);
    }

    useEffect(() => {
        getUsername();
    }, []);

    return (
        <Animated.View style={[styles.container, { height: heightAnim }]}>
            <TouchableOpacity
                style={styles.touchArea}
                onPress={toggleExpansion}
            >
                <Ionicons name="person" style={styles.icon} />
                <Text style={styles.usernameText}>{username}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: Platform.OS === "android" ? StatusBar.currentHeight : 0, // Adjust for status bar height on Android
        left: 0,
        right: 0,
        backgroundColor: colors.secondary,
        zIndex: 3,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        paddingTop: Platform.OS === "ios" ? 40 : 0, // Additional padding for iOS

        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.7,
        shadowRadius: 5,
        elevation: 10, // for Android
    },
    touchArea: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    usernameText: {
        color: colors.white,
        fontSize: 30,
    },
    icon: {
        color: colors.white,
        height: 50,
        width: 50,
        fontSize: 30,
        padding: 8,
        borderWidth: 1,
        borderColor: colors.white,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default TopProfileComponent;
