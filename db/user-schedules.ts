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

  const sharedQuery = await userschedulesdb
    .where("shared", "array-contains", ownerId)
    .get();
  const sharedSchedIds = sharedQuery.docs.map(
    (docSnap) => docSnap.data().scheduleId
  );

  return await schedule.getByIds([...schedIds, ...sharedSchedIds]);
};

const add = async (userId: string, scheduleId: string) => {
  await userschedulesdb.add({
    userId,
    scheduleId,
    shared: [],
  });
};

const addShared = async (scheduleId: string, userId: string) => {
  const docSnap = await getDoc(scheduleId);
  const shared: string[] = docSnap.data().shared;
  if (!shared.includes(scheduleId)) {
    shared.push(userId);
    docSnap.ref.update("shared", shared);
  }
};
const getDoc = async (scheduleId: string) => {
  const querySnap = await userschedulesdb
    .where("scheduleId", "==", scheduleId)
    .limit(1)
    .get();
  const docSnap = querySnap.docs[0];
  return docSnap;
};
const deleteShared = async (scheduleId: string, userId: string) => {
  const docSnap = await getDoc(scheduleId);
  const shared = docSnap.data().shared.filter((uid) => uid !== userId);
  docSnap.ref.update("shared", shared);
};

const getShared = async (scheduleId: string): Promise<string[]> => {
  const docSnap = await getDoc(scheduleId);
  const shared: string[] = docSnap.data().shared;

  return shared || [];
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
  addShared,
  deleteShared,
  getShared,
};

export default userschedules;
