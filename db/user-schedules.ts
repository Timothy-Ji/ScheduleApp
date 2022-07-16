import { firestore as db } from "./firebase-admin";
import ScheduleModel from "../model/Schedule";
import schedule from "./schedule";

const userschedulesdb = db.collection("user-schedules");
const getOwner = async (scheduleId: string): Promise<string> => {
  const query = await userschedulesdb
    .where("scheduleId", "==", scheduleId)
    .limit(1)
    .get();

  return query.docs[0].data().userId;
};

const getSchedules = async (ownerId: string): Promise<ScheduleModel[]> => {
  const relationQuerySnap = await userschedulesdb
    .where("userId", "==", ownerId)
    .get();
  const schedIds = relationQuerySnap.docs.map(
    (docSnap) => docSnap.data().scheduleId
  );
  
  return await schedule.getByIds(schedIds);
};

const add = async (userId: string, scheduleId: string) => {
  await userschedulesdb.add({
    userId,
    scheduleId,
  });
};

const deleteByScheduleId = async (scheduleId: string) => {
  const querySnap = await userschedulesdb
    .where("scheduleId", "==", scheduleId)
    .get();
  querySnap.forEach((docSnap) => docSnap.ref.delete());
};

const userschedules = {
  getOwner,
  add,
  getSchedules,
  deleteByScheduleId,
};

export default userschedules;
