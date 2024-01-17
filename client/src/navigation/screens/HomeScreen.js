import React, { useState, useEffect, useRef } from "react";
import {
    View,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableHighlight,
} from "react-native";
import SwipeComponent from "../../components/SwipeComponent";
import { colors } from "../../../assets/styles";
import NewPostModalComponent from "../../components/NewPostModalComponent";
import TopProfileComponent from "../../components/TopProfileComponent";
import { BlurView } from "expo-blur";
import FeedComponent from "../../components/FeedComponent";

function HomeScreen({ navigation }) {
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [refreshPosts, setRefreshPosts] = useState(0);
    const flatListRef = useRef(null);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const scrollToTop = () => {
        // flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
        flatListRef.current?.scrollToPosition(0, 0, true);
    };

    const toggleModal = () => {
        scrollToTop();
        setRefreshPosts(refreshPosts + 1);
        setShowNewPostModal(!showNewPostModal);
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.homeScreen}>
            <TopProfileComponent onToggleExpand={toggleExpand} />
            {/* Placeholder view for TopProfileComponent */}
            <View style={{ flex: 2 }}></View>

            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <TouchableHighlight style={styles.search} onPress={toggleModal}>
                    <Text style={{ color: colors.white }}>Search</Text>
                </TouchableHighlight>
                {showNewPostModal && (
                    <NewPostModalComponent toggleModal={toggleModal} />
                )}
            </View>

            <View style={{ flex: 7 }}>
                <FeedComponent
                    flatListRef={flatListRef}
                    refreshPosts={refreshPosts}
                />
            </View>

            {isExpanded && (
                <BlurView
                    style={styles.absoluteFill}
                    intensity={30}
                    tint="dark"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    homeScreen: {
        flex: 1,
        width: "100%",
        backgroundColor: colors.primary,
    },
    search: {
        backgroundColor: colors.black,
        height: 50,
        width: 80,
        alignItems: "center",
        justifyContent: "center",
    },
    absoluteFill: {
        position: "absolute",
        // zIndex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export default HomeScreen;
