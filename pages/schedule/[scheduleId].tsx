import { Card, Container, Grid, Typography } from "@mui/material";
import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import EditScheduleForm from "../../components/schedule/EditScheduleForm";
import ScheduleEventsTable from "../../components/schedule/ScheduleEventsTable";
import SchedulePermissions from "../../components/schedule/SchedulePermissions";
import { getScheduleById } from "../../db/schedule";
import userschedules from "../../db/user-schedules";
import useHttp from "../../hooks/useHttp";
import ScheduleModel, { ScheduleEvent } from "../../model/Schedule";
import getAuthInfo from "../../util/getAuthInfo";

const Schedule: NextPage<{ schedule: ScheduleModel }> = (props) => {
  const [schedule, setSchedule] = useState(props.schedule);
  const http = useHttp();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bufferEvents, setBufferEvents] = useState<ScheduleEvent[]>(
    schedule?.events
  );

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
      JSON.stringify(props.schedule?.events) !== JSON.stringify(bufferEvents)
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
  }, [bufferEvents, props.schedule?.id, httpput, props.schedule?.events]);

  if (!schedule) {
    return (
      <Container sx={{ marginTop: 2 }}>
        <Typography align="center">
          You do not have permission to access this page. If you believe this is
          an error try refreshing the page.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ marginY: 2 }}>
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
              <Typography variant="h6">Events</Typography>
              <ScheduleEventsTable
                schedule={schedule}
                isSaving={isSaving}
                onEventsMismatch={handleEventChange}
              />
            </Container>
          </Card>
        </Grid>
        <Grid item>
          <Card raised>
            <Container sx={{ marginY: 4 }}>
              <Typography variant="h6">User Permissions</Typography>
              <SchedulePermissions scheduleId={schedule.id} />
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
    const authInfo = await getAuthInfo(context);
    const scheduleOwnerId = await userschedules.getOwner(scheduleId);
    const sharedIds = await userschedules.getShared(scheduleId);
    if (authInfo.uid === scheduleOwnerId || sharedIds.includes(authInfo.uid)) {
      return {
        props: {
          schedule: JSON.parse(
            JSON.stringify(await getScheduleById(scheduleId))
          ),
        },
      };
    }

    return {
      props: {},
    };
  }
};

export default Layout(Schedule);
