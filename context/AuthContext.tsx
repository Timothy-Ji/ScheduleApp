import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import "../lib/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  Auth,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import useHttp from "../hooks/useHttp";
import { useRouter } from "next/router";

type AuthContextType = {
  isAuthenticated: boolean;
  auth: Auth;
  signup: (email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  auth: undefined,
  signup: async () => {},
  signin: async () => {},
  signout: async () => {},
});

const auth = getAuth();
export const AuthContextProvider: React.FC<PropsWithChildren> = (props) => {
  const http = useHttp();
  const router = useRouter();

  const signup = async (email: string, password: string) => {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    postUserToken(await userCred.user.getIdToken());
  };

  const signin = async (email: string, password: string) => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    postUserToken(await userCred.user.getIdToken());
  };

  const signout = async () => {
    await signOut(auth);
  };

  const postUserToken = async (token: string) => {
    await http.post("api/auth", {
      body: token,
    });
  };

  const redirectToLogin = useCallback(() => {
    console.log(router.pathname);
    if (!router.pathname.startsWith("/login")) {
      router.push({
        pathname: "/login",
      });
    }
  }, [router]);

  // useEffect(() => {
  //   if (true) {
  //     redirectToLogin();
  //   }
  // }, [redirectToLogin]);

  const ctx: AuthContextType = {
    isAuthenticated: Boolean(auth.currentUser),
    auth,
    signup,
    signin,
    signout,
  };
  return (
    <AuthContext.Provider value={ctx}>{props.children}</AuthContext.Provider>
  );
};

export default AuthContext;
