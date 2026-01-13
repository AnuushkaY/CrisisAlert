// Import the function you need from the Firebase SDK
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKbud3rmpFjxnmj4rSBCl1hIDdNQZhpis",
  authDomain: "crisismanagement-d14af.firebaseapp.com",
  projectId: "crisismanagement-d14af",
  storageBucket: "crisismanagement-d14af.appspot.com",
  messagingSenderId: "476370896568",
  appId: "1:476370896568:web:19d6e3e0433840e36f164d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the app instance
export default app;
