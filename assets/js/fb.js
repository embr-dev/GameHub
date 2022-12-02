const firebaseConfig = {
  apiKey: "AIzaSyCljTB8jYkhyf_XRlbcRk6ai2c1kmTwSpQ",
  authDomain: "gamehub-527d9.firebaseapp.com",
  projectId: "gamehub-527d9",
  storageBucket: "gamehub-527d9.appspot.com",
  messagingSenderId: "609224844553",
  appId: "1:609224844553:web:4e5e898220b26b594ddfd8"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const gamesDB = database.ref('games')

fetch('/assets/JSON/gs2.json')
  .then(obj => obj.json())
  .then(data => {
    gamesDB.set(data)
  });