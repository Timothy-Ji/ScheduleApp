import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { formatEventTime } from "../../util/EventTime";
import { useEffect, useState } from "react";
import DayOfWeek from "../../util/DayOfWeek";

const EventTimePicker = (props: {
  time: number;
  onTimeChange: (time: number) => void;
  mode: "view" | "edit";
}) => {
  const { mode, time, onTimeChange } = props;
  const [value, setValue] = useState<Date>(new Date(0, 0, 0, 0, time, 0, 0));
  const [weekday, setWeekday] = useState<number>(Math.floor(time / 1440));

  useEffect(() => {
    try {
      onTimeChange(weekday * 1440 + value.getHours() * 60 + value.getMinutes());
    } catch (e) {
      onTimeChange(NaN);
    }
  }, [onTimeChange, value, weekday]);

  if (mode === "view") {
    return (
      <Box>
        <Typography>{formatEventTime(props.time)}</Typography>
      </Box>
    );
  }
  return (
    <Box display="flex">
      <FormControl sx={{ m: 1 }}>
        <InputLabel id="weekday-select-label">Weekday</InputLabel>
        <Select
          labelId="weekday-select-label"
          id="weekday-select"
          value={weekday}
          label="Weekday"
          onChange={(newWeekday) => {
            setWeekday(newWeekday.target.value as number);
          }}
          sx={{ width: 150 }}
        >
          {DayOfWeek.map((weekday, index) => (
            <MenuItem key={index} value={index}>
              {weekday}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ m: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <TimePicker
            disableOpenPicker={true}
            label="Time"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} sx={{ width: 100 }} />
            )}
          />
        </LocalizationProvider>
      </Box>
    </Box>
  );
};

export default EventTimePicker;
