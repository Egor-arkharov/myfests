import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCyEZjsdUb-DgCvs7u0qY-jYXpX6Jl3Qbc",
	authDomain: "my-fests.firebaseapp.com",
	projectId: "my-fests",
	storageBucket: "my-fests.appspot.com",
	messagingSenderId: "995285414250",
	appId: "1:995285414250:web:a02ca157bbc8c64c92b513",
};

initializeApp(firebaseConfig);

const db = getFirestore();

const festsCollection = collection(db, "fests");

export default festsCollection;
