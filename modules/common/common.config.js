const mongoose = require("mongoose");
const { initializeApp } = require("firebase/app");

const DatabaseConnection = async () => {
  let mongoUrl = null;
  let databaseStatus = null;

  switch (process.env.NODE_ENV) {
    case "production":
      mongoUrl = process.env.MONGODB_URI_PROD;
      databaseStatus = "PRODUCTION";
      break;
    case "development":
      mongoUrl = process.env.MONGODB_URI_DEV;
      databaseStatus = "DEVELOPMENT";
      break;
  }

  mongoose.set("strictQuery", true);
  mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log(`${databaseStatus} DATABASE CONNECTED..!!`);
    })
    .catch((err) => {
      throw new Error(err);
    });
};

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: "dbnn-1aa5a.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

module.exports = { DatabaseConnection, firebaseApp };
