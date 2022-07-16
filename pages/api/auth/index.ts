import { CookieSerializeOptions, serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";
import { app } from "../../../db/firebase-admin";

// const expiresIn = 432000000; // 5d
const expiresIn = 10 * 60 * 1000; // 10min
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const idToken = req.body.token;
    const decodedToken = await app.auth().verifyIdToken(idToken);
    if (new Date().getTime() / 1000 - decodedToken.auth_time < 5 * 60) {
      const cookie = await app
        .auth()
        .createSessionCookie(idToken, { expiresIn });

      if (cookie) {
        const options: CookieSerializeOptions = {
          maxAge: expiresIn / 1000,
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: true,
        };
        setCookie({ res }, "user", cookie, options);
        res.status(200).json({ ok: true });
      }
    } else {
      res.status(401).json({ ok: false, message: "Token is too old." });
    }
  }
}

export default handler;
