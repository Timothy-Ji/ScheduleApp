import { createTheme } from "@mui/material";

const GlobalTheme = createTheme({
  components: {
    MuiTypography: {
      // variants: [
      //   {
      //     props: {
      //       variant: "body2",
      //     },
      //     style: {
      //       fontSize: 9,
      //     },
      //   },
      // ],
    },
  },
});

export default GlobalTheme;
