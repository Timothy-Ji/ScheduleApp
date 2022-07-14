import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import WebAssetOffIcon from "@mui/icons-material/WebAssetOff";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { v4 as uuidv4 } from "uuid";

import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  DataGrid,
  GridValueGetterParams,
  GridValueSetterParams,
  GridPreProcessEditCellProps,
  GridRenderCellParams,
  useGridApiContext,
  GridColDef,
} from "@mui/x-data-grid";
import {
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Schedule, {
  ScheduleEvent,
  ScheduleEventSchema,
} from "../../model/Schedule";
import { number } from "zod";
import { formatEventTime } from "../../util/EventTime";
import DayOfWeek from "../../util/DayOfWeek";
import EventTimePicker from "./EventTimePicker";

const StyledBox = styled(Box)(({ theme }) => ({
  height: 300,
  width: "100%",
  "& .MuiDataGrid-cell--editing": {
    backgroundColor: "rgb(255,215,115, 0.19)",
    color: "#1a3e72",
    "& .MuiInputBase-root": {
      height: "100%",
    },
  },
  "& .Mui-error": {
    backgroundColor: `rgb(126,10,15, ${
      theme.palette.mode === "dark" ? 0 : 0.1
    })`,
    color: theme.palette.error.main,
  },
}));

const NoRowsOverlay = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: 1, opacity: 0.65 }}
    >
      <Grid item>
        <WebAssetOffIcon />
      </Grid>
      <Grid item>
        <Typography>This schedule is empty.</Typography>
      </Grid>
    </Grid>
  );
};

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

const renderEventTimeCell = (params: GridRenderCellParams) => {
  return <Box>{formatEventTime(params.value)}</Box>;
};

