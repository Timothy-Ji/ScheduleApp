import type { NextApiRequest, NextApiResponse } from "next";
import { app } from "../../../../db/firebase-admin";
import userschedules from "../../../../db/user-schedules";
import { getAuthInfoFromRequest } from "../../../../util/getAuthInfo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const scheduleId = <string>req.query.scheduleId;
  const authInfo = await getAuthInfoFromRequest(req);
  const ownerId = await userschedules.getOwner(scheduleId);
  const shared: string[] = await userschedules.getShared(scheduleId);

  if (req.method === "GET") {
    if (authInfo.uid !== ownerId && !shared.includes(authInfo.uid)) {
      res.status(403).json({
        ok: false,
        message: "You do not have permission to access this reosurce.",
      });
      return;
    }
    try {
      const getAppUser = async (uid: string) => {
        const user = await app.auth().getUser(uid);
        return {
          email: user.email,
          uid: user.uid,
        };
      };

      const gettingSharedUsers = shared.map(async (uid) => {
        return await getAppUser(uid);
      });
      const sharedUsers = await Promise.all(gettingSharedUsers);
      const ownerEmail = (await app.auth().getUser(ownerId)).email;
      const response = {
        owner: {
          uid: ownerId,
          email: ownerEmail,
        },
        shared: sharedUsers,
      };
      res.status(200).json(response);
    } catch (e) {
      res.status(400).json({ ok: false });
    }
  } else if (req.method === "POST") {
    if (authInfo.uid !== ownerId) {
      res.status(403).json({
        ok: false,
        message: "You do not have permission to access this reosurce.",
      });
      return;
    }
    if (req.body.userEmail) {
      const email = <string>req.body.userEmail;
      try {
        const user = await app.auth().getUserByEmail(email);
        if (user.uid === authInfo.uid) {
          res.status(400).json({
            ok: false,
            message: "You can not share this resource with the user " + email,
          });
          return;
        }
        await userschedules.addShared(scheduleId, user.uid);
        res.status(200).json({ email: user.email, uid: user.uid });
      } catch (e) {
        if (e.errorInfo.code === "auth/user-not-found") {
          res.status(400).json({
            ok: false,
            message: "There is no user corresponding to given email: " + email,
          });
        }
      }
    } else {
      res.status(422).json({ ok: false });
    }
  } else if (req.method === "DELETE") {
    if (authInfo.uid !== ownerId) {
      res.status(403).json({
        ok: false,
        message: "You do not have permission to access this reosurce.",
      });
      return;
    }
    if (req.body.userId) {
      await userschedules.deleteShared(scheduleId, <string>req.body.userId);
      res.status(200).json({ ok: true });
    } else {
      res.status(422).json({ ok: false });
    }
  }
}
