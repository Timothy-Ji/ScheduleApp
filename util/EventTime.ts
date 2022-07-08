import DayOfWeek from "./DayOfWeek";

export const format = (time: number, military?: boolean) => {
  const dayOfWeek = time / (60 * 24);
  time -= dayOfWeek * 60 * 24;
  let hour = time / 60;
  time -= hour * 60;
  const minute = time;

  let AMPM = "";
  if (!military) {
    AMPM = hour < 12 ? "AM" : "PM";
    if (hour === 0) hour = 12;
  }

  const fDow = DayOfWeek[dayOfWeek];
  return `${fDow} ${hour.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  })}:${minute.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`;
};
export const toEventTime = (
  dayOfWeek: number,
  hour: number,
  minute: number
) => {
  let time = 0;
  time += dayOfWeek * 60 * 24;
  time += hour * 60;
  time += minute;
  return time;
};
