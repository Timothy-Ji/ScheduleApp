import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import ScheduleModel, { ScheduleSchema } from "../../model/Schedule";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const schema = ScheduleSchema.pick({ title: true, description: true });
type BasicScheduleData = z.infer<typeof schema>;

const EditScheduleForm = (props: {
  schedule: ScheduleModel;
  onEdit: (updatedSchedule: ScheduleModel) => void;
  updating?: boolean;
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm<BasicScheduleData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: props.schedule.title,
      description: props.schedule.description,
    },
  });

  const handleEdit = (data: BasicScheduleData) => props.onEdit(data);

  useEffect(() => {
    reset({
      title: props.schedule.title,
      description: props.schedule.description,
    });
  }, [props.schedule, reset]);

  return (
    <form>
      <Controller
        name="title"
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
            multiline
            variant="standard"
          />
        )}
      />
      <Box display="flex" justifyContent={"right"}>
        <Box>
          <Button
            variant="contained"
            disabled={!isDirty || props.updating}
            onClick={handleSubmit(handleEdit)}
            sx={{ width: 150 }}
          >
            {props.updating ? <CircularProgress size={24.5} /> : "Update"}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default EditScheduleForm;
