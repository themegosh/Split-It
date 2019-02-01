import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
    apiKey: "AIzaSyBuet6g4CW-HepCXHgOT9izAEc8KSezaC0",
    authDomain: "dmdev-split-it.firebaseapp.com",
    databaseURL: "https://dmdev-split-it.firebaseio.com",
    projectId: "dmdev-split-it",
    storageBucket: "dmdev-split-it.appspot.com",
    messagingSenderId: "494102016098"
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.db = app.database();
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    user = userId => this.db.ref(`users/${userId}`);

    users = () => this.db.ref("users");

    activities = userId => this.db.ref(`users/${userId}/activities`);

    activity = (userId, activityId) =>
        this.db.ref(`users/${userId}/activities/${activityId}`);

    people = (userId, activityId) =>
        this.db.ref(`users/${userId}/activities/${activityId}/people`);

    bills = (userId, activityId) =>
        this.db.ref(`users/${userId}/activities/${activityId}/bills`);
}

export default Firebase;
