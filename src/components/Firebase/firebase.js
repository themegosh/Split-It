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

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref("users");

    activities = uid => this.db.ref(`users/${uid}/activities`);

    people = pid => this.db.ref(`people/${pid}`);

    bills = bid => this.db.ref(`bills/${bid}`);
}

export default Firebase;
