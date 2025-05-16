import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import SauceHome from "./Pages/SauceHome";
import Four0Four from "./Pages/404";
import { SnackbarProvider } from "notistack";
import { createRef } from "react";
import CustomSnackbar from "./Components/CustomSnackbar";
import Post from "./Pages/Post";
import SignUpAndLogin from "./Components/SignUpAndLogin";
import { fetchUserById, fetchCategories } from "./APICalls";
import { ThemeProvider, alpha, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CustomErrorSnackBar from "./Components/CustomErrorSnackBar";
import { Category, errorProps, User } from "../dataTypeDefinitions";
import { useSnackbar } from "notistack";
import BadgeMakerHome from "./Pages/BadgeMakerHome";
import React from "react";
import { Buffer } from "buffer";
import UserProfilePage from "./Pages/UserProfilePage";
import { Global } from "@emotion/react";
import Home from "./Pages/Home.tsx";
import CV from "./Pages/CV.js";



declare module "notistack" {
  interface VariantOverrides {
    login: true;
  }
}

globalThis.Buffer = Buffer;
globalThis.isDesktop = window.innerWidth > 768;
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    secondary: {
      main: "rgb(255 0 105)",
    },
    primary: {
      main: "#ffffff",
    },
    success: {
      main: "rgb(137 255 137)",
    },
    error: {
      main: "rgb(230 109 109)",
    },
    warning: {
      main: "rgb(248 190 82)",
    },
    info: {
      main: "rgb(255 0 105)",
    },
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
          alignItems: globalThis.isDesktop ? "center" : "flex-start", 
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: alpha("#000", 0.5),
          color: "#fff",
          "&:focus": {
            backgroundColor: alpha("#000", 0.5),
          },
        },
        icon: {
          color: "#fff",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#000", 0.5),
          color: "#fff",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: "black",
          color: "#fff",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#000", 1),
        },
      },
    },
  },
});
function App() {
  const [userID, setUserID] = useState(
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("userID="))
      ?.split("=")[1]
  );
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState<Category[]>([]);
  const notistackRef = createRef<SnackbarProvider>();
  const [userData, setUserData] = useState<User>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDialogue, setLogInDialogue] = useState(false);

  function getUserData(userID: string) {
    fetchUserById(
      userID,
      (userData: User) => {
        setUserData(userData);
        setIsLoggedIn(true);
      },
      (error: any) => {
        const err: errorProps = {
          id: "fetching User Data Error",
          userFriendlyMessage:
            "An error occurred while fetching user data, try to log in again.",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        document.cookie =
          "userID=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        enqueueSnackbar({ variant: "error", ...err });
      }
    );
  }
  useEffect(() => {
    if (userID) {
      getUserData(userID);
    }
  }, [userID]);

  useEffect(() => {
    fetchCategories(
      (categories) => {
        setCategories(categories);
      },
      (error) => {
        const err: errorProps = {
          id: "fetching Categories Error",
          userFriendlyMessage: "An error occurred while fetching categories.",
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          error: error instanceof Error ? error : new Error("Unknown error"),
        };
        enqueueSnackbar({ variant: "login", ...err });
      }
    );
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SnackbarProvider
        disableWindowBlurListener={true}
        maxSnack={3}
        autoHideDuration={3000}
        ref={notistackRef}
        Components={{
          error: (props) => <CustomErrorSnackBar {...props} />,
          login: (props) => (
            <CustomSnackbar
              {...props}
              severity="info"
              login={true}
              handleLogin={() => {
                setLogInDialogue(true);
              }}
            />
          ),
          success: (props) => (
            <CustomSnackbar
              {...props}
              severity="success"
              handleLogin={() => {
                setLogInDialogue(true);
              }}
            />
          ),
          warning: (props) => (
            <CustomSnackbar
              {...props}
              severity="warning"
              handleLogin={() => {
                setLogInDialogue(true);
              }}
            />
          ),
          info: (props) => (
            <CustomSnackbar
              {...props}
              severity="info"
              handleLogin={() => {
                setLogInDialogue(true);
              }}
            />
          ),
        }}
      >
        <SignUpAndLogin
          isOpen={loginDialogue}
          setOpen={setLogInDialogue}
          setIsLoggedIn={setIsLoggedIn}
          setUserID={setUserID}
          setUserData={setUserData}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cv" element={<CV />} />
          <Route
            path="/sauce/:pageNumber?"
            element={
              <div className="APP_Sauce">
                <SauceHome
                  setIsLoggedIn={setIsLoggedIn}
                  userData={userData}
                  setOpen={setLogInDialogue}
                  isLoggedIn={isLoggedIn}
                  refreshUserData={getUserData}
                  categories={categories}
                />
              </div>
            }
          />

          <Route
            path="*"
            element={
              <Four0Four
                setIsLoggedIn={setIsLoggedIn}
                userData={userData}
                setOpen={setLogInDialogue}
                isLoggedIn={isLoggedIn}
                refreshUserData={getUserData}
                categories={categories}
              />
            }
          />
          <Route
            path="/posts/:id"
            element={
              <div className="APP_Sauce">
                <Post
                  refreshUserData={getUserData}
                  setIsLoggedIn={setIsLoggedIn}
                  userData={userData}
                  setOpen={setLogInDialogue}
                  isLoggedIn={isLoggedIn}
                  categories={categories}
                />
              </div>
            }
          />

          <Route
            path="/user/:id"
            element={
              <UserProfilePage
                refreshUserData={getUserData}
                setIsLoggedIn={setIsLoggedIn}
                loggedInUserData={userData}
                setOpen={setLogInDialogue}
                isLoggedIn={isLoggedIn}
                categories={categories}
              />
            }
          />
          <Route
            path="/sheru/appLibrary/badgeMaker"
            element={
              <div className="APP_BadgeMaker">
                <BadgeMakerHome />
              </div>
            }
          />
        </Routes>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
