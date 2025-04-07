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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
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
        maxSnack={3}
        autoHideDuration={2000}
        ref={notistackRef}
        Components={{
          error: (props) => (
            <CustomSnackbar {...props} severity="error" variant="outlined" />
          ),
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
            path="/"
            element={
              <Home
                setIsLoggedIn={setIsLoggedIn}
                userData={userData}
                setOpen={setLogInDialogue}
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route path="*" element={<Four0Four />} />
          <Route path="/posts/:id" element={<Post isLoggedIn={isLoggedIn} />} />
        </Routes>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
