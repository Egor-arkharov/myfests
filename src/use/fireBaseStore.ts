import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
	apiKey: process.env.FIREBASE_APIKEY,
	authDomain: "my-fests.firebaseapp.com",
	databaseURL:
		"https://my-fests-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "my-fests",
	storageBucket: "my-fests.appspot.com",
	messagingSenderId: "995285414250",
	appId: process.env.FIREBASE_APIID,
};

initializeApp(firebaseConfig);

const db = getFirestore();

const festsCollection = collection(db, "fests");

export default festsCollection;

// function writeUserData(
// 	userId: string,
// 	name: string,
// 	email: string,
// 	picture: string
// ) {
// 	const database = getDatabase();
// 	const refer = ref(database, "users/" + userId);

// 	set(refer, {
// 		username: name,
// 		email: email,
// 		prof: picture,
// 	});
// }

// writeUserData("asdasd", "asdqwe", "my@me.com", "SOMETHING");
