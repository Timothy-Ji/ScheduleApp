import { uuidv4 } from "@firebase/util";
import type { NextApiRequest, NextApiResponse } from "next";
import { updateSchedule } from "../../../../db/schedule";
import userschedules from "../../../../db/user-schedules";
import { ScheduleEvent, ScheduleEventSchema } from "../../../../model/Schedule";
import { getAuthInfoFromRequest } from "../../../../util/getAuthInfo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const scheduleId = <string>req.query.scheduleId;
  const authInfo = await getAuthInfoFromRequest(req);
  const owner = await userschedules.getOwner(scheduleId);
  if (authInfo.uid !== owner) {
    res.status(403).json({
      ok: false,
      message: "You do not have permission to access this resource.",
    });
    return;
  }
  if (req.method === "PUT") {
    try {
      const updatedEvents = req.body.events;

      const eventsParseResult =
        ScheduleEventSchema.array().safeParse(updatedEvents);
      if (eventsParseResult.success) {
        let events: ScheduleEvent[] = eventsParseResult.data;

        events = events.map((event) => {
          if (event.id.startsWith("c/")) {
            return { ...event, id: uuidv4() };
          }
          return event;
        });

        const schedule = {
          events,
        };
        await updateSchedule(scheduleId, schedule);

        res.status(200).json({ ok: true });
      } else {
        res.status(422).json({ ok: false });
      }
    } catch (e) {
      res.status(400).json({ ok: false });
    }
  }
}
