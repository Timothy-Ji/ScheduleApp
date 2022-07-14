import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material";
import GlobalTheme from "../themes/Global";
import { ThemeContextProvider } from "../context/ThemeContext";
import { AuthContextProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <ThemeProvider theme={GlobalTheme}>
        <ThemeContextProvider>
          <Component {...pageProps} />
        </ThemeContextProvider>
      </ThemeProvider>
    </AuthContextProvider>
  );
}

export default MyApp;
