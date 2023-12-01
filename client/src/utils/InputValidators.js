import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function validateEmail(input) {
    const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(input).toLowerCase());
}

async function emailExists(input) {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("email", "==", input));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
}

function validateUsername(input) {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,13}[a-zA-Z0-9]$/;
    return regex.test(input);
}

async function usernameExists(input) {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("username", "==", input));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
}

function validateNames(input) {
    const regex = /^[a-zA-Z]+(?:[-' ][a-zA-Z]+)*$/;
    return regex.test(input);
}

function validatePassword(input) {
    return input.length >= 6;
}

export {
    validateEmail,
    validateNames,
    validateUsername,
    validatePassword,
    usernameExists,
    emailExists,
};
