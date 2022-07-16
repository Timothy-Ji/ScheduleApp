import { firestore as db } from "./firebase-admin";
import ScheduleModel, { ScheduleEvent } from "../model/Schedule";
import userschedules from "./user-schedules";

const timestampToDate = (schedule: any) => {
  return {
    ...schedule,
    dateCreated: new Date(schedule.dateCreated.toDate()),
    lastModified: new Date(schedule.lastModified.toDate()),
  };
};

const schedules = db.collection("schedule");

export const getSchedules = async (): Promise<ScheduleModel[]> => {
  const snapshot = await schedules.get();
  const scheduleList: ScheduleModel[] = snapshot.docs.map((schedule) =>
    timestampToDate(schedule.data())
  );

  return scheduleList;
};

export const getScheduleById = async (id: string): Promise<ScheduleModel> => {
  const docSnap = await schedules.doc(id).get();
  if (docSnap.exists) {
    return timestampToDate(docSnap.data());
  } else {
    return Promise.reject("Schedule does not exist");
  }
};

export const addSchedule = async (schedule: any): Promise<ScheduleModel> => {
  const newDocRef = await schedules.add({
    ...schedule,
    dateCreated: new Date(),
    lastModified: new Date(),
  });
  newDocRef.set({ id: newDocRef.id }, { merge: true });
  return { ...schedule, id: newDocRef.id };
};

export const updateSchedule = async (
  id: string,
  updatedSchedule: ScheduleModel | { events: ScheduleEvent }
): Promise<ScheduleModel> => {
  const scheduleRef = schedules.doc(id);

  await scheduleRef.update({
    ...updatedSchedule,
    lastModified: new Date(),
  });

  return (await scheduleRef.get()).data();
};

export const deleteSchedule = async (
  id: string
): Promise<FirebaseFirestore.WriteResult> => {
  userschedules.deleteByScheduleId(id);
  return await schedules.doc(id).delete();
};
