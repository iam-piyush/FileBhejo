import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyA4ygCHKxVpJvIYslnXjWr7TbRoTLcAkqc",
  authDomain: "filebhejo-e94a3.firebaseapp.com",
  databaseURL: "https://filebhejo-e94a3-default-rtdb.firebaseio.com",
  projectId: "filebhejo-e94a3",
  storageBucket: "filebhejo-e94a3.appspot.com",
  messagingSenderId: "1033450785315",
  appId: "1:1033450785315:web:fc5e3dfd21ad930aefbf96",
  measurementId: "G-RX8R3831WS"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
// const analytics = getAnalytics(app);