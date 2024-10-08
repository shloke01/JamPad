import { db, auth } from "../config/firebase";
import { doc, collection, addDoc, getDoc } from "@firebase/firestore";

async function CreatePost(
    albumArtUrl,
    songName,
    artistNames,
    previewUrl,
    caption
) {
    const docRef = doc(db, "Users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    const username = docSnap.data()["username"];

    postData = {
        timestamp: Math.floor(Date.now() / 1000),
        userId: auth.currentUser.uid,
        username: username,
        caption: caption,
        songName: songName,
        artistNames: artistNames,
        albumArtUrl: albumArtUrl,
        previewUrl: previewUrl,
        likes: {},
    };

    addDoc(collection(db, "Posts"), postData);
    console.log("posted");
}

export default CreatePost;
