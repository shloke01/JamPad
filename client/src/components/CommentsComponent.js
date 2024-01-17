import React, { useState, useEffect, useRef } from "react";
import {
    View,
    // FlatList,
    TextInput,
    Button,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";

const CommentsComponent = ({
    post,
    currentUsername,
    comments,
    fetchComments,
}) => {
    const [newComment, setNewComment] = useState("");

    // const fetchComments = async () => {
    //     const commentsRef = collection(db, "Posts", post.id, "Comments");
    //     const commentsSnapshot = await getDocs(commentsRef);

    //     const comments = commentsSnapshot.docs.map((doc) => ({
    //         id: doc.id,
    //         ...doc.data(),
    //     }));
    //     setComments(comments);
    // };

    const handleNewCommentSubmit = async () => {
        if (newComment.trim() == "") {
            return;
        }
        const commentData = {
            text: newComment,
            userId: auth.currentUser.uid,
            username: currentUsername,
            timestamp: Math.floor(Date.now() / 1000),
        };

        await addDoc(collection(db, "Posts", post.id, "Comments"), commentData);
        setNewComment("");
        fetchComments();
    };

    useEffect(() => {
        fetchComments();
    }, [post]);

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.commentsContainer}
                data={comments}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                renderItem={({ item }) => (
                    <View style={styles.comment}>
                        <Text style={styles.username}>{item.username}</Text>
                        <Text style={styles.commentText}>{item.text}</Text>
                    </View>
                )}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Write a comment..."
                    placeholderTextColor="#7f8c8d"
                    returnKeyType="done"
                />

                <Button title="Post" onPress={handleNewCommentSubmit} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 20,
    },
    commentsContainer: {
        overflow: "hidden",
        borderRadius: 20,
        marginBottom: 10,
    },
    comment: {
        backgroundColor: "#1c1c1e", // Slightly lighter than black for contrast
        borderBottomWidth: 1,
        borderBottomColor: "#333", // Dark grey border for subtle separation
        padding: 10,
        borderRadius: 5,
    },
    username: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff", // White color for contrast
        marginBottom: 4, // Space between username and comment
    },
    commentText: {
        fontSize: 14,
        color: "#ddd", // Lighter color for the comment text
    },
    inputContainer: {},
    input: {
        backgroundColor: "#353535",
        color: "#fff",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
});

export default CommentsComponent;
