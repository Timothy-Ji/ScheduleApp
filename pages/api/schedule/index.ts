import type { NextApiRequest, NextApiResponse } from "next";
import { addSchedule, getSchedules } from "../../../db/schedule";
import ScheduleModel, { ScheduleSchema } from "../../../model/Schedule";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScheduleModel[] | ScheduleModel | {} | []>
) {
  if (req.method === "GET") {
    const schedules: ScheduleModel[] = await getSchedules();

    if (req.query.owned !== undefined) res.status(200).json(schedules);
    else res.status(401).json([]);
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
      res.status(200).json(addedSchedule);
    } else {
      res.status(422).json({ ok: false, error: scheduleParseResult.error });
    }
  }
}
