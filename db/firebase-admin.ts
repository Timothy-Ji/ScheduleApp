import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.log("Firebase-admin error", error.stack);
  }
}

export const app = admin.app();
export const firestore = admin.firestore();
export const auth = admin.auth();