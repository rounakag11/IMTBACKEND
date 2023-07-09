const {initializeApp} = require('firebase/app')
const  {getFirestore}  =  require('firebase/firestore/lite')

const firebaseConfig = {
  apiKey: "AIzaSyC-0SwCY8WeszQE_VR31TGSyTaWCvwjOsk",
  authDomain: "inventory-management-tools.firebaseapp.com",
  projectId: "inventory-management-tools",
  storageBucket: "inventory-management-tools.appspot.com",
  messagingSenderId: "402602190337",
  appId: "1:402602190337:web:a75405d45260eec6794200",
  measurementId: "G-56NZR7Z6V6",
};
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const collectionName = database.collection("InventoryDB")

module.exports= collectionName
