import { Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";

const EditButton = (props: { onClick: () => void }) => {
  const handleClick = () => {
    props.onClick();
  };

  return (
    <Box onClick={handleClick} sx={{ marginX: "auto", height: 24, width: 24 }}>
      <Tooltip title="Edit">
        <EditIcon sx={{ cursor: "pointer" }} />
      </Tooltip>
    </Box>
  );
};

export default EditButton;
