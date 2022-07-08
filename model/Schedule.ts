import { z } from "zod";

export const ScheduleEventSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1).max(40),
  description: z.string().max(100).optional(),
  startTime: z.number().min(0).max(10080),
  endTime: z.number().min(0).max(10080),
});

export const ScheduleSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(40),
  description: z.string().max(100).optional(),
  dateCreated: z.date(),
  lastModified: z.date(),
  events: ScheduleEventSchema.array().optional(),
});

export type ScheduleEvent = z.infer<typeof ScheduleEventSchema>;

type Schedule = z.infer<typeof ScheduleSchema>;
export default Schedule;
