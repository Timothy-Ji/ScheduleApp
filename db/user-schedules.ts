import { firestore as db } from "./firebase-admin";
import AppUser from "../model/AppUser";
import { async } from "@firebase/util";

const userschedulesdb = db.collection("user-schedules");
const getOwner = async (scheduleId: string): Promise<string> => {
  const query = await userschedulesdb
    .where("scheduleId", "==", scheduleId)
    .limit(1)
    .get();

  return query.docs[0].data().userId;
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
  deleteByScheduleId,
};

export default userschedules;
