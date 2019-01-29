import app from "firebase/app";
import "firebase/auth";

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
    }

    doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
}

export default Firebase;