const EventTimeEditInputCell = (props: GridRenderCellParams<number>) => {
  const [open, setOpen] = React.useState(false);
  const [buffer, setBuffer] = React.useState(props.value);

  const handleClickOpen = () => {
    setBuffer(props.value);
    setOpen(true);
  };

  const handleClose = () => {
    if (!isNaN(buffer)) {
      setOpen(false);
      console.log(buffer);

      apiRef.current.setEditCellValue({ id, field, value: buffer });
    } else {
    }
  };

  const { id, value, field } = props;
  const apiRef = useGridApiContext();

  const handleChange = React.useCallback((newValue: number | null) => {
    console.log(newValue);
    setBuffer(newValue);
  }, []);

  return (
    <Box sx={{ width: 1 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        onClick={handleClickOpen}
      >
        <Box>{formatEventTime(value)}</Box>
        <AccessTimeIcon />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <EventTimePicker
            time={value}
            onTimeChange={handleChange}
            mode="edit"
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const renderEventTimeEditInputCell: GridColDef["renderCell"] = (params) => {
  return <EventTimeEditInputCell {...params} />;
};

export default function ScheduleEventsTable(props: {
  schedule: Schedule;
  isSaving: boolean;
  onEventsMismatch: (updatedEvents: ScheduleEvent[]) => void;
}) {
  const isSaving = props.isSaving;
  const [newIds, setNewIds] = React.useState<string[]>([]);

  const EditToolbar = React.useCallback(
    (props: EditToolbarProps) => {
      const { setRows, setRowModesModel } = props;

      const handleClick = () => {
        // c/ is used as an identifier to identify client generated uuids.
        const id = "c/" + uuidv4();
        setNewIds((newIds) => [...newIds, id]);
        setRows((oldRows) => [
          ...oldRows,
          {
            id,
            title: "New Event",
            description: "",
            startTime: 1920,
            endTime: 2460,
          },
        ]);
        setRowModesModel((oldModel) => ({
          ...oldModel,
          [id]: { mode: GridRowModes.Edit, fieldToFocus: "title" },
        }));
      };

      return (
        <GridToolbarContainer>
          <Box display="flex" justifyContent="space-between" sx={{ width: 1 }}>
            <Button
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleClick}
            >
              Add event
            </Button>
            {isSaving && <CircularProgress size={24} />}
            {!isSaving && <CircleOutlinedIcon color="success" />}
          </Box>
        </GridToolbarContainer>
      );
    },
    [isSaving]
  );

  const events = props.schedule.events;

  const initialRows = events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
  }));

  const [pageSize, setPageSize] = React.useState<number>(5);
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel((rowModesModel) => ({
      ...rowModesModel,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel((rowModesModel) => ({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    }));
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows((rows) => rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel((rowModesModel) => ({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));

    const editedRow = rows.find((row) => row.id === id);
    if (newIds.includes(editedRow.id)) {
      setRows((rows) => rows.filter((row) => row.id !== id));
    }
  };

  React.useEffect(() => {
    if (JSON.stringify(rows) !== JSON.stringify(initialRows)) {
      props.onEventsMismatch(rows);
    }
  }, [initialRows, props, rows]);

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow };
    const result = ScheduleEventSchema.safeParse(updatedRow);
    if (!result.success) {
      setRowModesModel((rowModesModel) => ({
        ...rowModesModel,
        [updatedRow.id]: { mode: GridRowModes.Edit },
      }));
      return;
    } else {
      setNewIds((newIds) => newIds.filter((id) => id !== newRow.id));
      setRows((rows) =>
        rows.map((row) => (row.id === newRow.id ? updatedRow : row))
      );
      return updatedRow;
    }
  };

  const columns: GridColumns = [
    {
      field: "title",
      headerName: "Title",
      width: 200,
      hideable: false,
      editable: true,
      preProcessEditCellProps(params) {
        const result = ScheduleEventSchema.pick({ title: true }).safeParse({
          title: params.props.value,
        });
        return { ...params.props, error: !result.success };
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      editable: true,
      preProcessEditCellProps(params) {
        const result = ScheduleEventSchema.pick({
          description: true,
        }).safeParse({
          description: params.props.value,
        });

        return { ...params.props, error: !result.success };
      },
    },
    {
      field: "startTime",
      headerName: "Starts on",
      width: 180,
      editable: true,
      valueGetter: (params: GridValueGetterParams) => {
        return params.value;
      },
      valueSetter: (params: GridValueSetterParams) => {
        const startTime = parseInt(params.value);
        return { ...params.row, startTime };
      },
      preProcessEditCellProps(params: GridPreProcessEditCellProps) {
        const result = ScheduleEventSchema.pick({ startTime: true }).safeParse({
          startTime: parseInt(params.props.value),
        });

        return { ...params.props, error: !result.success };
      },
      renderCell: renderEventTimeCell,
      renderEditCell: renderEventTimeEditInputCell,
    },
    {
      field: "endTime",
      headerName: "Ends at",
      width: 180,
      editable: true,
      valueGetter: (params: GridValueGetterParams) => {
        return params.value;
      },
      valueSetter: (params: GridValueSetterParams) => {
        const endTime = parseInt(params.value);
        return { ...params.row, endTime };
      },
      preProcessEditCellProps(params) {
        const result = ScheduleEventSchema.pick({ endTime: true }).safeParse({
          endTime: parseInt(params.props.value),
        });

        return { ...params.props, error: !result.success };
      },
      renderCell: renderEventTimeCell,
      renderEditCell: renderEventTimeEditInputCell,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      hideable: false,
      sortable: false,
      filterable: false,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id + "-0"}
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={id + "-1"}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={id + "-2"}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={id + "-3"}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  const [hideIssue, setHideIssue] = React.useState(false);
  return (
    <Box>
      {!hideIssue && (
        <Alert
          severity="warning"
          onClose={() => {
            setHideIssue(true);
          }}
        >
          Known Issue: It may appear that you saved properly when you enter
          invalid data. Clicking outside the event row to see if the edit icon
          reverts back to a save icon.
        </Alert>
      )}
      <StyledBox
        sx={{
          height: 500,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => console.log(error)}
          rowsPerPageOptions={[5, 10]}
          pagination
          components={{
            Toolbar: EditToolbar,
            NoRowsOverlay,
          }}
          componentsProps={{
            toolbar: { setRows, setRowModesModel },
          }}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </StyledBox>
    </Box>
  );
}
