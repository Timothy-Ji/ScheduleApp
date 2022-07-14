import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";

const useProtectedRoute = (redirect?: string | undefined) => {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!authContext.isAuthenticated) router.push(redirect || "/");
  }, [authContext.isAuthenticated, redirect, router]);
};

export default useProtectedRoute;
