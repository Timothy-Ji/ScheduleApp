import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

const DeleteButton = (props: {
  onClick: () => void;
  disableConfirmation?: boolean;
  confirmMessage?: string;
}) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const confirmMessage =
    props.confirmMessage || "Deleting is permanent and cannot be reversed.";

  const handleClick = () => {
    setOpenConfirm(true);
  };

  const handleConfirm = () => {
    setOpenConfirm(false);
    props.onClick();
  };

  const handleClose = () => {
    setOpenConfirm(false);
  };

  return (
    <Box sx={{ marginX: "auto" }}>
      <Box onClick={handleClick} sx={{ width: 24, height: 24 }}>
        <Tooltip title="Delete">
          <DeleteIcon color="error" sx={{ cursor: "pointer" }} />
        </Tooltip>
      </Box>
      <Dialog
        open={openConfirm}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Do not delete</Button>
          <Button variant="outlined" onClick={handleConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteButton;
