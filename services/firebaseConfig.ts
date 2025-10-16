// Firebase configuration has been updated with your project details.

export const firebaseConfig = {
  apiKey: "AIzaSyDIE7hK6HCD0-qTb1Eq9P7DufAMhk-PLzs",
  authDomain: "fll-ftc-interest-app.firebaseapp.com",
  projectId: "fll-ftc-interest-app",
  storageBucket: "fll-ftc-interest-app.appspot.com",
  messagingSenderId: "1027540612916",
  appId: "1:1027540612916:web:e0e0a20226a184fd4dd761"
};

// Also, ensure your Firestore security rules are set up correctly.
// For development, you can start with open rules, but secure them for production.
// Example for development (in Firebase Console -> Firestore Database -> Rules):
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
*/
