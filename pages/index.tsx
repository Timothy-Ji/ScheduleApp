import { Box, Typography } from "@mui/material";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import Layout from "../components/layout/Layout";
import AuthContext from "../context/AuthContext";

const Home: NextPage = () => {
  const authCtx = useContext(AuthContext);

  return (
    <div>
      <Head>
        <title>Schedule App</title>
        <meta
          name="description"
          content="Create, manage, and share your schedules."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box justifyContent="space-between" sx={{ m: 1 }}>
          <Typography variant="h4" align="center">
            Welcome {authCtx.email}!
          </Typography>
        </Box>
      </main>

      <footer></footer>
    </div>
  );
};

export default Layout(Home);
