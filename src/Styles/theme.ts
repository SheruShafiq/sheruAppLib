import { createTheme, alpha } from "@mui/material/styles";

// Dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#ffffff" },
    secondary: { main: "rgb(255 0 105)" },
    success: { main: "rgb(137 255 137)" },
    error: { main: "rgb(230 109 109)" },
    warning: { main: "rgb(248 190 82)" },
    info: { main: "rgb(255 0 105)" },
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          maxWidth: "500px",
          width: "100%",
          minWidth: "280px",
          background: "#000",
          border: "1px solid #ffffff1f",
          borderRadius: "10px",
        },
        container: {
          background: "#00000096",
          alignItems: window.innerWidth > 768 ? "center" : "flex-start",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: alpha("#000", 0.5),
          color: "#fff",
          "&:focus": { backgroundColor: alpha("#000", 0.5) },
        },
        icon: { color: "#fff" },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { backgroundColor: alpha("#000", 0.5), color: "#fff" },
      },
    },
    MuiList: {
      styleOverrides: {
        root: { backgroundColor: "black", color: "#fff" },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { backgroundColor: alpha("#000", 1) },
      },
    },
  },
});

export default darkTheme;
