import { useState, useEffect, useCallback } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import CreatePostComponent from "./CreatePostComponent";

function SongSearchComponent({ toggleModal }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [postPreviewMode, setPostPreviewMode] = useState(false);
    const [postData, setPostData] = useState({});

    const togglePreviewMode = () => {
        setPostPreviewMode(!postPreviewMode);
    };

    const getArtistNames = (artists) => {
        return artists.map((artist) => artist.name);
    };

    const getAlbumArtUrl = (album) => {
        return album.images[0]?.url;
    };

    const spotifySearch = async (query) => {
        if (query.trim() === "") {
            setSearchResults([]);
            return;
        }

        try {
            // Send data to flask API
            const response = await fetch(
                "http://10.0.0.195:3000/spotify-search",
                // "http://192.168.0.116:3000/spotify-search",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        track: query,
                    }),
                }
            );
            const responseData = await response.json();
            if (response.status === 200) {
                setSearchResults(responseData.results);
                // console.log(searchResults[0].name);
            }
        } catch (error) {
            console.error("Error searching for songs:", error);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                spotifySearch(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search for a song..."
                placeholderTextColor="dimgray"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {postPreviewMode ? (
                <CreatePostComponent
                    postData={postData}
                    onCancel={togglePreviewMode}
                    toggleModal={toggleModal}
                />
            ) : (
                searchResults.length > 0 && (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.listItem}
                                onPress={() => {
                                    setPostData({
                                        albumArtUrl: getAlbumArtUrl(item.album),
                                        songName: item.name,
                                        artistNames: getArtistNames(
                                            item.artists
                                        ),
                                        previewUrl: item.preview_url,
                                    });
                                    setPostPreviewMode(true);
                                }}
                            >
                                <Image
                                    source={{ uri: getAlbumArtUrl(item.album) }}
                                    style={styles.albumArt}
                                />
                                <View style={styles.textContainer}>
                                    <Text style={styles.trackName}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.artistName}>
                                        {getArtistNames(item.artists).join(
                                            ", "
                                        )}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
    },
    input: {
        height: 50,
        width: "100%",
        color: "black",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        overflow: "hidden",
    },
    albumArt: {
        width: 50, // Adjust as needed
        height: 50, // Adjust as needed
        borderRadius: 10,
        marginRight: 10,
    },
    textContainer: {
        flex: 1, // Take up remaining space
    },
    trackName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    artistName: {
        fontSize: 14,
        color: "gray",
    },
});

export default SongSearchComponent;
