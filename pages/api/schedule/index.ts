import type { NextApiRequest, NextApiResponse } from "next";
import { addSchedule } from "../../../db/schedule";
import userschedules from "../../../db/user-schedules";
import ScheduleModel, { ScheduleSchema } from "../../../model/Schedule";
import { getAuthInfoFromRequest } from "../../../util/getAuthInfo";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScheduleModel[] | ScheduleModel | {} | []>
) {
  const authInfo = await getAuthInfoFromRequest(req);

  if (!authInfo.authenticated) {
    res.status(401).json({
      ok: false,
      message: "You must be authenticated to access this resource",
    });
    return;
  }

  if (req.method === "GET") {
    let schedules = [];

    if (req.query.owned !== null) {
      const owned = await userschedules.getSchedules(authInfo.uid);
      schedules = [...schedules, ...owned];
    }

    res.status(200).json(schedules);
  } else if (req.method === "POST") {
    if (!req.body.schedule) {
      res.status(400).json({ ok: false });
    }
    const schema = ScheduleSchema.omit({
      id: true,
      dateCreated: true,
      lastModified: true,
    });

    const scheduleParseResult = schema.safeParse(req.body.schedule);
    if (scheduleParseResult.success) {
      const addedSchedule = await addSchedule(scheduleParseResult.data);
      await userschedules.add(authInfo.uid, addedSchedule.id);
      res.status(200).json(addedSchedule);
    } else if (scheduleParseResult.success === false) {
      res.status(422).json({ ok: false, error: scheduleParseResult.error });
    }
  }
}
