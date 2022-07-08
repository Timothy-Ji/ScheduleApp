import { uuidv4 } from "@firebase/util";
import type { NextApiRequest, NextApiResponse } from "next";
import { updateSchedule } from "../../../../db/schedule";
import { ScheduleEvent, ScheduleEventSchema } from "../../../../model/Schedule";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const scheduleId = <string>req.query.scheduleId;
  console.log(scheduleId);
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
