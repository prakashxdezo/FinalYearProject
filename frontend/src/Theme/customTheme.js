import { createTheme } from "@mui/material/styles";

export const customTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1a1a2e" },
    secondary: { main: "#e85d04" },
    warning: { main: "#e85d04" },
    info: { main: "#0077b6" },
    success: { main: "#2d6a4f" },
  },
  typography: {
    fontFamily: "'Nunito', 'Roboto', sans-serif",
    h1: { fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 },
    h2: { fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        },
      },
    },
  },
});
