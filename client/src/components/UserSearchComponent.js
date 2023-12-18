import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, StyleSheet } from "react-native";
import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { colors } from "../../assets/styles";

const UserSearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        if (!searchQuery) {
            setSearchResults([]);
            return;
        }

        try {
            // Create a range for the query: start at `searchQuery` and end at `searchQuery` + '\uf8ff'
            // This range includes all strings that start with `searchQuery`
            const startAtQuery = searchQuery;
            const endAtQuery = searchQuery + "\uf8ff";

            const q = query(
                collection(db, "Users"),
                where("username", ">=", startAtQuery),
                where("username", "<=", endAtQuery)
            );
            const querySnapshot = await getDocs(q);
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data().username); // Adjust according to your data structure
            });
            setSearchResults(users);
        } catch (error) {
            console.error("Error searching users: ", error);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 1000); // 1000ms delay for debouncing

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search Users"
                placeholderTextColor={colors.secondary}
                onChangeText={(text) => setSearchQuery(text)}
                value={searchQuery}
                autoCapitalize="none"
                returnKeyType="search"
            />
            <FlatList
                data={searchResults}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.item}>{item}</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    searchInput: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color: colors.white,
        borderColor: colors.secondary,
        borderRadius: 5,
    },
    item: {
        color: colors.white,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary,
    },
});

export default UserSearchComponent;
