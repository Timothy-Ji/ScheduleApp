import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLJt_m887bO0kiEP09AWibDAxaqMKl-oc",
  authDomain: "scheduleapp-dev-871e3.firebaseapp.com",
  projectId: "scheduleapp-dev-871e3",
  storageBucket: "scheduleapp-dev-871e3.appspot.com",
  messagingSenderId: "965795966026",
  appId: "1:965795966026:web:1cf0a81854649269dc8ab3",
  measurementId: "G-MZXQWV66X0",
};

export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);