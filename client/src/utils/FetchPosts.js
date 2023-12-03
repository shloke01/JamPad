import {
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    startAfter,
} from "@firebase/firestore";
import { db } from "../config/firebase";

async function FetchPosts(lastVisible) {
    const POSTS_LIMIT = 5;
    let newPosts = [];
    let newLastVisible = null;

    try {
        const q = query(
            collection(db, "Posts"),
            orderBy("timestamp", "desc"),
            limit(POSTS_LIMIT),
            ...(lastVisible ? [startAfter(lastVisible)] : [])
        );
        const querySnapshot = await getDocs(q);
        newPosts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    } catch (error) {
        console.error("Error fetching posts: ", error);
    }

    return { newPosts, newLastVisible };
}

export default FetchPosts;
