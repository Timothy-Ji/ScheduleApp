import type { NextApiRequest, NextApiResponse } from "next";
import {
  deleteSchedule,
  getScheduleById,
  updateSchedule,
} from "../../../../db/schedule";
import { ScheduleSchema } from "../../../../model/Schedule";

const baseScheduleSchema = ScheduleSchema.pick({
  title: true,
  description: true,
  events: true,
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const scheduleId = <string>req.query.scheduleId;
  if (req.method === "GET") {
    try {
      const schedule = await getScheduleById(scheduleId);
      res.status(200).json(schedule);
    } catch (e) {
      res.status(404).json({ ok: false });
    }
  } else if (req.method === "PUT") {
    try {
      const updatedSchedule = req.body.schedule;
      const scheduleParseResult = baseScheduleSchema.safeParse(updatedSchedule);
      if (scheduleParseResult.success) {
        const schedule = scheduleParseResult.data;
        const updatedSchedule = await updateSchedule(scheduleId, schedule);

        res.status(200).json(updatedSchedule);
      } else {
        res.status(422).json({ ok: false });
      }
    } catch {
      res.status(400).json({ ok: false });
    }
  } else if (req.method === "DELETE") {
    try {
      deleteSchedule(scheduleId);
      res.status(200).json({ ok: true });
    } catch {
      res.status(400).json({ ok: false });
    }
  }
}
