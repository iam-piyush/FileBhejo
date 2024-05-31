import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  //Firebase Configuration
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
