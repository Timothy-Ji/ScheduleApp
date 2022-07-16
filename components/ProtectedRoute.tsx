import React, { ComponentType, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import AuthDialog from "./auth/AuthDialog";

const ProtectedRoute = <P,>(Component: ComponentType<P>): ComponentType<P> => {
  const ProtectedRoute = (props: P) => {
    const authCtx = useContext(AuthContext);

    if (!authCtx.isAuthenticated) {
      return <AuthDialog open={true} />;
    }

    return <Component {...props} />;
  };

  return ProtectedRoute;
};

export default ProtectedRoute;
