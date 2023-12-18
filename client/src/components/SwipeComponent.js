import React, { useRef, useState, useEffect } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
    Text,
    Image,
    ActivityIndicator,
} from "react-native";
import {
    PanGestureHandler,
    State,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../assets/styles";
import { doc, updateDoc, getDoc, deleteField } from "firebase/firestore";
import { db, auth } from "../config/firebase";

const SwipeComponent = ({ post }) => {
    const [username, setUsername] = useState(null);
    const [postLiked, setPostLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const screenWidth = Dimensions.get("window").width;
    const translateX = useRef(new Animated.Value(0)).current;

    async function getUsername() {
        const docRef = doc(db, "Users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        setUsername(docSnap.data()["username"]);

        if (docSnap.data()["username"] in post.likes) {
            setPostLiked(true);
        }
    }

    async function updateLikes() {
        if (postLiked) {
            delete post.likes[username];
            const updatedLikes = {};
            updatedLikes[`likes.${username}`] = deleteField();
            try {
                await updateDoc(doc(db, "Posts", post.id), updatedLikes);
            } catch (error) {
                console.error("Error updating likes: ", error);
            }
        } else {
            const timestamp = Math.floor(Date.now() / 1000);
            post.likes[username] = timestamp;
            const updatedLikes = {};
            updatedLikes[`likes.${username}`] = timestamp;
            try {
                await updateDoc(doc(db, "Posts", post.id), updatedLikes);
            } catch (error) {
                console.error("Error updating likes: ", error);
            }
        }
    }

    useEffect(() => {
        getUsername().then(() => {
            setIsLoading(false);
        });
    }, []);

    // Define animations for icons
    const heartMovement = translateX.interpolate({
        inputRange: [0, 70], // Adjust these values based on your UI
        outputRange: [0, 20], // Determines how far the heart icon should move
        extrapolate: "clamp",
    });
    const heartScale = translateX.interpolate({
        inputRange: [0, 100], // Adjust these values based on your UI
        outputRange: [1, 3],
        extrapolate: "clamp",
    });
    const heartOpacity = translateX.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    const filledHeartOpacity = translateX.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });
    const shareScale = translateX.interpolate({
        inputRange: [-100, 0],
        outputRange: [3, 1],
        extrapolate: "clamp",
    });
    const shareMovement = translateX.interpolate({
        inputRange: [-70, 0], // Adjust these values based on your UI
        outputRange: [-20, 0], // Determines how far the heart icon should move
        extrapolate: "clamp",
    });

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX } }],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
            }).start();

            if (event.nativeEvent.translationX < -0.3 * screenWidth) {
                handleSwipeLeft(event);
            } else if (event.nativeEvent.translationX > 0.3 * screenWidth) {
                handleSwipeRight(event);
            }
        }
    };

    const handleSwipeRight = (event) => {
        console.log("swiped right");
        updateLikes();

        if (event.nativeEvent.translationX > 0.2 * screenWidth) {
            setPostLiked(!postLiked);
        }
    };

    const handleSwipeLeft = (event) => {
        console.log("swiped left");
    };

    if (isLoading) {
        return;
        // <View style={{ flex: 1 }}>
        <ActivityIndicator size="small" color={colors.white} />;
        // </View>;
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <Animated.View
                style={[
                    styles.icon,
                    {
                        transform: [
                            { scale: heartScale },
                            { translateX: heartMovement },
                        ],
                    },
                ]}
            >
                <Animated.View
                    style={{
                        opacity: heartOpacity,
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name={postLiked ? "heart" : "heart-outline"}
                        size={35}
                        color={postLiked ? "red" : "white"}
                    />
                    <Text style={{ color: colors.white }}>
                        {Object.keys(post.likes).length}
                    </Text>
                </Animated.View>
                <Animated.View
                    style={{
                        opacity: filledHeartOpacity,
                        position: "absolute",
                        alignItems: "center",
                    }}
                >
                    <Ionicons name="heart" size={35} color="red" />
                    <Text style={{ color: colors.white }}>
                        {Object.keys(post.likes).length}
                    </Text>
                </Animated.View>
            </Animated.View>
            <PanGestureHandler
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onHandlerStateChange}
                activeOffsetX={[-10, 10]}
            >
                <Animated.View
                    style={[styles.post, { transform: [{ translateX }] }]}
                >
                    {/* User Info */}
                    <View style={styles.userInfo}>
                        <Text style={styles.username}>{post.username}: </Text>
                        <Text style={[styles.username, { color: "violet" }]}>
                            {post.caption}
                        </Text>
                    </View>

                    <View
                        style={{
                            borderBottomColor: "grey", // Line color
                            borderBottomWidth: 1, // Line thickness
                            marginVertical: 10, // Vertical spacing from surrounding content
                        }}
                    />

                    <View style={styles.postContent}>
                        <View>
                            {/* Album Art */}
                            <Image
                                source={{ uri: post.albumArtUrl }}
                                style={styles.albumArt}
                            />

                            {/* Song Info */}
                            <View style={styles.songInfo}>
                                <Text style={styles.songTitle}>
                                    {post.songName}
                                </Text>
                                <Text style={styles.artistNames}>
                                    {post.artistNames.join(", ")}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </PanGestureHandler>
            <Animated.View
                style={[
                    styles.icon,
                    {
                        transform: [
                            { scale: shareScale },
                            { translateX: shareMovement },
                        ],
                    },
                ]}
            >
                <Ionicons name="chatbubble-outline" size={35} color="white" />
            </Animated.View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "row",
    },
    icon: {
        flex: 1.2,
        zIndex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    post: {
        flex: 7.6,
        zIndex: 2,
        height: "100%",
        backgroundColor: colors.black,
        borderRadius: 20,
        padding: "5%",
    },
    userInfo: {
        flexDirection: "row",
    },
    username: {
        fontSize: 16,
        fontWeight: "bold",
        color: "lightgrey",
        marginBottom: 4,
    },
    postContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    albumArt: {
        aspectRatio: 1,
        width: "100%",
        borderRadius: 20,
        marginBottom: 40,
    },
    songInfo: {
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    songTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "lightgrey",
        marginBottom: 4,
        textAlign: "center",
    },
    artistNames: {
        fontSize: 17,
        color: "#666",
        textAlign: "center",
    },
    postText: {
        color: colors.white,
    },
});

export default SwipeComponent;
