import React, { useState, useEffect, useRef } from "react";
import {
    View,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Text,
    TouchableHighlight,
    Alert,
    Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SwipeComponent from "../../components/SwipeComponent";
import SongSearchComponent from "../../components/SongSearchComponent";
import { FlatList } from "react-native";
import { colors } from "../../../assets/styles";
import NewPostModalComponent from "../../components/NewPostModalComponent";
import FetchPosts from "../../utils/FetchPosts";

// const DATA = [
//     {
//         id: "1",
//         albumArtUrl: "First Post",
//         songName: "Right Mind",
//         artistNames: ["Shloke M", "Raza"],
//     },
// ];

const renderItem = ({ item }) => (
    <View style={styles.item}>
        <SwipeComponent post={item} />
    </View>
);

function HomeScreen({ navigation }) {
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [posts, setPosts] = useState([]);
    const [lastVisiblePost, setLastVisiblePost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newPost, setNewPost] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        const fetchInitialPosts = async () => {
            try {
                const result = await FetchPosts(lastVisiblePost);
                const { newPosts, newLastVisible } = result;

                setPosts(newPosts);
                setLastVisiblePost(newLastVisible);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchInitialPosts();
    }, [newPost]);

    const fetchMorePosts = async () => {
        if (lastVisiblePost && !loading) {
            setLoading(true);
            try {
                const result = await FetchPosts(lastVisiblePost);
                const { newPosts, newLastVisible } = result;

                setPosts((prevPosts) => [...prevPosts, ...newPosts]);
                setLastVisiblePost(newLastVisible);
            } catch (error) {
                console.error("Error fetching more posts:", error);
            }
            setLoading(false);
        }
    };

    const scrollToTop = () => {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
        setLastVisiblePost(null);
    };

    const toggleModal = () => {
        scrollToTop();
        setNewPost(newPost + 1);
        setShowNewPostModal(!showNewPostModal);
    };

    return (
        <SafeAreaView style={styles.homeScreen}>
            <View
                style={{
                    width: "100%",
                    alignItems: "center",
                }}
            >
                <Ionicons
                    name="musical-notes"
                    size={50}
                    color="tomato"
                    style={styles.icon}
                />
                <TouchableHighlight style={styles.search} onPress={toggleModal}>
                    <Text color="white">Search</Text>
                </TouchableHighlight>
                {showNewPostModal && (
                    <NewPostModalComponent toggleModal={toggleModal} />
                )}
            </View>

            <View style={{ flex: 7, width: "100%" }}>
                <FlatList
                    ref={flatListRef}
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    onEndReached={fetchMorePosts}
                    onEndReachedThreshold={0.5}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    homeScreen: {
        flex: 1,
        width: "100%",
        backgroundColor: colors.primary,
    },
    item: {
        backgroundColor: colors.primary,
        width: "100%",
        height: 200,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
    },
    icon: {
        flex: 1,
    },
    post: {
        height: 200,
        width: "90%",
        margin: 20,
        borderRadius: 10,
        backgroundColor: "white",
    },
    search: {
        margin: 10,
        backgroundColor: "lightskyblue",
        height: 50,
        width: 80,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default HomeScreen;
