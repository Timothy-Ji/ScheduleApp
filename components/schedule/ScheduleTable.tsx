import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ScheduleModel from "../../model/Schedule";
import Favorite from "../Favorite";
import EditButton from "../EditButton";
import DeleteButton from "../DeleteButton";
import { Grid, Typography } from "@mui/material";
import WebAssetOffIcon from "@mui/icons-material/WebAssetOff";
import { GridRenderCellParams } from "@mui/x-data-grid";
import AuthContext from "../../context/AuthContext";
import useHttp from "../../hooks/useHttp";
import AppUser from "../../model/AppUser";

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
        <Typography>No schedules.</Typography>
      </Grid>
    </Grid>
  );
};

export default function ScheduleTable(props: {
  disablePagination?: boolean;
  schedules: ScheduleModel[];
  favoriteIds: string[];
  onEdit: (id: string) => void;
  onFavoriteChange: (id: string, isFavorited: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const authCtx = useContext(AuthContext);
  const http = useHttp();
  const [ownerMap, setOwnerMap] = useState(new Map<string, AppUser>());

  useEffect(() => {
    (async () => {
      const scheduleIds = props.schedules.map((sched) => sched.id);
      const get = http.get;
      const newOwnerMap = new Map<string, AppUser>();
      for (let scheduleId of scheduleIds) {
        const owner: AppUser = await get(`/api/schedule/${scheduleId}/owner`);
        newOwnerMap.set(scheduleId, owner);
      }
      setOwnerMap(newOwnerMap);
    })();
  }, [props.schedules, http.get]);

  const columns: GridColDef[] = [
    {
      field: "edit",
      headerName: "",
      type: "actions",
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 50,
      renderCell: (params: GridRenderCellParams) => (
        <EditButton onClick={() => props.onEdit(params.row.id)} />
      ),
    },
    // {
    //   field: "favorite",
    //   headerName: "",
    //   type: "actions",
    //   sortable: false,
    //   filterable: false,
    //   disableColumnMenu: true,
    //   width: 50,
    //   renderCell: (params: GridRenderCellParams) => (
    //     <Favorite
    //       isFavorited={params.row.favorite}
    //       onClick={() =>
    //         props.onFavoriteChange(params.row.id, !params.row.favorite)
    //       }
    //     />
    //   ),
    // },
    {
      field: "title",
      headerName: "Schedule",
      width: 200,
      hideable: false,
    },
    {
      field: "description",
      headerName: "Description",
      width: 300,
    },
    {
      field: "lastModified",
      headerName: "Last modified",
      width: 150,
    },
    {
      field: "owner",
      headerName: "Owner",
      width: 150,
      valueFormatter(params) {
        if (params.value?.uid === authCtx.uid) return "me";
        return params.value?.email;
      },
    },
    {
      field: "delete",
      headerName: "",
      sortable: false,
      type: "actions",
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      width: 50,
      align: "right",
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.owner?.uid !== authCtx.uid) {
          return <div></div>;
        }
        return (
          <DeleteButton
            onClick={() => {
              props.onDelete(params.row.id);
            }}
          />
        );
      },
    },
  ];

  const rows = props.schedules.map((schedule) => {
    return {
      id: schedule.id,
      // favorite: props.favoriteIds.includes(schedule.id),
      title: schedule.title,
      description: schedule.description,
      dateCreated: new Date(schedule.dateCreated).toLocaleString("en-US", {
        day: "numeric",
        year: "numeric",
        month: "long",
      }),
      lastModified: new Date(schedule.lastModified).toLocaleString("en-US", {
        day: "numeric",
        year: "numeric",
        month: "long",
      }),
      owner: ownerMap.get(schedule.id),
    };
  });

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        components={
          !props.disablePagination
            ? {
                Pagination: null,
                Footer: () => <div></div>,
                NoRowsOverlay,
              }
            : {}
        }
      />
    </Box>
  );
}
