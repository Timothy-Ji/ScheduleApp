import { firestore as db } from "../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore/lite";
import ScheduleModel, { ScheduleEvent } from "../model/Schedule";

const timestampToDate = (schedule: any) => {
  return {
    ...schedule,
    dateCreated: new Date(schedule.dateCreated.toDate()),
    lastModified: new Date(schedule.lastModified.toDate()),
  };
};

const scheduleCollection = collection(db, "schedule");
export const getSchedules = async (): Promise<ScheduleModel[]> => {
  const scheduleSnapshot = await getDocs(scheduleCollection);
  const scheduleList: ScheduleModel[] = scheduleSnapshot.docs.map((schedule) =>
    timestampToDate(schedule.data())
  );

  return scheduleList;
};

export const getScheduleById = async (id: string): Promise<ScheduleModel> => {
  const docSnap = await getDoc(doc(db, "schedule", id));
  if (docSnap.exists()) {
    return timestampToDate(docSnap.data());
  } else {
    return Promise.reject("Schedule does not exist");
  }
};

export const addSchedule = async (schedule: any): Promise<ScheduleModel> => {
  const newDocRef = doc(scheduleCollection);
  await setDoc(newDocRef, {
    ...schedule,
    id: newDocRef.id,
    dateCreated: serverTimestamp(),
    lastModified: serverTimestamp(),
  });

  return { ...schedule, id: newDocRef.id };
};

export const updateSchedule = async (
  id: string,
  updatedSchedule: ScheduleModel | { events: ScheduleEvent }
): Promise<ScheduleModel> => {
  const scheduleRef = doc(db, "schedule", id);

  await updateDoc(scheduleRef, {
    ...updatedSchedule,
    lastModified: serverTimestamp(),
  });
  return (await getDoc(scheduleRef)).data();
};

export const deleteSchedule = async (id: string): Promise<void> => {
  return await deleteDoc(doc(db, "schedule", id));
};
