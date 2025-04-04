import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./Pages/Home";
import Four0Four from "./Pages/404";
import "./App.css";
import { SnackbarProvider } from "notistack";
import { createRef } from "react";
import CustomSnackbar from "./Components/CustomSnackbar";
import Post from "./Pages/Post";
import SignUpAndLogin from "./Components/SignUpAndLogin";
function App() {
  const notistackRef = createRef();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const userID = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userID="))
      ?.split("=")[1];
    return userID || false;
  });
  const [loginDialogue, setLogInDialogue] = useState(false);
  return (
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
            severity="warning"
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
      />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="*" element={<Four0Four />} />
        <Route path="/posts/:id" element={<Post isLoggedIn={isLoggedIn} />} />
      </Routes>
    </SnackbarProvider>
  );
}

export default App;
