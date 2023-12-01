import { Modal, View, Text, Button, StyleSheet } from "react-native";
import SongSearchComponent from "./SongSearchComponent";
import { db, auth } from "../config/firebase";
import { doc, getDoc } from "@firebase/firestore";
import { useState, useEffect } from "react";

function NewPostModalComponent({ toggleModal }) {
    // Control modal visibility
    const [modalVisible, setModalVisible] = useState(false);

    // Display name that shows up
    const [displayName, setDisplayName] = useState("");

    // Function to get display name from firebase
    const getDisplayName = async () => {
        userId = auth.currentUser.uid;
        const docRef = doc(db, "Users", userId);
        const docSnap = await getDoc(docRef);
        const user = docSnap.data()["firstName"];
        setDisplayName(user);
        // Set modal visible only after promise for display name retrieval has been returned
        setModalVisible(true);
    };

    useEffect(() => {
        getDisplayName();
    }, []);

    return (
        <Modal
            style={styles.container}
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={toggleModal}
        >
            <View style={styles.container}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text
                            style={{
                                fontSize: 25,
                                fontWeight: "bold",
                                marginBottom: 5,
                            }}
                        >
                            Hello, {displayName}
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                fontStyle: "italic",
                                fontWeight: "300",
                            }}
                        >
                            What are you jamming to?
                        </Text>
                    </View>
                    <View style={styles.searchView}>
                        <SongSearchComponent toggleModal={toggleModal} />
                    </View>
                    <Button title="Close" onPress={toggleModal} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "80%",
        justifyContent: "center",
        alignSelf: "center",
    },
    modalView: {
        minHeight: "70%",
        backgroundColor: "#FDF5E2",
        borderRadius: 20,
        padding: 30,
    },
    header: {
        flex: 1,
    },
    searchView: {
        flex: 5,
    },
});

export default NewPostModalComponent;
