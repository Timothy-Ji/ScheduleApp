import { Card, Container, Grid, Typography } from "@mui/material";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import EditScheduleForm from "../../components/schedule/EditScheduleForm";
import ScheduleEventsTable from "../../components/schedule/ScheduleEventsTable";
import { getScheduleById } from "../../db/schedule";
import useHttp from "../../hooks/useHttp";
import ScheduleModel, { ScheduleEvent } from "../../model/Schedule";

const Schedule: NextPage<{ schedule: ScheduleModel }> = (props) => {
  // TODO: Auth Protection.
  const [schedule, setSchedule] = useState(props.schedule);
  const http = useHttp();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bufferEvents, setBufferEvents] = useState<ScheduleEvent[]>(schedule.events);

  const handleEdit = async (updatedSchedule: any) => {
    setIsUpdating(true);
    const updated: ScheduleModel = await http.put(
      `/api/schedule/${schedule.id}`,
      {},
      {
        schedule: updatedSchedule,
      }
    );
    setIsUpdating(false);
    setSchedule(updated);
  };

  const handleEventChange = (updatedEvents: ScheduleEvent[]) => {
    setBufferEvents(updatedEvents);
  };

  const httpput = http.put;
  useEffect(() => {
    let timeout = undefined;
    if (
      JSON.stringify(props.schedule.events) !== JSON.stringify(bufferEvents)
    ) {
      (async () => {
        setIsSaving(true);
        timeout = setTimeout(async () => {
          await httpput(
            "/api/schedule/" + props.schedule.id + "/events",
            {},
            {
              events: bufferEvents,
            }
          );
          setIsSaving(false);
        }, 1000);
      })();
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [bufferEvents, props.schedule.id, httpput, props.schedule.events]);

  return (
    <Container maxWidth="xl" sx={{ marginTop: 2 }}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Card raised>
            <Container sx={{ marginY: 4 }}>
              <EditScheduleForm
                schedule={schedule}
                onEdit={handleEdit}
                updating={isUpdating}
              />
            </Container>
          </Card>
        </Grid>
        <Grid item>
          <Card raised>
            <Container sx={{ marginY: 4 }}>
              <ScheduleEventsTable
                schedule={schedule}
                isSaving={isSaving}
                onEventsMismatch={handleEventChange}
              />
            </Container>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const scheduleId = context.params?.scheduleId as string;
  if (scheduleId) {
    return {
      props: {
        schedule: JSON.parse(JSON.stringify(await getScheduleById(scheduleId))),
      },
    };
  }
};

export default Layout(Schedule);
