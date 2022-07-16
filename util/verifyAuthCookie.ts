import "firebase/auth";
import { app } from "../db/firebase-admin";
import AuthClaims from "./AuthClaims";

async function verifyAuthCookie(sessCookie: string): Promise<AuthClaims> {
  try {
    const claims = await app.auth().verifySessionCookie(sessCookie, true);
    return {
      authenticated: true,
      uid: claims.uid,
      email: claims.email,
    };
  } catch {
    return {
      authenticated: false,
      uid: "",
      email: "",
    };
  }
}

export default verifyAuthCookie;
