import AccountCircle from "@mui/icons-material/AccountCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import useHttp from "../../hooks/useHttp";
import AppUser from "../../model/AppUser";

export const SchedulePermissionUserItem = (props: {
  isOwner?: boolean;
  user: AppUser;
  onDelete?: () => void;
  isAppUserOwner: boolean;
}) => {
  return (
    <Box>
      <Paper elevation={1} sx={{ backgroundColor: "#d7d7d7" }}>
        <Container sx={{ paddingY: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex">
              <AccountCircle sx={{ marginX: 1 }} />
              <Typography>{props.user.email}</Typography>
            </Box>
            <Box display="flex">
              <Typography
                variant="subtitle1"
                fontWeight="700"
                sx={{ marginX: 1 }}
              >
                {props.isOwner ? "Owner" : "Editor"}
              </Typography>
              {!props.isOwner && props.isAppUserOwner && (
                <DeleteIcon
                  onClick={() => props.onDelete()}
                  sx={{ cursor: "pointer" }}
                />
              )}
            </Box>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

const SchedulePermissions = (props: {
  scheduleId: string;
  isAppUserOwner: boolean;
}) => {
  const [shared, setShared] = useState<AppUser[]>([]);
  const [owner, setOwner] = useState<AppUser>();
  const [userEmailInput, setUserEmailInput] = useState("");
  const authCtx = useContext(AuthContext);
  const http = useHttp();

  const fetchPermissions = useCallback(async () => {
    const httpget = http.get;
    const perms: {
      owner: AppUser;
      shared: AppUser[];
    } = await httpget(`/api/schedule/${props.scheduleId}/permissions`);
    const owner = perms.owner;
    const shared = perms.shared;
    setOwner(owner);
    setShared(shared);
  }, [http.get, props.scheduleId]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const deleteUser = async (uid: string) => {
    const httpdelete = http.delete;
    try {
      setShared((shared) => shared.filter((s) => s.uid !== uid));
      await httpdelete(
        `/api/schedule/${props.scheduleId}/permissions`,
        {},
        { userId: uid }
      );
    } catch (e) {
      await fetchPermissions();
    }
  };

  const addUser = async (email: string) => {
    const httppost = http.post;
    try {
      const addedUser: AppUser = await httppost(
        `/api/schedule/${props.scheduleId}/permissions`,
        {},
        { userEmail: email }
      );
      if (addedUser.email) setShared((shared) => [...shared, addedUser]);
    } catch (e) {
      await fetchPermissions();
    }
  };

  const isAppUserOwner = owner?.uid === authCtx.uid;

  return (
    <Box>
      {owner && (
        <SchedulePermissionUserItem
          user={owner}
          isOwner={true}
          isAppUserOwner={isAppUserOwner}
        />
      )}
      {shared &&
        shared.map((user) => {
          return (
            <SchedulePermissionUserItem
              key={user.uid}
              user={user}
              onDelete={() => {
                deleteUser(user.uid);
              }}
              isAppUserOwner={isAppUserOwner}
            />
          );
        })}
      ;
      <Box
        display="flex"
        sx={{ m: 2 }}
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          fullWidth
          id="email"
          label="Email"
          value={userEmailInput}
          onChange={(event) => setUserEmailInput(event.target.value)}
          sx={{ marginX: 1 }}
        />
        <Button
          variant="contained"
          sx={{ marginX: 1 }}
          onClick={() => {
            addUser(userEmailInput);
            setUserEmailInput("");
          }}
        >
          Share
        </Button>
      </Box>
    </Box>
  );
};

export default SchedulePermissions;
