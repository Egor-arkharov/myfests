import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
	apiKey: process.env.FIREBASE_APIKEY,
	authDomain: "my-fests.firebaseapp.com",
	projectId: "my-fests",
	storageBucket: "my-fests.appspot.com",
	messagingSenderId: "995285414250",
	appId: process.env.FIREBASE_APIID,
};

initializeApp(firebaseConfig);

const db = getFirestore();

const festsCollection = collection(db, "fests");

export default festsCollection;
