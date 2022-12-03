const firebaseConfig = {
  apiKey: "AIzaSyCljTB8jYkhyf_XRlbcRk6ai2c1kmTwSpQ",
  authDomain: "gamehub-527d9.firebaseapp.com",
  databaseURL: "https://gamehub-527d9-default-rtdb.firebaseio.com",
  projectId: "gamehub-527d9",
  storageBucket: "gamehub-527d9.appspot.com",
  messagingSenderId: "609224844553",
  appId: "1:609224844553:web:dc43596c5145a7d64ddfd8"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const database = firebase.database();

fbjsLoaded = true;

/*var starCountRef = firebase.database().ref('accounts');
starCountRef.on('value', (snapshot) => {
  const data = snapshot.val();
  console.log(data)
});*/