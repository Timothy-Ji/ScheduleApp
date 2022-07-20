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
  inMemoryPersistence,
} from "firebase/auth";
import useHttp from "../hooks/useHttp";

type AuthContextType = {
  isAuthenticated: boolean;
  uid: string;
  email: string;
  signup: (email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  uid: "",
  email: "",
  signup: async () => {},
  signin: async () => {},
  signout: async () => {},
});

export const AuthContextProvider: React.FC<PropsWithChildren> = (props) => {
  const [auth] = useState(getAuth());
  const [authInfo, setAuthInfo] = useState({
    authenticated: false,
    uid: undefined,
    email: undefined,
  });
  const http = useHttp();

  useEffect(() => {
    auth.setPersistence(inMemoryPersistence);
  }, [auth]);

  const signup = async (email: string, password: string) => {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await postUserToken(await userCred.user.getIdToken());
    verify();
  };

  const signin = async (email: string, password: string) => {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    await postUserToken(await userCred.user.getIdToken());
    verify();
  };

  const signout = async () => {
    await signOut(auth);
    await http.post("/api/auth/signout");
    verify();
  };

  const postUserToken = async (token: string) => {
    await http.post("/api/auth", {}, { token });
  };

  const ctx: AuthContextType = {
    isAuthenticated: authInfo.authenticated,
    uid: authInfo.uid,
    email: authInfo.email,
    signup,
    signin,
    signout,
  };

  const verify = useCallback(async () => {
    const httppost = http.post;
    const authInfo: { authenticated: boolean; uid: string; email: string } =
      await httppost("/api/auth/verify");
    setAuthInfo(authInfo);
  }, [http.post]);

  useEffect(() => {
    (async () => await verify())();
  }, [verify]);

  return (
    <AuthContext.Provider value={ctx}>{props.children}</AuthContext.Provider>
  );
};

export default AuthContext;
