import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Container,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { GetServerSidePropsContext, NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import AddSchedule from "../components/schedule/AddSchedule";
import ScheduleTable from "../components/schedule/ScheduleTable";
import useHttp from "../hooks/useHttp";
import ScheduleModel from "../model/Schedule";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useRouter } from "next/router";
import getAuthInfo from "../util/getAuthInfo";

const MySchedules: NextPage<{ schedules: ScheduleModel[] }> = (props) => {
  const [schedules, setSchedules] = useState(props.schedules || []);
  const [isLoading, setIsLoading] = useState(true);
  const [adding, setAdding] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const http = useHttp();
  const router = useRouter();

  const fetchFavorites = useCallback(async () => {
    const get = http.get;
    const favorites = await get<string[]>("/api/schedule/favorites");
    setFavorites(favorites);
  }, [http.get]);

  const fetchSchedules = useCallback(async () => {
    const get = http.get;
    const schedules = await get<ScheduleModel[]>("/api/schedule?owned");
    await fetchFavorites();
    setSchedules(schedules);
    setIsLoading(false);
  }, [http.get, fetchFavorites]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleDelete = async (id: string) => {
    setSchedules((schedules) => schedules.filter((s) => s.id !== id));
    await http.delete("/api/schedule/" + id);
    await fetchSchedules();
  };

  const handleFavoriteChange = async (id: string, isFavorited: boolean) => {
    if (isFavorited) {
      await http.post(
        `/api/schedule/favorites`,
        {},
        {
          scheduleId: id,
        }
      );
    } else {
      await http.delete(
        `/api/schedule/favorites`,
        {},
        {
          scheduleId: id,
        }
      );
    }
    await fetchFavorites();
  };

  const handleEdit = async (id: string) => {
    router.push("/schedule/" + id);
  };

  const handleAdd = async (schedule: {
    description?: string | undefined;
    title: string;
  }) => {
    setAdding((a) => ++a);
    await http.post(
      "/api/schedule",
      {},
      {
        schedule: { ...schedule, events: [] },
      }
    );
    await fetchSchedules();
    setAdding((a) => --a);
  };

  return (
    <Container maxWidth="xl" sx={{ marginTop: 2 }}>
      <Card raised>
        <Container sx={{ marginY: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ marginX: 1 }}
          >
            <Typography gutterBottom variant="h5">
              My Schedules
            </Typography>
            {isLoading && <CircularProgress size={24} />}
            {!isLoading && (
              <RefreshIcon
                onClick={() => {
                  setIsLoading(true);
                  fetchSchedules();
                }}
                sx={{ cursor: "pointer" }}
              />
            )}
          </Box>
          <Box sx={{ marginY: 2 }}>
            <ScheduleTable
              schedules={schedules}
              onDelete={handleDelete}
              favoriteIds={favorites}
              onFavoriteChange={handleFavoriteChange}
              onEdit={handleEdit}
            />
            {adding !== 0 && (
              <Paper elevation={1} sx={{ marginY: 1 }}>
                <Alert severity="info">Adding new schedule...</Alert>
                <LinearProgress sx={{ w: 1 }} />
              </Paper>
            )}
          </Box>
          <Box display="flex" justifyContent="right" sx={{ align: "right" }}>
            <AddSchedule onAdd={handleAdd} />
          </Box>
        </Container>
      </Card>
    </Container>
  );
};

export default Layout(MySchedules);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getAuthInfo(context);
  return { props: { schedules: [] } };
}
