import React, { useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, View, Text } from "react-native";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const SwipeComponent = ({ post }) => {
  const [postLiked, setPostLiked] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const translateX = useRef(new Animated.Value(0)).current;

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

    if (event.nativeEvent.translationX > 0.2 * screenWidth) {
      setPostLiked(!postLiked);
    }
  };

  const handleSwipeLeft = (event) => {
    console.log("swiped left");
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View
        style={[
          styles.icon,
          {
            transform: [{ scale: heartScale }, { translateX: heartMovement }],
          },
        ]}
      >
        <Animated.View style={{ opacity: heartOpacity }}>
          <Ionicons
            name={postLiked ? "heart" : "heart-outline"}
            size={35}
            style={{ paddingRight: 40 }}
            color={postLiked ? "red" : "white"}
          />
        </Animated.View>
        <Animated.View
          style={{ opacity: filledHeartOpacity, position: "absolute" }}
        >
          <Ionicons
            name="heart"
            size={35}
            style={{ paddingRight: 40 }}
            color="red"
          />
        </Animated.View>
      </Animated.View>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
      >
        <Animated.View style={[styles.post, { transform: [{ translateX }] }]}>
          <Text>{post.title}</Text>
          <Text>{post.content}</Text>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View
        style={[
          styles.icon,
          {
            transform: [{ scale: shareScale }, { translateX: shareMovement }],
          },
        ]}
      >
        <Ionicons
          name="share-outline"
          style={{ paddingLeft: 10 }}
          size={35}
          color="white"
        />
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
  post: {
    flex: 8,
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  icon: {
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SwipeComponent;
