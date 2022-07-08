import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { Tooltip } from "@mui/material";
import { Box } from "@mui/system";

const Favorite = (props: {
  isFavorited: boolean;
  onClick: (isFavorited: boolean) => void;
}) => {
  const handleClick = () => {
    props.onClick(!props.isFavorited);
  };

  return (
    <Box onClick={handleClick} sx={{ marginX: "auto", height: 24, width: 24 }}>
      <Tooltip title="Favorite">
        <>
          <StarIcon
            color="warning"
            sx={{
              display: props.isFavorited ? "block" : "none",
              cursor: "pointer",
            }}
          />
          <StarBorderIcon
            sx={{
              display: props.isFavorited ? "none" : "block",
              cursor: "pointer",
            }}
          />
        </>
      </Tooltip>
    </Box>
  );
};

export default Favorite;
