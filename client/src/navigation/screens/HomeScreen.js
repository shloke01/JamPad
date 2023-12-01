import React, { useState } from "react";
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

const DATA = [
    {
        id: "1",
        albumArtUri: "First Post",
        songName: "Right Mind",
        artistNames: ["Shloke M", "Raza"],
    },
];

const renderItem = ({ item }) => (
    <View style={styles.item}>
        <SwipeComponent post={item} />
    </View>
);

function HomeScreen({ navigation }) {
    const [showNewPostModal, setShowNewPostModal] = useState(false);

    const toggleModal = () => {
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
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
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
