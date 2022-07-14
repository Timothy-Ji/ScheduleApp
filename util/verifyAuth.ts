import "firebase/auth";
import { app } from "../db/firebase-admin";
import AuthClaims from "./AuthClaims";

async function verifyAuth(sessCookie: string): Promise<AuthClaims> {
  try {
    const claims = await app.auth().verifySessionCookie(sessCookie, true);
    const status = {
      authenticated: true,
      uid: claims.uid,
      email: claims.email,
    };
    return status;
    return {
      authenticated: true,
    };
  } catch {
    return {
      authenticated: false,
    };
  }
}

export default verifyAuth;
