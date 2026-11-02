
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#D71920",
      dark: "#A81219",
      light: "#FCE8E9",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#344054",
    },

    background: {
      default: "#F7F8FA",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#20232A",
      secondary: "#707782",
    },

    success: {
      main: "#198754",
    },

    warning: {
      main: "#E69B20",
    },

    error: {
      main: "#D71920",
    },

    divider: "#E8EAED",
  },

  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 600,
    },

    h4: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "9px 18px",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: "0 2px 12px rgba(16, 24, 40, 0.05)",
          border: "1px solid #E8EAED",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
