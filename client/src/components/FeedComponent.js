import { useRef, useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import SwipeComponent from "./SwipeComponent";
import FetchPosts from "../utils/FetchPosts";
import { colors } from "../../assets/styles";

const FeedComponent = ({ flatListRef, refreshPosts }) => {
    const [posts, setPosts] = useState([]);
    const [lastVisiblePost, setLastVisiblePost] = useState(null);
    const [loading, setLoading] = useState(false);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <SwipeComponent post={item} />
        </View>
    );

    useEffect(() => {
        const fetchInitialPosts = async () => {
            try {
                const result = await FetchPosts(null);
                const { newPosts, newLastVisible } = result;

                setPosts(newPosts);
                setLastVisiblePost(newLastVisible);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        setLastVisiblePost(null);
        fetchInitialPosts();
    }, [refreshPosts]);

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

    return (
        <FlatList
            ref={flatListRef}
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onEndReached={fetchMorePosts}
            onEndReachedThreshold={0.5}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        width: "100%",
        height: 550,
        paddingBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.7,
        shadowRadius: 5,
        elevation: 10, // for Android
    },
});

export default FeedComponent;
