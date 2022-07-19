import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyA4hT2D4Z1Lojk_MFEr5xc6we4TOvOjnKk",
    authDomain: "appointments-e0a87.firebaseapp.com",
    projectId: "appointments-e0a87",
    storageBucket: "appointments-e0a87.appspot.com",
    messagingSenderId: "732755920473",
    appId: "1:732755920473:web:2062e70970b0a9a5fc1348"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (firstName, lastName, email, password, phone, role) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      firstName,
      lastName,
      authProvider: "local",
      email,
      phone,
      role,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerProfessionalWithEmailAndPassword = async (firstName, lastName, place, office, address, postnumber, postalDistrict, phone, email, password, createdBy, createdByName) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      authProvider: "local",
      firstName: firstName,
      lastName: lastName,
      place: place,
      office: office,
      address: address,
      postnumber: postnumber,
      postalDistrict: postalDistrict,
      phone: phone,
      createdBy: createdBy,
      createdByName: createdByName,
      createdAt: serverTimestamp(),
      description: "",
      email: email,
      password: password,
      role: "professional"
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};
export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  registerProfessionalWithEmailAndPassword,
  sendPasswordReset,
  logout,
  addDoc,
  collection
};