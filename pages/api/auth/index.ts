import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAdmin } from "../../../db/firebase-admin";

// const expiresIn = 432000; // 5d
const expiresIn = 600;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const admin = getAdmin();
  if (req.method === "POST") {
    const idToken = req.body.token;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (new Date().getTime() / 1000 - decodedToken.auth_time < 5 * 60) {
      const cookie = await admin
        .auth()
        .createSessionCookie(idToken, { expiresIn });

      if (cookie) {
        const options = {
          maxAge: expiresIn,
          httpOnly: true,
          secure: true,
          path: "/",
        };
        res.setHeader("Set-Cookie", serialize("user", cookie, options));
        res.status(200).json({ ok: true });
      }
    } else {
      res.status(401).json({ ok: false, message: "Token is too old." });
    }
  }
}
