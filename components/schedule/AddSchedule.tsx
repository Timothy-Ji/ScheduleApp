import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ScheduleSchema } from "../../model/Schedule";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = ScheduleSchema.pick({ title: true, description: true });
type AddScheduleData = z.infer<typeof schema>;

export default function AddSchedule(props: {
  onAdd: (data: AddScheduleData) => void;
}) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddScheduleData>({ resolver: zodResolver(schema) });

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = (data: AddScheduleData) => {
    props.onAdd(data);
    setOpen(false);
    reset();
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Add
      </Button>
      <form>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Schedule</DialogTitle>
          <DialogContent>
            <Controller
              name="title"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.title?.message)}
                  helperText={errors.title?.message}
                  autoFocus
                  margin="dense"
                  id="title"
                  label="Title"
                  type="text"
                  fullWidth
                  variant="standard"
                  required={true}
                />
              )}
            />
            <Controller
              name="description"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={Boolean(errors.description?.message)}
                  helperText={errors.description?.message}
                  margin="dense"
                  id="description"
                  label="Description"
                  type="text"
                  fullWidth
                  variant="standard"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="outlined" onClick={handleSubmit(handleAdd)}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}
