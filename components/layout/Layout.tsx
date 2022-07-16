import Box from "@mui/material/Box";
import React, { ComponentType } from "react";
import ProtectedRoute from "../ProtectedRoute";
import ResponsiveAppBar from "./ResponsiveAppBar";

const Layout = <P,>(Component: ComponentType<P>): ComponentType<P> => {
  const Layout = (props: P) => (
    <Box>
      <ResponsiveAppBar />
      <Box>
        <Component {...props} />
      </Box>
    </Box>
  );

  return ProtectedRoute(Layout);
};

export default Layout;
