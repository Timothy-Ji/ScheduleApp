import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { parseCookies } from "nookies";
import verifyAuthCookie from "./verifyAuthCookie";

const getAuthInfo = async (
  context: GetServerSidePropsContext | NextApiResponse
) => {
  let authInfo = {
    authenticated: false,
    uid: "",
    email: "",
  };

  const cookies = parseCookies(context);

  if (cookies.user) {
    const authentication = await verifyAuthCookie(cookies.user);
    authInfo.authenticated = authentication
      ? authentication.authenticated
      : false;
    authInfo.uid = authentication ? authentication.uid : "";
    authInfo.email = authentication ? authentication.email : "";
  }

  return authInfo;
};

export const getAuthInfoFromRequest = async (req: NextApiRequest) => {
  let authInfo = {
    authenticated: false,
    uid: "",
    email: "",
  };

  const cookies = req.cookies;

  if (cookies.user) {
    const authentication = await verifyAuthCookie(cookies.user);
    authInfo.authenticated = authentication
      ? authentication.authenticated
      : false;
    authInfo.uid = authentication ? authentication.uid : "";
    authInfo.email = authentication ? authentication.email : "";
  }

  return authInfo;
};

export default getAuthInfo;
