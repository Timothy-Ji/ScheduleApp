import type { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/layout/Layout";

const Home: NextPage = () => {
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

      <main></main>

      <footer></footer>
    </div>
  );
};

export default Layout(Home);
