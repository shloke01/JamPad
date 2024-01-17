import React, { useRef, useState, useEffect, memo } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
    Text,
    Image,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import {
    PanGestureHandler,
    State,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../assets/styles";
import {
    collection,
    doc,
    updateDoc,
    getDoc,
    getDocs,
    deleteField,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import CommentsComponent from "./CommentsComponent";
import { Audio } from "expo-av";
import Toast from "react-native-toast-message";

const SwipeComponent = ({ post, flatListRef }) => {
    const [username, setUsername] = useState(null);
    const [postLiked, setPostLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [sound, setSound] = useState(null);
    const screenWidth = Dimensions.get("window").width;
    const translateX = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity set to 0
    const postRef = useRef();

    async function getUsername() {
        const docRef = doc(db, "Users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        setUsername(docSnap.data()["username"]);

        if (docSnap.data()["username"] in post.likes) {
            setPostLiked(true);
        }
    }

    async function fetchComments() {
        const commentsRef = collection(db, "Posts", post.id, "Comments");
        const commentsSnapshot = await getDocs(commentsRef);
        const comments = commentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setComments(comments);
    }

    async function playPreview() {
        if (sound) {
            await sound.unloadAsync();
        }

        console.log(post.previewUrl);

        if (post.previewUrl != null) {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const newSound = new Audio.Sound();
            await newSound.loadAsync({ uri: post.previewUrl });
            await newSound.playAsync();
            setSound(newSound);
        } else {
            console.log("cant play");
            Toast.show({
                type: "success",
                text1: "Preview not available for this song",
            });
        }
    }

    const stopPreview = async () => {
        if (sound) {
            await sound.pauseAsync();
        }
        setSound(null);
    };

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
        fetchComments();
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

        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
        }).start(() => {
            // After fade out, toggle the view and fade in
            setShowComments(!showComments);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }).start();
        });
    };

    if (isLoading) {
        // return;
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
                        size={25}
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
                activeOffsetX={[-5, 5]}
                failOffsetY={[-5, 5]}
                simultaneousHandlers={true}
            >
                <Animated.View
                    ref={postRef}
                    style={[
                        styles.post,
                        {
                            transform: [
                                // Translate up by half of the height to change the pivot point to the bottom center
                                { translateY: 550 / 2 },
                                // Rotate based on the translateX value
                                {
                                    rotate: translateX.interpolate({
                                        inputRange: [
                                            -0.3 * screenWidth,
                                            0,
                                            0.3 * screenWidth,
                                        ],
                                        outputRange: [
                                            "-10deg",
                                            "0deg",
                                            "10deg",
                                        ], // Rotation angles can be adjusted
                                    }),
                                },
                                // Translate back down by the same amount after rotation
                                { translateY: -550 / 2 },
                                // Horizontal translation for the swiping effect
                                { translateX },
                            ],
                        },
                    ]}
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

                    {showComments ? (
                        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                            <CommentsComponent
                                post={post}
                                currentUsername={username}
                                comments={comments}
                                fetchComments={fetchComments}
                            />
                        </Animated.View>
                    ) : (
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
                                    {sound ? (
                                        <TouchableOpacity onPress={stopPreview}>
                                            <Ionicons
                                                name="stop"
                                                size={40}
                                                color="white"
                                            />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity onPress={playPreview}>
                                            <Ionicons
                                                name="play"
                                                size={40}
                                                color="white"
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    )}
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
                <Ionicons name="chatbubble-outline" size={25} color="white" />
                <Text style={{ color: colors.white }}>{comments.length}</Text>
            </Animated.View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
    },
    icon: {
        flex: 0.9,
        zIndex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    post: {
        flex: 8.2,
        // width: "90%",
        zIndex: 2,
        backgroundColor: colors.black,
        borderRadius: 20,
        padding: "5%",
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.7,
        shadowRadius: 5,
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

export default memo(SwipeComponent);
