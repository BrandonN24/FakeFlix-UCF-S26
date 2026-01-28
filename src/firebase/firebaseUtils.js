import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"

// Parsing the environment variable keys from the .env and storing them in local constant vars.
const { REACT_APP_FIREBASE_API_KEY, REACT_APP_FIREBASE_AUTH_DOMAIN, REACT_APP_FIREBASE_PROJECT_ID, REACT_APP_FIREBASE_STORAGE_BUCKET, REACT_APP_FIREBASE_MESSAGING_SENDER_ID, REACT_APP_FIREBASE_APP_ID, REACT_APP_FIREBASE_MEASUREMEMT_ID } = process.env;

// Firebase Configuration Object
// The firebaseConfig object stores the API keys into several local variables that can be easily referenced through out the script.
const firebaseConfig = {
    apiKey: REACT_APP_FIREBASE_API_KEY,
    authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: REACT_APP_FIREBASE_APP_ID,
    measurementId: REACT_APP_FIREBASE_MEASUREMEMT_ID
}

// createUserProfileDocument
// asynchronous function
// in: user authentication data (userAuth), additionalData
// out: user reference document (userRef) - type: firebase.firestore.DocumentReference
export const createUserProfileDocument = async (userAuth, additionalData) => {
    // if the userAuth data is null then exit.
    if (!userAuth) return;

    // obtains the user reference value from the userAuth.uid number.
    const userRef = firestore.doc(`users/${userAuth.uid}`);

    // attempt to see if existing data exists for this user reference value.
    const snapShot = await userRef.get();

    // if no existing data exists from the userAuth.uid number, create a new user.
    if (!snapShot.exists) {
        // fills the displayName, email, and photoURL vars with the data present in userAuth.
        const { displayName, email, photoURL } = userAuth;

        // stores the date that this data was created.
        const createdAt = new Date();

        // attempt to update the user reference document with the new data obtained from userAuth.
        try {
            await userRef.set({
                displayName,
                email,
                photoURL,
                createdAt,
                ...additionalData,
            })
        } catch (error) {
            console.log("error creating user", error.message)
        }
    }

    // return the user reference document
    return userRef;
}

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            unsubscribe();
            resolve(userAuth);
        }, reject);
    });
}

// Firebase web app init
// creates and initializes a Firebase app instance using the API keys that were stored in firebaseConfig.
firebase.initializeApp(firebaseConfig)
// gets the authentication service for the app.
export const auth = firebase.auth()
// gets an initialization of the firebase document database entry point (firestore)
export const firestore = firebase.firestore()

// Sign in With Google Setup with popup
export const googleProvider = new firebase.auth.GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider)

export default firebase
