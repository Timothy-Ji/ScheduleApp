import type { NextApiRequest, NextApiResponse } from "next";
import { destroyCookie } from "nookies";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    destroyCookie({ res }, "user", { path: "/" });
    res.status(200).json({ ok: true });
  }
}

export default handler;
