import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCpWyQo8BM10wLp7GhrpjVh8q-cZLgn6fY",
  authDomain: "registros-4a752.firebaseapp.com",
  projectId: "registros-4a752",
  storageBucket: "registros-4a752.appspot.com",
  messagingSenderId: "519196758241",
  appId: "1:519196758241:web:326c8cbeb56d8242cb27a0",
  measurementId: "G-YPX5MC0ENW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const dataBase = getDatabase(app);

export {dataBase};

