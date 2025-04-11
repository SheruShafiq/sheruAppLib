import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./Pages/Home";
import Four0Four from "./Pages/404";
import "./App.css";
import { SnackbarProvider } from "notistack";
import { createRef } from "react";
import CustomSnackbar from "./Components/CustomSnackbar";
import Post from "./Pages/Post";
import SignUpAndLogin from "./Components/SignUpAndLogin";
import { fetchUserById } from "./APICalls";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CustomErrorSnackBar from "./Components/CustomErrorSnackBar";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    secondary: {
      main: "rgb(194 82 128)",
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
      main: "rgb(194 82 128)",
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

  const notistackRef = createRef();
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return userID || false;
  });
  const [loginDialogue, setLogInDialogue] = useState(false);

  function getUserData(userID) {
    fetchUserById(
      userID,
      (userData) => {
        setUserData(userData);
      },
      (error) => {
        notistackRef.current.enqueueSnackbar(error.message, {
          variant: "error",
        });
      }
    );
  }
  useEffect(() => {
    if (userID) {
      getUserData(userID);
    }
  }, [userID]);

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
          <Route
            path="/:pageNumber?"
            element={
              <Home
                setIsLoggedIn={setIsLoggedIn}
                userData={userData}
                setOpen={setLogInDialogue}
                isLoggedIn={isLoggedIn}
                refreshUserData={getUserData}
              />
            }
          />
          <Route path="*" element={<Four0Four />} />
          <Route
            path="/posts/:id"
            element={
              <Post
                setIsLoggedIn={setIsLoggedIn}
                userData={userData}
                setOpen={setLogInDialogue}
                isLoggedIn={isLoggedIn}
              />
            }
          />
        </Routes>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
