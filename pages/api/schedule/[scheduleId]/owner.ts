import type { NextApiRequest, NextApiResponse } from "next";
import { app } from "../../../../db/firebase-admin";
import userschedules from "../../../../db/user-schedules";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const scheduleId = <string>req.query.scheduleId;
  if (req.method === "GET") {
    try {
      const ownerId = await userschedules.getOwner(scheduleId);

      const ownerEmail = (await app.auth().getUser(ownerId)).email;
      const response = {
        uid: ownerId,
        email: ownerEmail,
      };
      res.status(200).json(response);
    } catch {
      res.status(400).json({ ok: false });
    }
  }
}
