import type { NextApiRequest, NextApiResponse } from "next";

let FAVORITES: string[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const scheduleId = req.body.scheduleId;
  if (req.method === "GET") {
    res.status(200).json(FAVORITES);
  } else if (req.method === "POST") {
    if (scheduleId === null) {
      res.status(400).json({ ok: false });
    } else {
      FAVORITES.push(scheduleId);
      res.status(200).json({ ok: true });
    }
  } else if (req.method === "DELETE") {
    if (scheduleId === null) {
      res.status(400).json({ ok: false });
    } else {
      FAVORITES = FAVORITES.filter((id) => id !== scheduleId);
      res.status(200).json({ ok: true });
    }
  }
}
