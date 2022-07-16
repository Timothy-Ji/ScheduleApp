import type { NextApiRequest, NextApiResponse } from "next";
import getAuthInfo from "../../../util/getAuthInfo";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const authInfo = await getAuthInfo(res);
    res.status(200).json(authInfo);
  }
}

export default handler;
