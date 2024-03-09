// The material UI theme for the extension.
import { createTheme as muiCreateTheme } from "@mui/material/styles";

export const createTheme = function (prefersDarkMode: boolean) {
  return muiCreateTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light",
      primary: {
        main: "#f44336",
      },
    },
  });
};
