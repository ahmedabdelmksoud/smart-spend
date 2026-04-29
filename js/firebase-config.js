// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxeqS3oKQlu7gtnuRzcDaA9lH43m5qYwE",
  authDomain: "smart-spend-ab121.firebaseapp.com",
  databaseURL: "https://smart-spend-ab121-default-rtdb.firebaseio.com",
  projectId: "smart-spend-ab121",
  storageBucket: "smart-spend-ab121.firebasestorage.app",
  messagingSenderId: "5129010252",
  appId: "1:5129010252:web:9b4a036beb9c141cc808e9",
  measurementId: "G-2BC6JPJB4V"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Export Firebase services
const auth = firebase.auth();
const database = firebase.database();
