import type { NextPage } from "next";
import AuthDialog from "../components/auth/AuthDialog";

const Home: NextPage = () => {
  return (
    <div>
      <AuthDialog open={true} />
    </div>
  );
};

export default Home;
