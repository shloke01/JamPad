import React, { useState } from "react";
import {
    View,
    ScrollView,
    TextInput,
    Button,
    Text,
    Image,
    StyleSheet,
} from "react-native";
import { colors } from "../../assets/styles";
import CreatePost from "../utils/CreatePost";

const CreatePostComponent = ({ songData, onCancel, toggleModal }) => {
    const [caption, setCaption] = useState("");

    const handlePost = () => {
        CreatePost(
            songData.albumArtUrl,
            songData.songName,
            songData.artistNames
        );
        toggleModal();
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                {/* Caption Input */}
                <TextInput
                    style={styles.captionInput}
                    placeholder="Write a caption..."
                    placeholderTextColor="#7f8c8d"
                    value={caption}
                    onChangeText={setCaption}
                    multiline
                />

                {/* Album Art */}
                <View style={styles.albumArtContainer}>
                    <Image
                        source={{ uri: songData.albumArtUrl }}
                        style={styles.albumArt}
                    />
                </View>

                {/* Song Info */}
                <View style={styles.songInfoContainer}>
                    <Text style={styles.songTitle}>{songData.songName}</Text>
                    <Text style={styles.artistNames}>
                        {songData.artistNames.join(", ")}
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <Button title="Cancel" onPress={onCancel} color="#e74c3c" />
                    <Button title="Post" onPress={handlePost} color="#2ecc71" />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        maxHeight: "100%", // Adjust this as needed
    },
    container: {
        marginTop: 20,
        backgroundColor: "#28282B",
        padding: 20,
        borderRadius: 20,
    },
    captionInput: {
        backgroundColor: "#353535",
        color: "#fff",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 20,
    },
    albumArtContainer: {
        marginBottom: 10,
    },
    albumArt: {
        alignSelf: "center",
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    songInfoContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    songTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ecf0f1",
        textAlign: "center",
    },
    artistNames: {
        fontSize: 14,
        color: "#bdc3c7",
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default CreatePostComponent;
